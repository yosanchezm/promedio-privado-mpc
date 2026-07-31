/**
 * Pure cost metrics of the MPC protocol.
 *
 * Communication grows quadratically with the number of companies:
 * each of the n companies sends a share to the other n - 1, and the
 * reconstruction collects t local sums.
 */

export interface GrowthRow {
  n: number;
  t: number;
  /** Total Shamir shares generated (n per company). */
  shares: number;
  /** Share-distribution messages (each company sends to n - 1 others). */
  dist: number;
  /** Messages sent to the reconstructor. */
  recon: number;
  /** Total messages. */
  total: number;
  /** Pedagogical observation. */
  observation: string;
}

/** Every company generates n shares (one per participant). */
export function sharesTotal(n: number): number {
  return n * n;
}

/** Each of the n companies sends n - 1 shares to the others. */
export function distributionMessages(n: number): number {
  return n * (n - 1);
}

/** The reconstructor only needs t local sums. */
export function reconstructionMessages(t: number): number {
  return t;
}

/** Total communication cost of the protocol. */
export function totalMessages(n: number, t: number): number {
  return n * (n - 1) + t;
}

/** Sensible threshold: with n participants, n - 1 must collaborate. */
export function defaultThreshold(n: number): number {
  return Math.max(1, n - 1);
}

export type GrowthClass = 'constante' | 'lineal' | 'cuadrático' | 'exponencial';

/**
 * Classifies the growth of a message count relative to n:
 * quadratic when it scales like n^2 (as the distribution does).
 */
export function growthClass(messages: number, n: number): GrowthClass {
  if (messages <= n) return 'lineal';
  if (messages <= n * n) return 'cuadrático';
  return 'exponencial';
}

function observationFor(total: number, n: number): string {
  if (total <= n * 3) return 'Costo mínimo';
  if (total < 50) return 'Costo moderado';
  return 'Crecimiento cuadrático';
}

/**
 * Builds the growth table for n in [min, max] using the provided threshold
 * strategy (defaults to t = n - 1).
 */
export function buildTable(
  max = 15,
  min = 3,
  thresholdFn: (n: number) => number = defaultThreshold,
): GrowthRow[] {
  const rows: GrowthRow[] = [];
  for (let n = min; n <= max; n++) {
    const t = thresholdFn(n);
    const shares = sharesTotal(n);
    const dist = distributionMessages(n);
    const recon = reconstructionMessages(t);
    const total = totalMessages(n, t);
    rows.push({
      n,
      t,
      shares,
      dist,
      recon,
      total,
      observation: observationFor(total, n),
    });
  }
  return rows;
}
