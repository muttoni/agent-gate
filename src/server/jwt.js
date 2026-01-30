import { SignJWT, jwtVerify } from 'jose';

const encoder = new TextEncoder();

export function getSecret() {
  const s = process.env.AGENT_GATE_JWT_SECRET;
  if (!s) throw new Error('Missing AGENT_GATE_JWT_SECRET');
  return encoder.encode(s);
}

export async function mintToken({ audience = 'agent-gate', ttlSeconds = 600 }) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ttlSeconds;

  const token = await new SignJWT({ typ: 'agent' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setAudience(audience)
    .setIssuer('agent-gate')
    .sign(getSecret());

  return { token, expiresAt: exp };
}

export async function mintChallenge({ nonce, difficulty, ttlSeconds = 60 }) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ttlSeconds;

  const token = await new SignJWT({ typ: 'challenge', nonce, difficulty })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setAudience('agent-gate-challenge')
    .setIssuer('agent-gate')
    .sign(getSecret());

  return { token, expiresAt: exp };
}

export async function verifyChallenge(token) {
  const { payload } = await jwtVerify(token, getSecret(), {
    audience: 'agent-gate-challenge',
    issuer: 'agent-gate'
  });
  return payload;
}

export async function verifyToken(token, { audience = 'agent-gate' } = {}) {
  const { payload } = await jwtVerify(token, getSecret(), {
    audience,
    issuer: 'agent-gate'
  });
  return payload;
}
