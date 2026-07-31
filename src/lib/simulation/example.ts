import type { SimConfig } from '@/lib/simulation/types';

/** Default configuration shown when the setup panel loads. */
export const DEFAULT_CONFIG: SimConfig = {
  n: 4,
  t: 3,
  salaries: [5000, 6000, 4500, 7000],
};

/** Salary range used by the random generator (inclusive). */
export const MIN_SALARY = 3000;
export const MAX_SALARY_RANDOM = 9000;

/**
 * Builds coherent random salary values (integers in [3000, 9000]).
 * Company names follow the "Empresa i" convention used everywhere else.
 */
export function generateRandomSalaries(n: number): number[] {
  const count = Math.min(Math.max(Math.round(n), 1), 15);
  return Array.from({ length: count }, () =>
    MIN_SALARY + Math.floor(Math.random() * (MAX_SALARY_RANDOM - MIN_SALARY + 1)),
  );
}

/**
 * Returns a fresh random config with coherent values ready to simulate.
 */
export function generateRandomConfig(n: number): SimConfig {
  const salaries = generateRandomSalaries(n);
  return { n: salaries.length, t: Math.max(1, salaries.length - 1), salaries };
}

/**
 * Company display names following the "Empresa i" convention.
 */
export function companyName(index: number): string {
  return `Empresa ${index}`;
}
