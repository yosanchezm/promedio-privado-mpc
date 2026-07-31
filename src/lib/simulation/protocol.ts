import {
  P,
  mod,
  multiplyMod,
  modularInverse,
  generatePolynomial,
  reconstructAtZero,
  evaluatePolynomial,
} from '@/lib/mpc';
import type { Share } from '@/lib/mpc';
import type { CompanyState, SimData } from '@/lib/simulation/types';

/**
 * Computes the Lagrange basis polynomials evaluated at x = 0 for a set of
 * points, using the exact same modular arithmetic as reconstructAtZero:
 *
 *   l_i(0) = prod_{j != i} (0 - x_j) / (x_i - x_j)  mod P
 *
 * Exposed so the technical view can show the real intermediate values used
 * during reconstruction.
 */
export function lagrangeBasisAtZero(points: Share[]): bigint[] {
  return points.map((p, i) => {
    let basis = 1n;
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const numerator = mod(0n - points[j].x);
      const denominator = mod(points[i].x - points[j].x);
      basis = multiplyMod(basis, multiplyMod(numerator, modularInverse(denominator)));
    }
    return basis;
  });
}

/**
 * Runs the full MPC protocol for the private average problem:
 *
 *   1. Sharing    — every company splits its salary into n Shamir shares.
 *   2. Computing  — every company sums the n shares it holds (additive
 *                   homomorphism: F(x) = sum_i f_i(x) is a degree t-1
 *                   polynomial whose constant term is the total salary).
 *   3. Reconstructing — t local sums are interpolated at x = 0 (Lagrange)
 *                   to recover the total; the average is total / n.
 *
 * Every intermediate value returned here is derived directly from the
 * cryptographic primitives in src/lib/mpc. No value is invented.
 */
export function runProtocol(n: number, t: number, salaries: number[]): SimData {
  if (!Number.isInteger(n) || n < 2) {
    throw new Error(`n must be an integer >= 2, got ${n}`);
  }
  if (!Number.isInteger(t) || t < 1 || t > n) {
    throw new Error(`t must be an integer with 1 <= t <= n, got ${t}`);
  }
  if (salaries.length !== n) {
    throw new Error(`salaries must contain exactly ${n} values, got ${salaries.length}`);
  }
  salaries.forEach((salary, i) => {
    if (!Number.isInteger(salary) || salary < 1) {
      throw new Error(`salary at index ${i} must be a positive integer, got ${salary}`);
    }
  });

  const secrets = salaries.map((salary) => BigInt(salary));
  const plainSum = secrets.reduce((acc, s) => acc + s, 0n);
  if (plainSum >= P) {
    throw new Error(
      `Sum of salaries (${plainSum}) exceeds the field prime P (${P}). ` +
        'Reduce the number of companies or the salary values.',
    );
  }

  const allShares: Share[][] = [];
  const companies: CompanyState[] = [];
  const rawPolynomials: bigint[][] = [];

  for (let i = 0; i < n; i++) {
    const secret = secrets[i];
    const coefficients = generatePolynomial(secret, t);
    rawPolynomials.push(coefficients);

    // Build every share from the SAME polynomial stored above, so the shares
    // shown in the UI always match the displayed coefficients.
    const shares: Share[] = [];
    for (let x = 1; x <= n; x++) {
      shares.push({ x: BigInt(x), y: evaluatePolynomial(coefficients, BigInt(x)) });
    }
    allShares.push(shares);

    const ownShare = shares[i];
    const outgoingShares = shares.filter((_, idx) => idx !== i);

    companies.push({
      index: i + 1,
      name: `Empresa ${i + 1}`,
      secret,
      coefficients: coefficients.map(String),
      ownShare,
      outgoingShares,
      receivedShares: [],
      localSum: 0n,
    });
  }

  // Distribution: company j receives f_i(j) from every other company i.
  for (let j = 0; j < n; j++) {
    const received: CompanyState['receivedShares'] = [];
    for (let i = 0; i < n; i++) {
      if (i === j) continue;
      received.push({ from: i + 1, share: allShares[i][j] });
    }

    // Local computation: additive homomorphism. F(j) = sum_i f_i(j) mod P.
    let localSum = mod(companies[j].ownShare.y);
    for (const receivedShare of received) {
      localSum = mod(localSum + receivedShare.share.y);
    }
    companies[j].receivedShares = received;
    companies[j].localSum = localSum;
  }

  // Cross-check the homomorphism: localSum_j must equal evaluatePolynomial
  // of the summed polynomial at x = j. We build the summed polynomial
  // explicitly (coefficient-wise addition) to prove the identity.
  const summedCoefficients = rawPolynomials[0].map((_, k) =>
    rawPolynomials.reduce((acc, c) => mod(acc + c[k]), 0n),
  );
  const homomorphismVerified = companies.every((c) => {
    const evaluated = evaluatePolynomial(summedCoefficients, BigInt(c.index));
    return evaluated === c.localSum;
  });

  // Reconstruction: any t of the local sums suffice. We use x = 1..t.
  const reconstructionPoints = companies.slice(0, t).map((c) => ({
    x: BigInt(c.index),
    y: c.localSum,
  }));

  let totalReconstructed: bigint;
  let reconstructionNote: string | undefined;
  if (t === 1) {
    // Degree-0 polynomial: F(x) is constant, so a single point determines f(0).
    totalReconstructed = mod(reconstructionPoints[0].y);
    reconstructionNote =
      'Con t = 1 cada polinomio tiene grado 0 (constante), por lo que una sola ' +
      'suma local determina el total: F(x) = S para todo x.';
  } else {
    totalReconstructed = reconstructAtZero(reconstructionPoints);
  }

  const basis = lagrangeBasisAtZero(reconstructionPoints);
  const verifiedBasis = mod(
    reconstructionPoints.reduce((acc, p, i) => acc + p.y * basis[i], 0n),
  );
  const average = Number(totalReconstructed) / n;
  const averageIsExact = totalReconstructed % BigInt(n) === 0n;

  return {
    config: { n, t, salaries },
    prime: P,
    companies,
    reconstructionPoints,
    basis: basis.map(String),
    totalReconstructed,
    average,
    averageIsExact,
    reconstructionVerified:
      totalReconstructed === plainSum && verifiedBasis === plainSum && homomorphismVerified,
    reconstructionNote,
  };
}
