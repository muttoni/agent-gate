import { NextResponse } from 'next/server';
import { sha256Hex, leadingZeroBits } from '../../../../server/crypto.js';
import { mintToken, verifyChallenge } from '../../../../server/jwt.js';

export const runtime = 'nodejs';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { challengeToken, solution } = body;

  if (!challengeToken || typeof solution !== 'string') {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  let challenge;
  try {
    challenge = await verifyChallenge(challengeToken);
  } catch {
    return NextResponse.json({ error: 'invalid_or_expired_challenge' }, { status: 400 });
  }

  const digest = sha256Hex(`${challenge.nonce}:${solution}`);
  const z = leadingZeroBits(digest);

  if (z < challenge.difficulty) {
    return NextResponse.json({ error: 'invalid_solution' }, { status: 400 });
  }

  // audience comes from the challenge token (was set at challenge time)
  const audience = challenge.audience || 'default';
  const { token, expiresAt } = await mintToken({ audience, ttlSeconds: 600 });
  return NextResponse.json({ token, audience, expiresAt });
}
