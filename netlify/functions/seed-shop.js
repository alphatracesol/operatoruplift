const admin = require('firebase-admin');

let initialized = false;
function initAdmin() {
  if (!initialized) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      initialized = true;
    } catch (e) {
      // ignore if already initialized
      initialized = true;
    }
  }
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    initAdmin();

    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Missing token' }) };
    }
    const idToken = authHeader.replace('Bearer ', '').trim();
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const adminUids = (process.env.ADMIN_UIDS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!adminUids.includes(uid)) {
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'Forbidden' }) };
    }

    const db = admin.firestore();
    const items = [
      { id: 'streakShield', name: 'Streak Shield', description: 'Protect your streak from breaking if you miss a day.', price: 250, sort: 1 },
      { id: 'aiTaskBreakdown', name: 'AI Task Breakdown', description: 'Get one AI-powered task breakdown or advice.', price: 50, sort: 2 },
      { id: 'kernelCobaltTheme', name: 'Kernel Cobalt Theme', description: 'Unlock an exclusive dark blue color scheme.', price: 1000, sort: 3 },
    ];

    const batch = db.batch();
    items.forEach(it => {
      const ref = db.collection('shopItems').doc(it.id);
      batch.set(ref, it, { merge: true });
    });
    await batch.commit();

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, count: items.length }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Server error' }) };
  }
};
