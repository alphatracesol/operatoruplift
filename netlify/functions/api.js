// Express app exposed as a Netlify function
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getBurnTotalStore } = require('../../src/utils/store');
const { Connection, PublicKey } = require('@solana/web3.js');

const app = express();
app.use(bodyParser.json());
const corsOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : true;
app.use(cors({ origin: corsOrigins }));

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

module.exports.handler = serverless(app);


