// Scheduled/one-off backfill to seed cumulative burn total
const { setBurnTotal } = require('../../../src/utils/store');

exports.handler = async () => {
  try {
    // Placeholder: in a real backfill, pull pages of recent burn signatures and parse
    // For now, do not overwrite if already set; this can be extended later
    // Leaving no-op to avoid accidental reset
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || 'server_error' }) };
  }
};


