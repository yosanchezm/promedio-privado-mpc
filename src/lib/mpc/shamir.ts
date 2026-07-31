/**
 * Shamir Secret Sharing over the prime field GF(P) where P = 2^61 - 1.
 *
 * Provides polynomial generation, share evaluation, additive homomorphism,
 * and Lagrange interpolation at x = 0 (secret reconstruction).
 */

import { P } from "./field.ts";
import { randomBigInt } from "./random.ts";

/**
 * Local mod helper using the provided prime (or default P).
 */
function modP(a: bigint, prime: bigint): bigint {
  const r = a % prime;
  return r >= 0n ? r : r + prime;
}

/**
 * Generates a random polynomial of degree `threshold - 1` with the given secret
 * as the constant term (coefficient[0]).
 *
 * All non-secret coefficients are uniformly random in [0, P-1].
 *
 * @param secret   The secret to encode (constant term, c0).
 * @param threshold Number of coefficients (= polynomial degree + 1).
 * @param prime    Optional prime modulus (defaults to P).
 * @returns        Array of coefficients [c0, c1, ..., c_{threshold-1}].
 */
export function generatePolynomial(
  secret: bigint,
  threshold: number,
  prime: bigint = P,
): bigint[] {
  const coefficients: bigint[] = [modP(secret, prime)];

  for (let i = 1; i < threshold; i++) {
    coefficients.push(randomBigInt());
  }

  return coefficients;
}

/**
 * Evaluates a polynomial at a given point x using Horner's method.
 *
 * Evaluates: c0 + x * (c1 + x * (c2 + ... x * c_{n-1})) mod prime.
 *
 * @param coefficients Polynomial coefficients (constant term first).
 * @param x            Point at which to evaluate.
 * @param prime        Optional prime modulus (defaults to P).
 */
export function evaluatePolynomial(
  coefficients: bigint[],
  x: bigint,
  prime: bigint = P,
): bigint {
  let result = coefficients[coefficients.length - 1];

  for (let i = coefficients.length - 2; i >= 0; i--) {
    result = modP(result * x + coefficients[i], prime);
  }

  return result;
}

/**
 * A single share: the pair (x, y = f(x)).
 */
export interface Share {
  x: bigint;
  y: bigint;
}

/**
 * Generates `n` shares of the given secret using a degree `threshold - 1`
 * polynomial. Shares are evaluated at x = 1, 2, ..., n.
 *
 * @param secret   The secret to share.
 * @param n        Number of shares to produce (must be >= threshold).
 * @param threshold Minimum number of shares needed to reconstruct.
 * @param prime    Optional prime modulus (defaults to P).
 */
export function generateShares(
  secret: bigint,
  n: number,
  threshold: number,
  prime: bigint = P,
): Share[] {
  if (n < threshold) {
    throw new Error(
      `n (${n}) must be >= threshold (${threshold}) to allow reconstruction`,
    );
  }

  const coefficients = generatePolynomial(secret, threshold, prime);
  const shares: Share[] = [];

  for (let i = 1; i <= n; i++) {
    const x = BigInt(i);
    const y = evaluatePolynomial(coefficients, x, prime);
    shares.push({ x, y });
  }

  return shares;
}

/**
 * Adds two sets of Shamir shares element-wise (additive homomorphism).
 *
 * Given shares of secret `a` and shares of secret `b` with matching x
 * coordinates, returns shares of `a + b`.
 *
 * @throws If the share arrays have different lengths or the x coordinates
 *         at any position do not match.
 */
export function addShares(
  shares1: Share[],
  shares2: Share[],
  prime: bigint = P,
): Share[] {
  if (shares1.length !== shares2.length) {
    throw new Error(
      `Share array length mismatch: ${shares1.length} vs ${shares2.length}`,
    );
  }

  const result: Share[] = [];

  for (let i = 0; i < shares1.length; i++) {
    const s1 = shares1[i];
    const s2 = shares2[i];

    if (s1.x !== s2.x) {
      throw new Error(
        `x-coordinate mismatch at index ${i}: ${s1.x} vs ${s2.x}`,
      );
    }

    result.push({
      x: s1.x,
      y: modP(s1.y + s2.y, prime),
    });
  }

  return result;
}

/**
 * Reconstructs the secret encoded at the constant term of a Shamir polynomial
 * (f(0)) using Lagrange interpolation.
 *
 * Lagrange formula at x = 0:
 *
 *   f(0) = Σᵢ yᵢ · ℓᵢ(0)  mod prime
 *
 *   ℓᵢ(0) = ∏ⱼ₌ᵢ (0 − xⱼ) / (xᵢ − xⱼ)  mod prime
 *
 * @param points At least 2 points (shares) from the polynomial. Every point
 *               must have a unique x coordinate.
 * @param prime  Optional prime modulus (defaults to P).
 * @throws If fewer than 2 points are provided or if there are duplicate x
 *         coordinates.
 */
export function reconstructAtZero(
  points: Share[],
  prime: bigint = P,
): bigint {
  if (points.length < 2) {
    throw new Error(
      `At least 2 points are required for reconstruction, got ${points.length}`,
    );
  }

  const seen = new Set<string>();
  for (const p of points) {
    const key = p.x.toString();
    if (seen.has(key)) {
      throw new Error(`Duplicate x coordinate: ${key}`);
    }
    seen.add(key);
  }

  let result = 0n;

  for (let i = 0; i < points.length; i++) {
    const xi = points[i].x;
    const yi = points[i].y;

    let basis = 1n;

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const xj = points[j].x;

      const num = modP(-xj, prime);
      const den = modP(xi - xj, prime);
      const inv = powerModPrime(den, prime);
      basis = modP(basis * num * inv, prime);
    }

    result = modP(result + yi * basis, prime);
  }

  return result;
}

/**
 * Fast modular exponentiation: (base^exponent) mod prime, using a caller-supplied
 * prime (not necessarily P).
 */
function powerModPrime(base: bigint, prime: bigint): bigint {
  const exponent = prime - 2n;
  let result = 1n;
  let b = modP(base, prime);
  let e = exponent;

  while (e > 0n) {
    if (e & 1n) {
      result = modP(result * b, prime);
    }
    b = modP(b * b, prime);
    e >>= 1n;
  }

  return result;
}
