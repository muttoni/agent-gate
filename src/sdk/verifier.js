/**
 * Verifier for integrators (runs on their backend).
 * Fetches public key from agent-gate's JWKS endpoint and verifies tokens.
 *
 * Usage:
 *   import { createVerifier } from 'agent-gate/verifier'
 *   const verify = createVerifier('https://agent-gate.yourdomain.com')
 *   const payload = await verify(token, { audience: 'your-site.com' })
 */

import { createRemoteJWKSet, jwtVerify } from 'jose';

export function createVerifier(agentGateBaseUrl) {
  const jwksUrl = new URL('/.well-known/jwks.json', agentGateBaseUrl);
  const JWKS = createRemoteJWKSet(jwksUrl);

  return async function verify(token, { audience } = {}) {
    const opts = { issuer: 'agent-gate' };
    if (audience) opts.audience = audience;

    const { payload } = await jwtVerify(token, JWKS, opts);
    return payload;
  };
}
