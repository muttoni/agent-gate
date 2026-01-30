import { solvePow } from './pow.js';

export async function getAgentToken({ baseUrl, audience }) {
  const challengeUrl = new URL('/api/agent-gate/challenge', baseUrl);
  if (audience) challengeUrl.searchParams.set('audience', audience);

  const challengeRes = await fetch(challengeUrl, { method: 'POST' });
  if (!challengeRes.ok) throw new Error('challenge_failed');
  const challenge = await challengeRes.json();

  const { solution } = await solvePow({ nonce: challenge.nonce, difficulty: challenge.difficulty, maxIters: 20_000_000 });

  const verifyRes = await fetch(`${baseUrl}/api/agent-gate/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ challengeToken: challenge.challengeToken, solution })
  });

  if (!verifyRes.ok) {
    const err = await verifyRes.text();
    throw new Error(`verify_failed:${err}`);
  }

  return verifyRes.json();
}

export { createVerifier } from './verifier.js';
