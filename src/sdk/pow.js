import { createHash } from 'node:crypto';

function sha256Hex(input) {
  return createHash('sha256').update(input).digest('hex');
}

function leadingZeroBits(hex) {
  let bits = 0;
  for (let i = 0; i < hex.length; i++) {
    const nibble = parseInt(hex[i], 16);
    if (nibble === 0) {
      bits += 4;
      continue;
    }
    if (nibble < 8) bits += 1;
    if (nibble < 4) bits += 1;
    if (nibble < 2) bits += 1;
    return bits;
  }
  return bits;
}

export async function solvePow({ nonce, difficulty, maxIters = 5_000_000 }) {
  // simple incremental search; good enough for v0
  for (let i = 0; i < maxIters; i++) {
    const solution = String(i);
    const digest = sha256Hex(`${nonce}:${solution}`);
    if (leadingZeroBits(digest) >= difficulty) {
      return { solution, iters: i + 1 };
    }
    // yield occasionally
    if (i % 50_000 === 0) await new Promise((r) => setTimeout(r, 0));
  }
  throw new Error('pow_not_found');
}
