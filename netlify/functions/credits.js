const { initializeApp, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin once
if (!getApps().length) {
  try {
    initializeApp({
      credential: require('firebase-admin/app').cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  } catch (err) {
    try { initializeApp(); } catch (_) {}
  }
}

const auth = getAuth();
const db = getFirestore();

exports.handler = async function(event) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    if (!event.body) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing body' }) };
    const { code } = JSON.parse(event.body);
    if (!code || typeof code !== 'string') return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid code' }) };

    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Authorization required' }) };
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await auth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // Parse promo codes from env: format "CODE:AMOUNT,CODE2:AMOUNT2"
    const raw = process.env.CREDIT_PROMO_CODES || '';
    const map = new Map();
    raw.split(',').map(s => s.trim()).filter(Boolean).forEach(pair => {
      const [k, v] = pair.split(':');
      if (k && v && !isNaN(parseInt(v, 10))) map.set(k.toUpperCase(), parseInt(v, 10));
    });
    const amount = map.get(code.toUpperCase());
    if (!amount) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid or expired code' }) };
    }

    // Prevent duplicate redemption per user
    const redemptionId = `${uid}_${code.toUpperCase()}`;
    const redemptionRef = db.collection('creditRedemptions').doc(redemptionId);
    const redemptionSnap = await redemptionRef.get();
    if (redemptionSnap.exists) {
      return { statusCode: 409, headers, body: JSON.stringify({ error: 'Code already redeemed by user' }) };
    }

    // Increment credits atomically and record redemption
    const userRef = db.collection('users').doc(uid);
    await db.runTransaction(async (tx) => {
      tx.set(redemptionRef, { uid, code: code.toUpperCase(), redeemedAt: FieldValue.serverTimestamp(), amount });
      tx.set(userRef, { stats: { aiCredits: FieldValue.increment(amount) } }, { merge: true });
    });

    // Read updated balance
    const updated = await userRef.get();
    const newBalance = (updated.data()?.stats?.aiCredits) ?? null;
    return { statusCode: 200, headers, body: JSON.stringify({ added: amount, balance: newBalance }) };
  } catch (err) {
    console.error('Credits function error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};


