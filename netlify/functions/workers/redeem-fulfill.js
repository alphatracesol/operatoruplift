const { getApps, initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { Connection, PublicKey, Keypair, sendAndConfirmTransaction } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } = require('@solana/spl-token');

if (!getApps().length) {
  try {
    initializeApp();
  } catch (_) {
    initializeApp({ credential: applicationDefault() });
  }
}

const db = getFirestore();

exports.handler = async function(event) {
  try {
    const rpc = process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const conn = new Connection(rpc, 'confirmed');
    const mintStr = process.env.UPLIFT_MINT;
    const mint = new PublicKey(mintStr);
    const treasuryPub = new PublicKey(process.env.TREASURY_PUBLIC_KEY);
    const secret = process.env.TREASURY_PRIVATE_KEY;
    if (!secret) return { statusCode: 200, body: JSON.stringify({ ok: true, note: 'No TREASURY_PRIVATE_KEY configured; dry run only' }) };

    const secretBytes = JSON.parse(secret); // store as JSON array in env
    const payer = Keypair.fromSecretKey(Uint8Array.from(secretBytes));

    // Fetch up to N pending redemptions that have vested
    const now = new Date();
    const snap = await db.collection('redemptions')
      .where('status', '==', 'pending')
      .where('vestingEnd', '<=', now)
      .limit(10)
      .get();

    const results = [];
    for (const doc of snap.docs) {
      const r = doc.data();
      try {
        const userWallet = new PublicKey(r.wallet);
        const userAta = await getAssociatedTokenAddress(mint, userWallet);
        const treasuryAta = await getAssociatedTokenAddress(mint, treasuryPub);
        const ixns = [];
        // ensure user ATA exists
        // Note: cheap check by attempting to fetch; fallback to create
        const info = await conn.getAccountInfo(userAta);
        if (!info) {
          ixns.push(createAssociatedTokenAccountInstruction(
            payer.publicKey,
            userAta,
            userWallet,
            mint,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          ));
        }
        // transfer from treasury to user
        const amount = BigInt(r.upliftGranted || 0); // assumes mint decimals already accounted by grant calc
        if (amount <= 0n) throw new Error('invalid_amount');
        ixns.push(createTransferInstruction(
          treasuryAta,
          userAta,
          treasuryPub,
          Number(amount) // for large amounts, use BigInt-safe builder
        ));
        const { Transaction, SystemProgram } = require('@solana/web3.js');
        const tx = new Transaction().add(...ixns);
        tx.feePayer = payer.publicKey;
        const sig = await sendAndConfirmTransaction(conn, tx, [payer]);
        await db.collection('redemptions').doc(doc.id).set({ status: 'fulfilled', tx: sig, fulfilledAt: FieldValue.serverTimestamp() }, { merge: true });
        results.push({ id: doc.id, ok: true, tx: sig });
      } catch (e) {
        await db.collection('redemptions').doc(doc.id).set({ status: 'error', error: String(e?.message||e) }, { merge: true });
        results.push({ id: doc.id, ok: false, error: String(e?.message||e) });
      }
    }
    // write last run
    try { await db.collection('jobs').doc('redeem-fulfill').set({ lastRun: new Date() }, { merge: true }); } catch {}
    return { statusCode: 200, body: JSON.stringify({ ok: true, processed: results.length, results }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(e?.message||e) }) };
  }
};


