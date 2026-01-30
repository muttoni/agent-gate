import { exportJWK, generateKeyPair, importJWK } from 'jose';

let cachedKeyPair = null;

// In production, you'd store the private key in env and load it.
// For v0, we support both:
// 1) AGENT_GATE_PRIVATE_KEY_JWK env var (JSON string of JWK)
// 2) Fall back to generating ephemeral keys (not recommended for prod)

export async function getKeyPair() {
  if (cachedKeyPair) return cachedKeyPair;

  const privateKeyEnv = process.env.AGENT_GATE_PRIVATE_KEY_JWK;

  if (privateKeyEnv) {
    const privateJwk = JSON.parse(privateKeyEnv);
    const privateKey = await importJWK(privateJwk, 'ES256');

    // Derive public JWK (remove private parts)
    const publicJwk = { ...privateJwk };
    delete publicJwk.d;

    const publicKey = await importJWK(publicJwk, 'ES256');

    cachedKeyPair = {
      privateKey,
      publicKey,
      privateJwk,
      publicJwk: { ...publicJwk, kid: publicJwk.kid || 'agent-gate-1', use: 'sig', alg: 'ES256' }
    };
  } else {
    // Ephemeral key pair (will change on cold start - not for production)
    console.warn('[agent-gate] No AGENT_GATE_PRIVATE_KEY_JWK set, generating ephemeral keys');
    const { privateKey, publicKey } = await generateKeyPair('ES256');
    const privateJwk = await exportJWK(privateKey);
    const publicJwk = await exportJWK(publicKey);

    cachedKeyPair = {
      privateKey,
      publicKey,
      privateJwk,
      publicJwk: { ...publicJwk, kid: 'agent-gate-1', use: 'sig', alg: 'ES256' }
    };
  }

  return cachedKeyPair;
}

export async function getPublicJwk() {
  const { publicJwk } = await getKeyPair();
  return publicJwk;
}

export async function getPrivateKey() {
  const { privateKey } = await getKeyPair();
  return privateKey;
}
