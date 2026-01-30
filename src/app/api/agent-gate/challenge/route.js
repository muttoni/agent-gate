import { NextResponse } from 'next/server';
import { randomNonce } from '../../../../server/crypto.js';
import { mintChallenge } from '../../../../server/jwt.js';

export const runtime = 'nodejs';

export async function POST() {
  const nonce = randomNonce();
  const difficulty = 18; // ~1-3 seconds for code, impossible by hand

  const { token, expiresAt } = await mintChallenge({ nonce, difficulty, ttlSeconds: 60 });

  return NextResponse.json({ challengeToken: token, nonce, difficulty, expiresAt });
}
