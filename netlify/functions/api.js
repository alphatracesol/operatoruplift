// Express app exposed as a Netlify function
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getBurnTotalStore, incrBurnTotal } = require('../../src/utils/store');
const { Connection, PublicKey } = require('@solana/web3.js');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const admin = require('firebase-admin');
try { if (!admin.apps.length) admin.initializeApp(); } catch {}
const adminAuth = admin.auth();
const adminDb = admin.firestore();

const app = express();
app.use(bodyParser.json());
const corsOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : true;
app.use(cors({ origin: corsOrigins.split ? corsOrigins : (o, cb)=> {
  // support array and exact string matching
  if (corsOrigins === true) return cb(null, true);
  const origin = o || '';
  const allowed = Array.isArray(corsOrigins) ? corsOrigins : String(corsOrigins||'').split(',');
  if (!origin || allowed.includes(origin)) return cb(null, true);
  return cb(new Error('CORS not allowed'), false);
} }));

// Simple rate limiter (per IP) using Redis when available, or in-memory fallback
const RATE_WINDOW = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const RATE_MAX = Number(process.env.RATE_LIMIT_MAX || 120);
let rlMem = new Map();
async function rateLimiter(req, res, next) {
  try {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').toString();
    const now = Date.now();
    const key = `rl:${ip}`;
    // Try Redis via store internals (not exported). Fallback to memory.
    if (process.env.REDIS_URL) {
      try {
        const { createClient } = require('redis');
        if (!global.__rlredis) {
          const client = createClient({ url: process.env.REDIS_URL });
          client.on('error', () => {});
          await client.connect();
          global.__rlredis = client;
        }
        const client = global.__rlredis;
        const ttlKey = `${key}:${Math.floor(now / RATE_WINDOW)}`;
        const count = await client.incr(ttlKey);
        if (count === 1) await client.pExpire(ttlKey, RATE_WINDOW);
        if (count > RATE_MAX) return res.status(429).json({ error: 'rate_limited' });
        return next();
      } catch (e) { /* fall through to memory */ }
    }
    // Memory fallback
    const bucketKey = `${key}:${Math.floor(now / RATE_WINDOW)}`;
    const count = (rlMem.get(bucketKey) || 0) + 1;
    rlMem.set(bucketKey, count);
    // housekeeping
    if (rlMem.size > 1000) {
      const cutoff = now - RATE_WINDOW * 2;
      for (const k of rlMem.keys()) {
        const ts = Number(k.split(':').pop()) * RATE_WINDOW;
        if (ts < cutoff) rlMem.delete(k);
      }
    }
    if (count > RATE_MAX) return res.status(429).json({ error: 'rate_limited' });
    next();
  } catch { next(); }
}

app.use('/api/', rateLimiter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, cluster: process.env.SOLANA_CLUSTER || 'mainnet' });
});

app.get('/api/burn/total', async (req, res) => {
  try {
    const total = await getBurnTotalStore();
    res.json({ total });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

// Simple SSE stream emitting snapshots periodically
app.get('/api/burn/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders && res.flushHeaders();

  let active = true;
  async function push() {
    if (!active) return;
    try {
      const total = await getBurnTotalStore();
      res.write(`event: snapshot\n`);
      res.write(`data: ${JSON.stringify({ total })}\n\n`);
    } catch {}
  }
  const timer = setInterval(push, 15000);
  push();
  req.on('close', () => { active = false; clearInterval(timer); res.end(); });
});

// Placeholder points endpoint returning 0 until wallet lookup worker is added
app.get('/api/user/:wallet/points', async (req, res) => {
  try {
    const rate = Number(process.env.POINTS_RATE || 100);
    const rpc = process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const mintStr = process.env.UPLIFT_MINT;
    const decimals = Number(process.env.UPLIFT_DECIMALS || 9);
    const owner = new PublicKey(req.params.wallet);
    const mint = new PublicKey(mintStr);
    const conn = new Connection(rpc, 'confirmed');
    const accts = await conn.getTokenAccountsByOwner(owner, { mint });
    let raw = 0n;
    for (const { pubkey } of accts.value) {
      const bal = await conn.getTokenAccountBalance(pubkey);
      raw += BigInt(bal.value.amount);
    }
    const uplift = Number(raw) / Math.pow(10, decimals);
    const points = Math.floor(uplift * rate);
    res.json({ wallet: String(owner), uplift, points, rate });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

// Helius Smart Webhook endpoint for burn ingestion
app.post('/api/webhooks/helius', async (req, res) => {
  try {
    const secret = process.env.HELIUS_WEBHOOK_SECRET;
    if (secret) {
      const hdr = req.headers['x-helius-secret'] || req.headers['x-webhook-secret'] || req.headers['authorization'];
      const token = Array.isArray(hdr) ? hdr[0] : (hdr || '').toString().replace('Bearer ','');
      if (token !== secret) return res.status(401).json({ error: 'unauthorized' });
    }
    const mint = process.env.UPLIFT_MINT;
    const decimals = Number(process.env.UPLIFT_DECIMALS || 9);
    const body = req.body;
    let totalRaw = 0;
    const scan = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      if (obj.type && String(obj.type).toLowerCase().includes('burn')) {
        const info = obj.info || obj.parsed?.info || {};
        if (info.mint === mint) {
          const amt = Number(info.amount ?? info.tokenAmount ?? 0);
          if (!Number.isNaN(amt)) totalRaw += amt;
        }
      }
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (Array.isArray(v)) v.forEach(scan);
        else if (v && typeof v === 'object') scan(v);
      }
    };
    if (Array.isArray(body)) body.forEach(scan); else scan(body);
    if (totalRaw > 0) {
      const human = totalRaw / Math.pow(10, decimals);
      await incrBurnTotal(human);
    }
    res.json({ ok: true, added: totalRaw });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

// ===== Phantom Auth (nonce / verify / link) =====
const NONCE_TTL_MS = 5 * 60 * 1000;
global.__phantom_nonces = global.__phantom_nonces || new Map();

app.get('/api/auth/phantom/nonce', (req, res) => {
  const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const message = `Operator Uplift login\nNonce: ${nonce}\nTime: ${new Date().toISOString()}`;
  global.__phantom_nonces.set(nonce, Date.now());
  res.json({ nonce, message });
});

app.post('/api/auth/phantom/verify', async (req, res) => {
  try {
    const { address, signature, nonce } = req.body || {};
    if (!address || !signature || !nonce) return res.status(400).json({ error: 'missing_params' });
    const issued = global.__phantom_nonces.get(nonce);
    if (!issued || Date.now() - issued > NONCE_TTL_MS) return res.status(400).json({ error: 'nonce_expired' });
    global.__phantom_nonces.delete(nonce);
    const message = new TextEncoder().encode(`Operator Uplift login\nNonce: ${nonce}\nTime: `);
    const sigBytes = bs58.decode(signature);
    const pubkey = new PublicKey(address);
    const verified = nacl.sign.detached.verify(message, sigBytes, pubkey.toBytes());
    if (!verified) return res.status(401).json({ error: 'invalid_signature' });
    // Wallet link lookup
    const linkDoc = await adminDb.collection('walletLinks').doc(address).get();
    let uid = null;
    if (linkDoc.exists && linkDoc.data()?.uid) uid = linkDoc.data().uid;
    if (!uid) uid = `solana_${address}`;
    const customToken = await adminAuth.createCustomToken(uid, { provider: 'phantom', address });
    res.json({ token: customToken, linked: !!linkDoc.exists });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

app.post('/api/auth/phantom/link', async (req, res) => {
  try {
    const authz = req.headers.authorization || '';
    const idToken = authz.replace('Bearer ','');
    if (!idToken) return res.status(401).json({ error: 'missing_token' });
    const decoded = await adminAuth.verifyIdToken(idToken);
    const currentUid = decoded.uid;
    const { address, signature, nonce } = req.body || {};
    if (!address || !signature || !nonce) return res.status(400).json({ error: 'missing_params' });
    const issued = global.__phantom_nonces.get(nonce);
    if (!issued || Date.now() - issued > NONCE_TTL_MS) return res.status(400).json({ error: 'nonce_expired' });
    global.__phantom_nonces.delete(nonce);
    const message = new TextEncoder().encode(`Operator Uplift login\nNonce: ${nonce}\nTime: `);
    const sigBytes = bs58.decode(signature);
    const pubkey = new PublicKey(address);
    const verified = nacl.sign.detached.verify(message, sigBytes, pubkey.toBytes());
    if (!verified) return res.status(401).json({ error: 'invalid_signature' });
    const ref = adminDb.collection('walletLinks').doc(address);
    const snap = await ref.get();
    if (snap.exists && snap.data()?.uid !== currentUid) {
      return res.status(409).json({ error: 'address_already_linked' });
    }
    await ref.set({ uid: currentUid, linkedAt: admin.firestore.FieldValue.serverTimestamp() });
    // also note on user doc
    await adminDb.collection('users').doc(currentUid).set({ walletAddress: address }, { merge: true });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

module.exports.handler = serverless(app);


