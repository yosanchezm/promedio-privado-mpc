import { P } from './field';
export { P, MAX_SALARY, mod, subMod, multiplyMod, powerMod, modularInverse } from './field';
export { randomBigInt } from './random';
export type { Share } from './shamir';
export { generatePolynomial, evaluatePolynomial, generateShares, addShares, reconstructAtZero } from './shamir';

/**
 * (a + b) mod prime — accepts an explicit prime parameter.
 * Defaults to P to match the behavior of the field-level addMod.
 */
export function addMod(a: bigint, b: bigint, prime: bigint = P): bigint {
  const r = (a + b) % prime;
  return r >= 0n ? r : r + prime;
}
