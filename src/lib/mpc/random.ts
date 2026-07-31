/**
 * Cryptographically secure random BigInt generation.
 *
 * Uses crypto.getRandomValues() — never Math.random().
 */

import { P } from "./field.ts";

/** 61-bit mask: lowest 61 bits set to 1. */
const BIT61_MASK = (1n << 61n) - 1n;

/**
 * Returns a uniformly random BigInt in [0, P-1].
 *
 * Generates 8 bytes (64 bits) of randomness, masks to 61 bits (fits in
 * [0, 2^61-1]), and rejects the single value P ≡ 0 (the masking could
 * produce P but never exceeds it). Rejection probability is ~1/2^61.
 */
export function randomBigInt(): bigint {
  const bytes = new Uint8Array(8);

  for (;;) {
    crypto.getRandomValues(bytes);
    let value = 0n;
    for (let i = 0; i < bytes.length; i++) {
      value = (value << 8n) | BigInt(bytes[i]);
    }
    value &= BIT61_MASK;
    if (value < P) {
      return value;
    }
  }
}

/**
 * Returns a uniformly random BigInt in [min, max] (inclusive).
 *
 * Uses rejection sampling over a range-sized interval to avoid modular bias.
 * Generates enough random bytes to cover at least `bitLength(range) + 8` bits.
 */
export function randomBigIntRange(min: bigint, max: bigint): bigint {
  if (min > max) {
    throw new Error("min must be <= max");
  }

  const range = max - min + 1n;
  const bitLen = range.toString(2).length;
  const byteLen = Math.ceil((bitLen + 8) / 8);
  const bytes = new Uint8Array(byteLen);

  for (;;) {
    crypto.getRandomValues(bytes);
    let value = 0n;
    for (let i = 0; i < bytes.length; i++) {
      value = (value << 8n) | BigInt(bytes[i]);
    }
    if (value < range) {
      return min + value;
    }
  }
}
