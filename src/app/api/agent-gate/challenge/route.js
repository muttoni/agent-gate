import { NextResponse } from 'next/server';
import { randomNonce } from '../../../../server/crypto.js';
import { mintChallenge } from '../../../../server/jwt.js';

export const runtime = 'nodejs';

export async function POST(req) {
  const url = new URL(req.url);
  const audience = url.searchParams.get('audience') || 'default';

  const nonce = randomNonce();
  const difficulty = 18; // tune (v0: keep fast; humans can't do by hand)

  const { token, expiresAt } = await mintChallenge({ nonce, difficulty, audience, ttlSeconds: 60 });

  return NextResponse.json({ challengeToken: token, nonce, difficulty, audience, expiresAt });
}
