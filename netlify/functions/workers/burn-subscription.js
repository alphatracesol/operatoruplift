// Netlify background worker to subscribe to Helius WS logs and increment burn counter
const WebSocket = require('ws');
const { incrBurnTotal } = require('../../../src/utils/store');

const WS_URL = process.env.HELIUS_WEBSOCKET_URL;
const MINT = process.env.UPLIFT_MINT;
const DECIMALS = Number(process.env.UPLIFT_DECIMALS || 9);

function toHuman(amountRaw) { return (Number(amountRaw) || 0) / Math.pow(10, DECIMALS); }

function subscribe(ws) {
  const sub = {
    jsonrpc: '2.0', id: 1, method: 'logsSubscribe',
    params: [ { mentions: ['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'] }, { commitment: 'confirmed', filter: 'all' } ]
  };
  ws.send(JSON.stringify(sub));
}

function parseAndCount(wsMsg) {
  try {
    const logs = wsMsg?.params?.result?.value?.logs || [];
    const joined = logs.join('\n');
    const hasBurn = /burn/i.test(joined);
    const hasMint = MINT && joined.includes(MINT);
    if (!(hasBurn && hasMint)) return;
    const sig = wsMsg?.params?.result?.value?.signature;
    if (!sig) return;
    const url = process.env.HELIUS_PARSE_TRANSACTIONS;
    if (!url) return;
    fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ transactions: [sig] }) })
      .then(r => r.json())
      .then(arr => {
        const tx = Array.isArray(arr) && arr[0] ? arr[0] : null;
        if (!tx) return;
        const instr = tx.instructions || [];
        let totalRaw = 0;
        for (const ix of instr) {
          const type = String(ix?.type || ix?.parsed?.type || '').toLowerCase();
          const info = ix?.info || ix?.parsed?.info || {};
          if (!type.includes('burn')) continue;
          if (info?.mint !== MINT) continue;
          const amt = Number(info?.amount ?? 0);
          if (!Number.isNaN(amt)) totalRaw += amt;
        }
        if (totalRaw > 0) incrBurnTotal(toHuman(totalRaw)).catch(()=>{});
      })
      .catch(()=>{});
  } catch {}
}

exports.handler = async () => {
  if (!WS_URL) return { statusCode: 200, body: 'WS disabled' };
  return new Promise((resolve) => {
    const ws = new WebSocket(WS_URL);
    ws.on('open', () => subscribe(ws));
    ws.on('message', (data) => {
      try { const msg = JSON.parse(String(data)); if (msg?.method === 'logsNotification') parseAndCount(msg); } catch {}
    });
    ws.on('error', () => {});
    ws.on('close', () => setTimeout(()=>{ exports.handler().catch(()=>{}); }, 2000));
  });
};


