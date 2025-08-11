// Minimal Redis-backed counter store with in-memory fallback
let redisClient = null;

async function initRedis() {
  if (redisClient || !process.env.REDIS_URL) return null;
  try {
    // Lazy require to avoid bundling if not used
    const { createClient } = require('redis');
    const client = createClient({ url: process.env.REDIS_URL });
    client.on('error', (e) => console.error('Redis error', e));
    await client.connect();
    redisClient = client;
    return client;
  } catch (e) {
    console.warn('Redis unavailable, using in-memory store:', e.message);
    redisClient = null;
    return null;
  }
}

const MEM = new Map();
const keyBurnTotal = 'uplift:burn_total';

async function getCounter(key) {
  await initRedis();
  if (redisClient) {
    const v = await redisClient.get(key);
    return v ? Number(v) : 0;
  }
  return Number(MEM.get(key) || 0);
}

async function incrCounterBy(key, delta) {
  await initRedis();
  if (redisClient) {
    // Use float for SPL amounts
    return await redisClient.incrByFloat(key, Number(delta) || 0);
  }
  const current = Number(MEM.get(key) || 0);
  const next = current + (Number(delta) || 0);
  MEM.set(key, String(next));
  return next;
}

async function setCounter(key, value) {
  await initRedis();
  if (redisClient) {
    await redisClient.set(key, String(value));
    return;
  }
  MEM.set(key, String(value));
}

async function getBurnTotalStore() { return await getCounter(keyBurnTotal); }
async function incrBurnTotal(delta) { return await incrCounterBy(keyBurnTotal, delta); }
async function setBurnTotal(value) { return await setCounter(keyBurnTotal, value); }

module.exports = {
  getCounter,
  incrCounterBy,
  setCounter,
  getBurnTotalStore,
  incrBurnTotal,
  setBurnTotal,
  keyBurnTotal,
};


