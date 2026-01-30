import { SignJWT, jwtVerify } from 'jose';

const encoder = new TextEncoder();

function getSecret() {
  const s = process.env.AGENT_GATE_SECRET;
  if (!s) throw new Error('Missing AGENT_GATE_SECRET env var');
  return encoder.encode(s);
}

// Challenge token (short-lived, binds nonce + difficulty)
export async function mintChallenge({ nonce, difficulty, ttlSeconds = 60 }) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ttlSeconds;

  const token = await new SignJWT({ typ: 'challenge', nonce, difficulty })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setIssuer('agent-gate')
    .sign(getSecret());

  return { token, expiresAt: exp };
}

export async function verifyChallenge(token) {
  const { payload } = await jwtVerify(token, getSecret(), {
    issuer: 'agent-gate'
  });
  if (payload.typ !== 'challenge') throw new Error('not a challenge token');
  return payload;
}

// Agent token (issued after PoW verification)
export async function mintToken({ ttlSeconds = 600 }) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ttlSeconds;

  const token = await new SignJWT({ typ: 'agent' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setIssuer('agent-gate')
    .sign(getSecret());

  return { token, expiresAt: exp };
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, getSecret(), {
    issuer: 'agent-gate'
  });
  if (payload.typ !== 'agent') throw new Error('not an agent token');
  return payload;
}
