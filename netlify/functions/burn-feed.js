// Netlify Function: burn-feed
// Returns recent SPL burn events for a given mint as a simple JSON feed
// Env:
// - HELIUS_RPC_URL (preferred) OR HELIUS_API_KEY (fallback) OR default Solana RPC

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const urlParams = new URLSearchParams(event.queryStringParameters || {});
    const mint = urlParams.get('mint');
    const limit = Math.min(Number(urlParams.get('limit') || 20), 50);
    if (!mint) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'mint required' }) };
    }

    const rpcUrl = process.env.HELIUS_RPC_URL
      || (process.env.HELIUS_API_KEY ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}` : 'https://api.mainnet-beta.solana.com');

    async function rpc(method, params) {
      const resp = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
      });
      if (!resp.ok) throw new Error(`RPC ${method} HTTP ${resp.status}`);
      const data = await resp.json();
      if (data.error) throw new Error(`RPC ${method} error: ${data.error.message || 'unknown'}`);
      return data.result;
    }

    // Get mint decimals to format amounts
    const supplyInfo = await rpc('getTokenSupply', [mint, { commitment: 'confirmed' }]);
    const decimals = Number(supplyInfo?.value?.decimals ?? 9);

    // Pull recent signatures that mention the mint (mint appears in accountKeys in burn tx)
    const sigs = await rpc('getSignaturesForAddress', [mint, { limit }]);
    const signatures = (sigs || []).map(s => s.signature);

    // Batch fetch parsed transactions
    const txs = signatures.length
      ? await rpc('getParsedTransactions', [signatures, { maxSupportedTransactionVersion: 0 }])
      : [];

    const results = [];
    for (const tx of (txs || [])) {
      if (!tx) continue;
      const signature = tx?.transaction?.signatures?.[0];
      const blockTime = tx?.blockTime ? tx.blockTime * 1000 : null;
      // Prefer parsed instructions of the SPL Token program
      const allInstr = [
        ...(tx?.transaction?.message?.instructions || []),
        ...((tx?.meta?.innerInstructions || []).flatMap(inner => inner.instructions) || [])
      ];

      for (const ix of allInstr) {
        const prog = ix?.program || ix?.programId || '';
        const parsed = ix?.parsed || null;
        if (!parsed) continue;
        const type = parsed?.type;
        if (type !== 'burn' && type !== 'burnChecked') continue;
        const info = parsed?.info || {};
        const ixMint = info?.mint;
        if (ixMint !== mint) continue;
        const rawAmount = info?.amount || info?.tokenAmount; // raw string in base units
        const owner = info?.owner || info?.authority || tx?.transaction?.message?.accountKeys?.[0]?.pubkey;
        const uiAmount = (() => {
          const n = Number(rawAmount || 0);
          if (!isFinite(n)) return 0;
          return n / Math.pow(10, decimals);
        })();
        results.push({
          signature,
          wallet: owner || '',
          amount: uiAmount,
          blockTime,
        });
      }
    }

    // Sort latest first and limit
    results.sort((a, b) => (b.blockTime || 0) - (a.blockTime || 0));
    const trimmed = results.slice(0, limit);

    return { statusCode: 200, headers, body: JSON.stringify({ mint, decimals, count: trimmed.length, burns: trimmed }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message || 'server_error' }) };
  }
};


