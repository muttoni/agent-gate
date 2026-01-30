import { createHash, randomUUID, randomBytes } from 'node:crypto';

export function sha256Hex(input) {
  return createHash('sha256').update(input).digest('hex');
}

export function randomNonce() {
  return randomBytes(16).toString('hex');
}

export function newId() {
  return randomUUID();
}

// Count leading zero bits in a hex string.
export function leadingZeroBits(hex) {
  let bits = 0;
  for (let i = 0; i < hex.length; i++) {
    const nibble = parseInt(hex[i], 16);
    if (nibble === 0) {
      bits += 4;
      continue;
    }
    // nibble non-zero: count leading zeros within nibble
    if (nibble < 8) bits += 1;
    if (nibble < 4) bits += 1;
    if (nibble < 2) bits += 1;
    return bits;
  }
  return bits;
}
