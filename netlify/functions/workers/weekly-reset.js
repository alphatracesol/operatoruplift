const { getApps, initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

if (!getApps().length) {
  try { initializeApp(); } catch { initializeApp({ credential: applicationDefault() }); }
}

const db = getFirestore();

exports.handler = async () => {
  try {
    const usersSnap = await db.collection('users').select('protocol').get();
    let updated = 0;
    const batch = db.batch();
    const mondayIso = (() => {
      const now = new Date();
      const day = now.getDay();
      const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((day + 6) % 7));
      return monday.toISOString();
    })();

    usersSnap.forEach(doc => {
      const proto = doc.data()?.protocol || {};
      const lastReset = proto.lastReset ? new Date(proto.lastReset) : null;
      const monday = new Date(mondayIso);
      if (!lastReset || lastReset < monday) {
        const next = {
          studyCount: 0,
          workoutCount: 0,
          meditateCount: 0,
          lastReset: mondayIso
        };
        batch.set(doc.ref, { protocol: next }, { merge: true });
        updated++;
      }
    });
    await batch.commit();
    // write last run
    await db.collection('jobs').doc('weekly-reset').set({ lastRun: new Date() }, { merge: true });

    // Reset user mission progress (simple model: set progress=0)
    const usersSnap2 = await db.collection('users').select().get();
    for (const u of usersSnap2.docs) {
      const missionsRef = db.collection('users').doc(u.id).collection('missions');
      const mSnap = await missionsRef.get();
      const b = db.batch();
      mSnap.forEach(m => b.set(m.ref, { progress: 0 }, { merge: true }));
      if (!mSnap.empty) await b.commit();
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, protocolUpdated: updated }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(e?.message||e) }) };
  }
};


