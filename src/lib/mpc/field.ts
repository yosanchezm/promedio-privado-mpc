/**
 * Prime field arithmetic modulo p = 2^61 - 1 (Mersenne prime).
 *
 * Constant: 4 * MAX_SALARY < P ensures no overflow when summing up to 4 salary shares.
 */

/** Prime modulus: 2^61 - 1 = 2305843009213693951 */
export const P = 2n ** 61n - 1n;

/**
 * Maximum representable salary value.
 * Constraint: 4 * MAX_SALARY < P guarantees no modular wrap-around when summing
 * four salary shares (e.g. average-of-four protocol).
 */
export const MAX_SALARY = P / 4n - 1n;

/**
 * Normalizes a BigInt to the range [0, P-1].
 * Correctly handles negative values by adding P until the result is non-negative.
 */
export function mod(a: bigint): bigint {
  const result = a % P;
  return result >= 0n ? result : result + P;
}

/** (a + b) mod P — accepts any BigInt inputs. */
export function addMod(a: bigint, b: bigint): bigint {
  return mod(a + b);
}

/** (a - b) mod P — correctly handles negative intermediate results. */
export function subMod(a: bigint, b: bigint): bigint {
  return mod(a - b);
}

/** (a * b) mod P */
export function multiplyMod(a: bigint, b: bigint): bigint {
  return mod(a * b);
}

/**
 * Fast modular exponentiation: (base^exponent) mod P.
 * Uses square-and-multiply (binary exponentiation).
 */
export function powerMod(base: bigint, exponent: bigint): bigint {
  let result = 1n;
  let b = mod(base);
  let e = exponent;

  while (e > 0n) {
    if (e & 1n) {
      result = multiplyMod(result, b);
    }
    b = multiplyMod(b, b);
    e >>= 1n;
  }

  return result;
}

/**
 * Modular multiplicative inverse of a modulo P.
 *
 * Uses Fermat's little theorem: a^(P-2) ≡ a^(-1) (mod P).
 * This works because P is prime and gcd(a, P) = 1 for a ≠ 0.
 *
 * @throws if a === 0n (zero has no inverse modulo P).
 */
export function modularInverse(a: bigint): bigint {
  if (a === 0n) {
    throw new Error("Cannot compute modular inverse of 0");
  }
  return powerMod(a, P - 2n);
}
