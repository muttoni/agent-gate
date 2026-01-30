import { SignJWT, jwtVerify, createRemoteJWKSet } from 'jose';
import { getPrivateKey, getPublicJwk, getKeyPair } from './keys.js';

// Agent token (issued after PoW verification)
export async function mintToken({ audience, ttlSeconds = 600 }) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ttlSeconds;
  const privateKey = await getPrivateKey();
  const { publicJwk } = await getKeyPair();

  const token = await new SignJWT({ typ: 'agent' })
    .setProtectedHeader({ alg: 'ES256', kid: publicJwk.kid })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setAudience(audience)
    .setIssuer('agent-gate')
    .sign(privateKey);

  return { token, expiresAt: exp };
}

// Challenge token (short-lived, for PoW binding)
export async function mintChallenge({ nonce, difficulty, audience, ttlSeconds = 60 }) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ttlSeconds;
  const privateKey = await getPrivateKey();
  const { publicJwk } = await getKeyPair();

  const token = await new SignJWT({ typ: 'challenge', nonce, difficulty, audience })
    .setProtectedHeader({ alg: 'ES256', kid: publicJwk.kid })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setAudience('agent-gate-challenge')
    .setIssuer('agent-gate')
    .sign(privateKey);

  return { token, expiresAt: exp };
}

export async function verifyChallenge(token) {
  const { publicKey } = await getKeyPair();
  const { payload } = await jwtVerify(token, publicKey, {
    audience: 'agent-gate-challenge',
    issuer: 'agent-gate'
  });
  return payload;
}

// For integrators: verify token using local public key (same deployment)
export async function verifyToken(token, { audience } = {}) {
  const { publicKey } = await getKeyPair();
  const opts = { issuer: 'agent-gate' };
  if (audience) opts.audience = audience;
  const { payload } = await jwtVerify(token, publicKey, opts);
  return payload;
}

// For integrators: verify token using remote JWKS (cross-origin)
export function createVerifier(jwksUrl) {
  const JWKS = createRemoteJWKSet(new URL(jwksUrl));
  return async (token, { audience } = {}) => {
    const opts = { issuer: 'agent-gate' };
    if (audience) opts.audience = audience;
    const { payload } = await jwtVerify(token, JWKS, opts);
    return payload;
  };
}
