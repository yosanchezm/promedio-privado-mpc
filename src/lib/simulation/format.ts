import { P } from '@/lib/mpc';

/** Full decimal string of a BigInt value. */
export function formatBigInt(value: bigint): string {
  return value.toString();
}

/**
 * Compact representation for chips and cards: keeps the last `keep` digits,
 * prefixed with an ellipsis when the value is long. The full value is always
 * available in the technical tables and as the `title` attribute.
 */
export function shortBigInt(value: bigint, keep = 8): string {
  const s = value.toString();
  if (s.length <= keep + 1) return s;
  return `…${s.slice(s.length - keep)}`;
}

/** Locale-aware integer formatting (Spanish/Colombia grouping). */
export function formatNumber(value: number): string {
  return value.toLocaleString('es-CO');
}

/** Currency formatting for plain numbers. */
export function formatSalary(value: number): string {
  return `$${value.toLocaleString('es-CO')}`;
}

/** Currency formatting for BigInt values (totals). */
export function formatSalaryBigInt(value: bigint): string {
  return `$${value.toLocaleString('es-CO')}`;
}

/**
 * Average with the right precision: exact values render without decimals,
 * fractional values with two decimals.
 */
export function formatAverage(value: number): string {
  if (Number.isInteger(value)) {
    return value.toLocaleString('es-CO');
  }
  return value.toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Pretty-prints a polynomial from its coefficients (constant term first),
 * e.g. "5000 + 1324…x + 8765…x²".
 */
export function formatPolynomial(coefficients: (bigint | string)[]): string {
  return coefficients
    .map((c, i) => {
      const term =
        i === 0 ? String(c) : i === 1 ? 'x' : `x${superscript(i)}`;
      const signed = BigInt(c) >= 0n ? String(c) : `(${String(c)})`;
      if (i === 0) return signed;
      return `${signed}·${term}`;
    })
    .join(' + ');
}

/** Full technical polynomial with complete coefficient values. */
export function formatPolynomialFull(coefficients: (bigint | string)[]): string {
  return coefficients
    .map((c, i) => {
      const term = i === 0 ? '' : i === 1 ? 'x' : `x${superscript(i)}`;
      return i === 0 ? `${c}` : `${c}·${term}`;
    })
    .join(' + ');
}

/** Unicode superscripts for small polynomial degrees. */
export function superscript(n: number): string {
  const digits = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  return String(n)
    .split('')
    .map((d) => digits[Number(d)])
    .join('');
}

/** Human-readable form of the field prime for the UI. */
export function formatPrime(): string {
  return P.toLocaleString('es-CO');
}

/** Shows a point (x, y) compactly, e.g. "(1, …12345)". */
export function formatPoint(point: { x: bigint; y: bigint }): string {
  return `(${point.x}, ${shortBigInt(point.y)})`;
}
