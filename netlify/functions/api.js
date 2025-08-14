// Express app exposed as a Netlify function
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getCounter, incrCounterBy } = require('../../src/utils/store');
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

// Router mounted at Netlify function base path to avoid double /api prefix
const router = express.Router();

// ---- Price cache (USD-pegged redemption) ----
let __upliftPriceCache = { value: null, ts: 0 };
const PRICE_TTL_MS = Number(process.env.PRICE_TTL_MS || 30000);
async function getUpliftUsdPrice() {
  const now = Date.now();
  if (__upliftPriceCache.value && now - __upliftPriceCache.ts < PRICE_TTL_MS) return __upliftPriceCache.value;
  try {
    const mintStr = process.env.UPLIFT_MINT;
    const endpoint = process.env.PRICE_ENDPOINT || 'https://price.jup.ag/v6/price';
    const url = `${endpoint}?ids=${encodeURIComponent(mintStr)}`;
    const r = await fetch(url, { headers: { 'accept': 'application/json' } });
    if (r.ok) {
      const j = await r.json();
      const data = j?.data || {};
      // Try by mint key, else try first entry
      let price = data[mintStr]?.price;
      if (typeof price !== 'number') {
        const first = Object.values(data)[0];
        price = first?.price;
      }
      if (typeof price === 'number' && price > 0) {
        __upliftPriceCache = { value: price, ts: now };
        return price;
      }
    }
  } catch {}
  // Fallback
  const fb = Number(process.env.FALLBACK_UPLIFT_USD || 0.00001818);
  __upliftPriceCache = { value: fb, ts: Date.now() };
  return fb;
}

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

// Mount router at Netlify function base path
app.use('/.netlify/functions/api', rateLimiter, router);

router.get('/health', (req, res) => {
  res.json({ ok: true, cluster: process.env.SOLANA_CLUSTER || 'mainnet' });
});

// Public environment readiness check (safe, no secret values)
router.get('/env/check', (req, res) => {
  try {
    const envKeys = [
      'HELIUS_RPC_URL',
      'HELIUS_API_KEY',
      'UPLIFT_MINT',
      'UPLIFT_DECIMALS',
      'POINTS_RATE',
      'CORS_ALLOWED_ORIGINS'
    ];
    const env = Object.fromEntries(envKeys.map(k => [k, Boolean(process.env[k])]))
    const warnings = [];
    if (!env.HELIUS_RPC_URL && !env.HELIUS_API_KEY) warnings.push('No Helius RPC configured; default Solana RPC will be used (may be rate-limited).');
    if (!env.UPLIFT_MINT) warnings.push('UPLIFT_MINT not set; points and burn lookups may fail.');
    res.json({ ok: true, env, warnings });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message || 'server_error' });
  }
});

// Public config (no secrets)
router.get('/config/public', (req, res) => {
  try {
    const cfg = {
      mint: process.env.UPLIFT_MINT || null,
      decimals: Number(process.env.UPLIFT_DECIMALS || 9),
      pointsRate: Number(process.env.POINTS_RATE || 100),
      pointsPerUsd: Number(process.env.POINTS_PER_USD || 10),
      redemption: {
        mode: (process.env.REDEMPTION_MODE || 'fixed').toLowerCase(),
        pointUsd: Number(process.env.POINT_USD || 0.00001),
        upliftPerPoint: Number(process.env.REDEEM_UPLIFT_PER_POINT || 0.5),
        dailyCap: Number(process.env.DAILY_REDEEM_POINTS_CAP || 10000),
        weeklyCap: Number(process.env.WEEKLY_REDEEM_POINTS_CAP || 30000),
        cooldownHours: Number(process.env.REDEEM_COOLDOWN_HOURS || 24)
      },
      sinks: {
        buyAndBurnPct: Number(process.env.SINK_BUY_BURN_PCT || 30),
        treasuryLockPct: Number(process.env.SINK_TREASURY_PCT || 20),
        perkDeliveryPct: Number(process.env.SINK_PERK_PCT || 50)
      },
      staking: {
        requireLockForRedeem: String(process.env.REDEEM_REQUIRE_LOCK || '0') === '1',
        tiers: {
          bronze: Number(process.env.REDEEM_MIN_LOCK_BRONZE || 1000),
          silver: Number(process.env.REDEEM_MIN_LOCK_SILVER || 5000),
          gold: Number(process.env.REDEEM_MIN_LOCK_GOLD || 25000)
        }
      },
      decay: { weeklyPct: Number(process.env.POINTS_DECAY_WEEKLY_PCT || 0) },
      earnCaps: { weeklyUsd: Number(process.env.USD_WEEKLY_EARN_CAP || 2000) }
    };
    res.json(cfg);
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

router.get('/burn/total', async (req, res) => {
  try {
    const total = await getCounter('burn_total');
    res.json({ total });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

// Simple SSE stream emitting snapshots periodically
router.get('/burn/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders && res.flushHeaders();

  let active = true;
  async function push() {
    if (!active) return;
    try {
      const total = await getCounter('burn_total');
      res.write(`event: snapshot\n`);
      res.write(`data: ${JSON.stringify({ total })}\n\n`);
    } catch {}
  }
  const timer = setInterval(push, 15000);
  push();
  req.on('close', () => { active = false; clearInterval(timer); res.end(); });
});

// Points endpoint (reads SPL token balance and returns points)
router.get('/user/:wallet/points', async (req, res) => {
  try {
    // Check if required environment variables are set
    if (!process.env.UPLIFT_MINT) {
      return res.status(503).json({ 
        error: 'Service temporarily unavailable', 
        message: 'Token configuration not set',
        points: 0,
        wallet: req.params.wallet 
      });
    }
    
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
    const points_from_balance = Math.floor(uplift * rate);
    // Try to find linked user to include off-chain points
    let offchain_points = 0;
    try {
      const link = await adminDb.collection('walletLinks').doc(String(owner)).get();
      if (link.exists && link.data()?.uid) {
        const userDoc = await adminDb.collection('users').doc(link.data().uid).get();
        if (userDoc.exists) {
          offchain_points = Number(userDoc.data()?.stats?.points || 0);
        }
      }
    } catch {}
    const points = points_from_balance + offchain_points; // total display points
    res.json({ wallet: String(owner), uplift, points_from_balance, offchain_points, points, rate, decimals });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

// Helius Smart Webhook endpoint for burn ingestion
router.post('/webhooks/helius', async (req, res) => {
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
      await incrCounterBy('burn_total', human);
    }
    res.json({ ok: true, added: totalRaw });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

// ===== Phantom Auth (nonce / verify / link) =====
const NONCE_TTL_MS = 5 * 60 * 1000;
global.__phantom_nonces = global.__phantom_nonces || new Map();

// Helpers
function parseTierMultipliers(str) {
  const out = { base: 1.0 };
  (str || '').split(';').map(s=>s.trim()).filter(Boolean).forEach(pair=>{
    const [k,v] = pair.split(':');
    const num = Number(v);
    if (k && !Number.isNaN(num)) out[k] = num;
  });
  return out;
}
function getTierForUser(userDoc) {
  const verified = !!userDoc?.data()?.verified; // simple flag; expand as needed
  const vip = !!userDoc?.data()?.vip;
  if (vip) return 'vip';
  if (verified) return 'verified';
  return 'base';
}

function computeStakeTier(lockedAmount) {
  const bronze = Number(process.env.REDEEM_MIN_LOCK_BRONZE || 1000);
  const silver = Number(process.env.REDEEM_MIN_LOCK_SILVER || 5000);
  const gold = Number(process.env.REDEEM_MIN_LOCK_GOLD || 25000);
  const amt = Number(lockedAmount || 0);
  if (amt >= gold) return 'gold';
  if (amt >= silver) return 'silver';
  if (amt >= bronze) return 'bronze';
  return 'none';
}

async function getStakeInfoForUser(uid) {
  try {
    const ref = adminDb.collection('users').doc(uid).collection('locks').doc('uplift');
    const snap = await ref.get();
    const locked = Number(snap.exists ? (snap.data()?.locked || 0) : 0);
    const tier = computeStakeTier(locked);
    return { locked, tier };
  } catch {
    return { locked: 0, tier: 'none' };
  }
}

// Points: rate and redeem
router.get('/points/rate', (req, res) => {
  const mode = (process.env.REDEMPTION_MODE || 'fixed').toLowerCase();
  if (mode === 'usd_pegged') {
    return res.json({ type: 'usd_pegged', pointUsd: Number(process.env.POINT_USD || 0.00001) });
  }
  return res.json({ type: 'fixed', rate: Number(process.env.REDEEM_UPLIFT_PER_POINT || 0.5) });
});

router.post('/points/redeem', async (req, res) => {
  try {
    // Auth
    const authz = req.headers.authorization || '';
    const idToken = authz.replace('Bearer ', '');
    if (!idToken) return res.status(401).json({ error: 'missing_token' });
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const { wallet, points } = req.body || {};
    if (!wallet || !points || points <= 0) return res.status(400).json({ error: 'invalid_request' });

    // Caps and env
    const dailyCap = Number(process.env.DAILY_REDEEM_POINTS_CAP || 10000);
    const weeklyCap = Number(process.env.WEEKLY_REDEEM_POINTS_CAP || 30000);
    const newUserCap = Number(process.env.NEW_USER_REDEEM_POINTS_CAP || 2000);
    const cooldownH = Number(process.env.REDEEM_COOLDOWN_HOURS || 24);
    const vestDays = Number(process.env.REDEMPTION_VESTING_DAYS || 7);
    const monthlyCap = Number(process.env.MONTHLY_ISSUANCE_UPLIFT_CAP || 50000000);
    const mode = (process.env.REDEMPTION_MODE || 'fixed').toLowerCase();
    const tierMultipliers = parseTierMultipliers(process.env.TIER_MULTIPLIERS || 'base:1.0;verified:1.1;vip:1.2');
    const stakeTierMultipliers = parseTierMultipliers(process.env.STAKE_TIER_MULTIPLIERS || 'none:1.0;bronze:1.2;silver:1.5;gold:2.0');

    // Load user and points
    const userRef = adminDb.collection('users').doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(404).json({ error: 'user_not_found' });
    const stats = userSnap.data()?.stats || {};
    const offchainPoints = Number(stats.points || 0);
    if (offchainPoints < points) return res.status(400).json({ error: 'insufficient_points' });

    // Optional: require minimum stake/lock for redeem
    const requireLock = String(process.env.REDEEM_REQUIRE_LOCK || '0') === '1';
    let stakeInfo = { locked: 0, tier: 'none' };
    if (requireLock) {
      stakeInfo = await getStakeInfoForUser(uid);
      if (stakeInfo.tier === 'none') return res.status(403).json({ error: 'stake_required' });
    } else {
      // Even if not required, compute for multiplier if configured
      stakeInfo = await getStakeInfoForUser(uid);
    }

    // Simple daily/weekly counters (by date keys)
    const now = new Date();
    const ymd = now.toISOString().slice(0,10).replace(/-/g,'');
    const weekKey = `${uid}_${ymd.slice(0,4)}W${Math.ceil((now.getDate())/7)}`;
    const countersRef = adminDb.collection('redeemCounters');
    const dailyRef = countersRef.doc(`${uid}_${ymd}`);
    const weeklyRef = countersRef.doc(weekKey);
    const daily = (await dailyRef.get()).data() || { total: 0, lastAt: 0 };
    const weekly = (await weeklyRef.get()).data() || { total: 0 };

    // Cooldown
    if (daily.lastAt && (Date.now() - daily.lastAt) < cooldownH*3600*1000) {
      // allow, but you may prefer to block if too soon; leaving permissive here
    }

    // New user cap
    const accountAgeDays = Math.max(0, Math.floor((Date.now() - (userSnap.createTime?.toDate?.() || new Date()).getTime())/86400000));
    const effectiveDailyCap = accountAgeDays < 7 ? Math.min(dailyCap, newUserCap) : dailyCap;
    if ((daily.total + points) > effectiveDailyCap) return res.status(400).json({ error: 'daily_cap_exceeded' });
    if ((weekly.total + points) > weeklyCap) return res.status(400).json({ error: 'weekly_cap_exceeded' });

    // Compute uplift granted
    const tier = getTierForUser(userSnap);
    const tierMult = tierMultipliers[tier] || 1.0;
    const stakeMult = stakeTierMultipliers[stakeInfo.tier] || 1.0;
    let upliftGranted = 0;
    if (mode === 'usd_pegged') {
      const pointUsd = Number(process.env.POINT_USD || 0.00001);
      const price = await getUpliftUsdPrice();
      upliftGranted = Math.floor((points * pointUsd * tierMult * stakeMult) / Math.max(price, 1e-9));
    } else {
      const rate = Number(process.env.REDEEM_UPLIFT_PER_POINT || 0.5) * tierMult;
      upliftGranted = Math.floor(points * rate * stakeMult);
    }
    if (upliftGranted <= 0) return res.status(400).json({ error: 'zero_grant' });

    // Monthly issuance budget check
    const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}`;
    const monthlyRef = countersRef.doc(`issued_${monthKey}`);
    const monthly = (await monthlyRef.get()).data() || { total: 0 };
    if ((monthly.total + upliftGranted) > monthlyCap) return res.status(400).json({ error: 'monthly_cap_exceeded' });

    // Deduct points and record redemption (vesting)
    const vestEnd = new Date(Date.now() + vestDays*86400000);
    const sinkBuy = Number(process.env.SINK_BUY_BURN_PCT || 30);
    const sinkTreasury = Number(process.env.SINK_TREASURY_PCT || 20);
    const sinkPerk = Number(process.env.SINK_PERK_PCT || 50);
    const pointUsd = Number(process.env.POINT_USD || 0.00001);
    const impliedUsd = Number(points) * pointUsd * tierMult * stakeMult;

    const redemption = {
      uid, wallet: String(wallet), points, upliftGranted, tier, mode,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      vestingEnd: admin.firestore.Timestamp.fromDate(vestEnd),
      status: 'pending', // for on-chain fulfillment worker
      stake: stakeInfo,
      sinks: {
        buyAndBurnPct: sinkBuy,
        treasuryLockPct: sinkTreasury,
        perkDeliveryPct: sinkPerk,
        impliedUsd
      }
    };

    await adminDb.runTransaction(async (tx) => {
      const userDoc = await tx.get(userRef);
      const curPts = Number(userDoc.data()?.stats?.points || 0);
      if (curPts < points) throw new Error('insufficient_points');
      tx.set(userRef, { stats: { points: admin.firestore.FieldValue.increment(-points) } }, { merge: true });
      const rid = `${uid}_${Date.now()}`;
      tx.set(adminDb.collection('redemptions').doc(rid), redemption);
      tx.set(dailyRef, { total: (daily.total||0) + points, lastAt: Date.now() }, { merge: true });
      tx.set(weeklyRef, { total: (weekly.total||0) + points }, { merge: true });
      tx.set(monthlyRef, { total: (monthly.total||0) + upliftGranted }, { merge: true });
    });

    return res.json({ ok: true, pointsRedeemed: points, upliftGranted, status: 'pending', vestingDays: vestDays });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'server_error' });
  }
});

// Earn points from verified USD spend (client-enabled only for MVP)
router.post('/points/earn/purchase', async (req, res) => {
  try {
    if (String(process.env.ALLOW_CLIENT_EARN || '0') !== '1') {
      return res.status(403).json({ error: 'disabled' });
    }
    const authz = req.headers.authorization || '';
    const idToken = authz.replace('Bearer ', '');
    if (!idToken) return res.status(401).json({ error: 'missing_token' });
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const { usd = 0 } = req.body || {};
    const amount = Number(usd);
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ error: 'invalid_amount' });

    // Weekly USD earn cap per user
    const weeklyUsdCap = Number(process.env.USD_WEEKLY_EARN_CAP || 2000);
    const now = new Date();
    const weekKey = `${uid}_${now.getUTCFullYear()}W${Math.ceil((now.getUTCDate())/7)}`;
    const capsRef = adminDb.collection('redeemCounters').doc(`earn_${weekKey}`);
    const capSnap = await capsRef.get();
    const usedUsd = Number(capSnap.exists ? (capSnap.data()?.usd || 0) : 0);
    if ((usedUsd + amount) > weeklyUsdCap) return res.status(400).json({ error: 'weekly_earn_cap_exceeded' });

    // Compute earn with stake multiplier
    const pointsPerUsd = Number(process.env.POINTS_PER_USD || 10);
    const stakeInfo = await getStakeInfoForUser(uid);
    const stakeTierMultipliers = parseTierMultipliers(process.env.STAKE_TIER_MULTIPLIERS || 'none:1.0;bronze:1.2;silver:1.5;gold:2.0');
    const stakeMult = stakeTierMultipliers[stakeInfo.tier] || 1.0;
    const earned = Math.floor(amount * pointsPerUsd * stakeMult);
    if (earned <= 0) return res.status(400).json({ error: 'zero_earn' });

    const userRef = adminDb.collection('users').doc(uid);
    await adminDb.runTransaction(async (tx) => {
      tx.set(userRef, { stats: { points: admin.firestore.FieldValue.increment(earned) } }, { merge: true });
      tx.set(capsRef, { usd: (usedUsd + amount), lastAt: Date.now() }, { merge: true });
    });
    res.json({ ok: true, earned, stakeTier: stakeInfo.tier });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});
router.get('/auth/phantom/nonce', (req, res) => {
  const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const message = `Operator Uplift login\nNonce: ${nonce}`;
  global.__phantom_nonces.set(nonce, Date.now());
  res.json({ nonce, message });
});

router.post('/auth/phantom/verify', async (req, res) => {
  try {
    const { address, signature, nonce } = req.body || {};
    if (!address || !signature || !nonce) return res.status(400).json({ error: 'missing_params' });
    const issued = global.__phantom_nonces.get(nonce);
    if (!issued || Date.now() - issued > NONCE_TTL_MS) return res.status(400).json({ error: 'nonce_expired' });
    global.__phantom_nonces.delete(nonce);
    const message = new TextEncoder().encode(`Operator Uplift login\nNonce: ${nonce}`);
    const sigBytes = Array.isArray(signature) ? new Uint8Array(signature) : bs58.decode(signature);
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

router.post('/auth/phantom/link', async (req, res) => {
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
    const message = new TextEncoder().encode(`Operator Uplift login\nNonce: ${nonce}`);
    const sigBytes = Array.isArray(signature) ? new Uint8Array(signature) : bs58.decode(signature);
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

// Unlink wallet from current user (server-side)
router.post('/auth/phantom/unlink', async (req, res) => {
  try {
    const authz = req.headers.authorization || '';
    const idToken = authz.replace('Bearer ','');
    if (!idToken) return res.status(401).json({ error: 'missing_token' });
    const decoded = await adminAuth.verifyIdToken(idToken);
    const currentUid = decoded.uid;
    const { address } = req.body || {};
    if (!address) return res.status(400).json({ error: 'missing_params' });
    const ref = adminDb.collection('walletLinks').doc(address);
    const snap = await ref.get();
    if (!snap.exists || snap.data()?.uid !== currentUid) {
      return res.status(404).json({ error: 'not_linked' });
    }
    await ref.delete();
    await adminDb.collection('users').doc(currentUid).set({ walletAddress: admin.firestore.FieldValue.delete() }, { merge: true });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

// Simple jobs status inspector (admin-lite)
router.get('/jobs/status', async (req, res) => {
  try {
    // Check if Firebase admin is configured
    if (!adminDb) {
      return res.status(503).json({ 
        ok: false, 
        error: 'Service temporarily unavailable',
        message: 'Database configuration not set',
        jobs: {} 
      });
    }
    
    const keys = ['weekly-reset', 'redeem-fulfill'];
    const docs = await Promise.all(keys.map(k => adminDb.collection('jobs').doc(k).get()));
    const out = {};
    docs.forEach((d,i)=>{ out[keys[i]] = d.exists ? d.data() : null; });
    res.json({ ok: true, jobs: out });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

// ===== Token supply (RPC via server to avoid CORS) =====
router.get('/token/supply', async (req, res) => {
  try {
    const mintStr = String(req.query.mint || process.env.UPLIFT_MINT || '').trim();
    if (!mintStr) return res.status(400).json({ error: 'mint_required' });
    const conn = new Connection(process.env.HELIUS_RPC_URL || (process.env.HELIUS_API_KEY ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}` : 'https://api.mainnet-beta.solana.com'), 'confirmed');
    const info = await conn.getTokenSupply(new PublicKey(mintStr));
    const decimals = Number(info?.value?.decimals || 9);
    const amount = info?.value?.amount || '0';
    const uiAmount = Number(amount) / Math.pow(10, decimals);
    res.json({ mint: mintStr, decimals, amount, uiAmount });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

// ===== Burns history (parsed RPC similar to burn-feed but generalized) =====
router.get('/burns/history', async (req, res) => {
  try {
    const mintStr = String(req.query.mint || process.env.UPLIFT_MINT || '').trim();
    const limit = Math.min(Number(req.query.limit || 50), 100);
    if (!mintStr) return res.status(400).json({ error: 'mint_required' });
    const rpcUrl = process.env.HELIUS_RPC_URL || (process.env.HELIUS_API_KEY ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}` : 'https://api.mainnet-beta.solana.com');
    async function rpc(method, params) {
      const r = await fetch(rpcUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) });
      if (!r.ok) throw new Error('rpc_http_'+r.status);
      const j = await r.json(); if (j.error) throw new Error('rpc_err_'+(j.error.message||'unknown')); return j.result;
    }
    const supplyInfo = await rpc('getTokenSupply', [mintStr, { commitment: 'confirmed' }]);
    const decimals = Number(supplyInfo?.value?.decimals ?? 9);
    const sigs = await rpc('getSignaturesForAddress', [mintStr, { limit }]);
    const signatures = (sigs || []).map(s => s.signature);
    const txs = signatures.length ? await rpc('getParsedTransactions', [signatures, { maxSupportedTransactionVersion: 0 }]) : [];
    const burns = [];
    for (const tx of (txs||[])) {
      const allInstr = [ ...(tx?.transaction?.message?.instructions || []), ...((tx?.meta?.innerInstructions || []).flatMap(i=>i.instructions)||[]) ];
      for (const ix of allInstr) {
        const parsed = ix?.parsed || null; if (!parsed) continue; const type = parsed?.type;
        if (type !== 'burn' && type !== 'burnChecked') continue;
        const info = parsed?.info || {}; if (info?.mint !== mintStr) continue;
        const raw = info?.amount || info?.tokenAmount || '0';
        const uiAmount = Number(raw) / Math.pow(10, decimals);
        burns.push({ signature: tx?.transaction?.signatures?.[0], blockTime: tx?.blockTime ? tx.blockTime*1000 : null, amount: uiAmount });
      }
    }
    burns.sort((a,b)=>(b.blockTime||0)-(a.blockTime||0));
    res.json({ mint: mintStr, decimals, count: burns.length, burns });
  } catch (e) {
    res.status(500).json({ error: e.message || 'server_error' });
  }
});

// ===== Fee ingress logging & summary =====
router.post('/fees/ingress', async (req, res) => {
  try {
    if (!adminDb) return res.status(503).json({ error: 'db_unavailable' });
    const { source, amountUsd, tx, ts } = req.body || {};
    if (!source || typeof amountUsd !== 'number') return res.status(400).json({ error: 'invalid_params' });
    const doc = { source: String(source), amountUsd: Number(amountUsd), tx: tx||null, ts: ts || Date.now(), createdAt: admin.firestore.FieldValue.serverTimestamp() };
    await adminDb.collection('feeIngress').add(doc);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message || 'server_error' }); }
});

router.get('/fees/summary', async (req, res) => {
  try {
    if (!adminDb) return res.status(503).json({ error: 'db_unavailable' });
    const period = String(req.query.period || 'weekly');
    const sinceMs = period === 'weekly' ? (Date.now() - 7*24*3600*1000) : (Date.now() - 24*3600*1000);
    const snap = await adminDb.collection('feeIngress').where('ts', '>=', sinceMs).orderBy('ts','desc').get();
    const rows = []; let total = 0; const bySource = {};
    snap.forEach(d=>{ const v=d.data(); rows.push(v); total+=Number(v.amountUsd||0); const s=v.source||'unknown'; bySource[s]=(bySource[s]||0)+Number(v.amountUsd||0); });
    const route = { buyback: total*0.25, burn: total*0.25, treasury: total*0.50 };
    res.json({ period, totalUsd: total, bySource, route, rows });
  } catch (e) { res.status(500).json({ error: e.message || 'server_error' }); }
});

// ===== Buybacks log (GET JSON/CSV, POST insert) =====
router.post('/buybacks/log', async (req, res) => {
  try {
    if (!adminDb) return res.status(503).json({ error: 'db_unavailable' });
    const { tx, amountUsd, amountToken, twapWindow, ts } = req.body || {};
    if (!tx || typeof amountUsd !== 'number') return res.status(400).json({ error: 'invalid_params' });
    const doc = { tx, amountUsd: Number(amountUsd), amountToken: Number(amountToken||0), twapWindow: twapWindow||null, ts: ts||Date.now(), createdAt: admin.firestore.FieldValue.serverTimestamp() };
    await adminDb.collection('buybacks').add(doc);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message || 'server_error' }); }
});

router.get('/buybacks/log', async (req, res) => {
  try {
    if (!adminDb) return res.status(503).json({ error: 'db_unavailable' });
    const limit = Math.min(Number(req.query.limit || 100), 1000);
    const format = String(req.query.format || 'json');
    const snap = await adminDb.collection('buybacks').orderBy('ts','desc').limit(limit).get();
    const rows = []; snap.forEach(d=>rows.push(d.data()));
    if (format === 'csv') {
      const header = 'ts,tx,amountUsd,amountToken,twapWindow';
      const csv = [header].concat(rows.map(r=>[r.ts, r.tx, r.amountUsd, r.amountToken||'', (r.twapWindow||'')].join(','))).join('\n');
      res.set('Content-Type','text/csv');
      res.send(csv);
      return;
    }
    res.json({ rows });
  } catch (e) { res.status(500).json({ error: e.message || 'server_error' }); }
});

module.exports.handler = serverless(app);


