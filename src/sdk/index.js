import { solvePow } from './pow.js';

/**
 * Get an agent token from an agent-gate deployment.
 * 
 * @param {Object} options
 * @param {string} options.baseUrl - The agent-gate deployment URL
 * @returns {Promise<{token: string, expiresAt: number}>}
 */
export async function getAgentToken({ baseUrl }) {
  const challengeRes = await fetch(`${baseUrl}/api/agent-gate/challenge`, { method: 'POST' });
  if (!challengeRes.ok) throw new Error('challenge_failed');
  const challenge = await challengeRes.json();

  const { solution } = await solvePow({ 
    nonce: challenge.nonce, 
    difficulty: challenge.difficulty, 
    maxIters: 20_000_000 
  });

  const verifyRes = await fetch(`${baseUrl}/api/agent-gate/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ challengeToken: challenge.challengeToken, solution })
  });

  if (!verifyRes.ok) {
    const err = await verifyRes.text();
    throw new Error(`verify_failed: ${err}`);
  }

  return verifyRes.json();
}
