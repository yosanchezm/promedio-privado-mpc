import { describe, it, expect } from 'vitest';
import { P, mod, addMod, subMod, multiplyMod, powerMod, modularInverse, MAX_SALARY } from '../../src/lib/mpc/field';
import { generatePolynomial, evaluatePolynomial, generateShares, addShares, reconstructAtZero } from '../../src/lib/mpc/shamir';
import type { Share } from '../../src/lib/mpc/shamir';
import { randomBigInt } from '../../src/lib/mpc/random';

describe('Modular arithmetic', () => {
  it('mod(0n) === 0n', () => {
    expect(mod(0n)).toBe(0n);
  });

  it('mod(P) === 0n', () => {
    expect(mod(P)).toBe(0n);
  });

  it('mod(-1n) === P - 1n', () => {
    expect(mod(-1n)).toBe(P - 1n);
  });

  it('mod(P + 5n) === 5n', () => {
    expect(mod(P + 5n)).toBe(5n);
  });

  it('addMod(P - 1n, 1n) === 0n', () => {
    expect(addMod(P - 1n, 1n)).toBe(0n);
  });

  it('subMod(0n, 1n) === P - 1n', () => {
    expect(subMod(0n, 1n)).toBe(P - 1n);
  });

  it('multiplyMod(2n, 3n) === 6n', () => {
    expect(multiplyMod(2n, 3n)).toBe(6n);
  });

  it('multiplyMod(P - 1n, P - 1n) === 1n', () => {
    expect(multiplyMod(P - 1n, P - 1n)).toBe(1n);
  });

  it('powerMod(2n, 10n) === 1024n', () => {
    expect(powerMod(2n, 10n)).toBe(1024n);
  });

  it('powerMod(2n, P - 1n) === 1n (Fermat)', () => {
    expect(powerMod(2n, P - 1n)).toBe(1n);
  });

  it('modularInverse(1n) === 1n', () => {
    expect(modularInverse(1n)).toBe(1n);
  });

  it('modularInverse(2n) * 2n mod P === 1n', () => {
    const inv = modularInverse(2n);
    expect(multiplyMod(inv, 2n)).toBe(1n);
  });

  it('modularInverse(P - 1n) === P - 1n', () => {
    expect(modularInverse(P - 1n)).toBe(P - 1n);
  });

  it('modularInverse(0n) throws', () => {
    expect(() => modularInverse(0n)).toThrow();
  });

  it('randomBigInt returns values in [0, P-1]', () => {
    for (let i = 0; i < 20; i++) {
      const val = randomBigInt();
      expect(val).toBeGreaterThanOrEqual(0n);
      expect(val).toBeLessThan(P);
    }
  });
});

describe('Polynomial operations', () => {
  it('generatePolynomial returns threshold coefficients', () => {
    const coeffs = generatePolynomial(42n, 5);
    expect(coeffs).toHaveLength(5);
  });

  it('first coefficient equals the secret', () => {
    const secret = 12345n;
    const coeffs = generatePolynomial(secret, 5);
    expect(coeffs[0]).toBe(secret);
  });

  it('evaluatePolynomial at x=0 returns coefficient[0] (secret)', () => {
    const coeffs = [7n, 3n, 5n];
    const result = evaluatePolynomial(coeffs, 0n);
    expect(result).toBe(7n);
  });

  it('evaluatePolynomial is consistent with generatePolynomial', () => {
    const secret = 999n;
    const threshold = 4;
    const coeffs = generatePolynomial(secret, threshold);

    expect(evaluatePolynomial(coeffs, 0n)).toBe(mod(secret));

    let sum = 0n;
    for (const c of coeffs) sum = addMod(sum, c);
    expect(evaluatePolynomial(coeffs, 1n)).toBe(sum);
  });
});

describe('Share generation and reconstruction', () => {
  it('generateShares returns exactly n shares', () => {
    const shares = generateShares(42n, 5, 3);
    expect(shares).toHaveLength(5);
  });

  it('each share has x from 1 to n', () => {
    const n = 5;
    const shares = generateShares(42n, n, 3);
    for (let i = 1; i <= n; i++) {
      expect(shares[i - 1].x).toBe(BigInt(i));
    }
  });

  it('reconstructAtZero on all shares returns original secret (n = threshold)', () => {
    const secret = 123456789n;
    const shares = generateShares(secret, 3, 3);
    const reconstructed = reconstructAtZero(shares);
    expect(reconstructed).toBe(secret);
  });

  it('reconstructAtZero on all shares returns original secret (n > threshold)', () => {
    const secret = 987654321n;
    const shares = generateShares(secret, 5, 3);
    const reconstructed = reconstructAtZero(shares);
    expect(reconstructed).toBe(secret);
  });

  it('reconstructAtZero with threshold-1 shares returns wrong result', () => {
    const secret = 12345n;
    const threshold = 3;
    const shares = generateShares(secret, threshold, threshold);
    const partial = shares.slice(0, threshold - 1);
    const result = reconstructAtZero(partial);
    expect(result).not.toBe(secret);
  });

  it('reconstructAtZero with minimal qualifying shares works', () => {
    const secret = 777n;
    const shares = generateShares(secret, 3, 3);
    const minimal = shares.slice(0, 3);
    const reconstructed = reconstructAtZero(minimal);
    expect(reconstructed).toBe(secret);
  });
});

describe('Reference test case', () => {
  it('4 companies aggregate to 22500 and average is 5625', () => {
    const n = 4;
    const threshold = 3;

    const salaries = [5000n, 6000n, 4500n, 7000n];
    const expectedSum = 22500n;
    const expectedAvg = 5625n;

    const allShares: Share[][] = salaries.map((s) => generateShares(s, n, threshold));

    let aggregated: Share[] = allShares[0];
    for (let i = 1; i < allShares.length; i++) {
      aggregated = addShares(aggregated, allShares[i]);
    }

    const reconstructedSum = reconstructAtZero(aggregated);
    expect(reconstructedSum).toBe(expectedSum);
    expect(reconstructedSum / 4n).toBe(expectedAvg);
  });
});

describe('Random protocol simulation', () => {
  it('100 rounds with random salaries < MAX_SALARY reconstruct correctly', () => {
    const n = 4;
    const threshold = 3;

    for (let round = 0; round < 100; round++) {
      const salaries: bigint[] = [];
      for (let p = 0; p < n; p++) {
        const s = mod(randomBigInt() % MAX_SALARY);
        salaries.push(s);
      }

      const expectedSum = mod(salaries.reduce((a, b) => a + b, 0n));

      const allShares: Share[][] = salaries.map((s) => generateShares(s, n, threshold));

      let aggregated: Share[] = allShares[0];
      for (let i = 1; i < allShares.length; i++) {
        aggregated = addShares(aggregated, allShares[i]);
      }

      const reconstructed = reconstructAtZero(aggregated);
      expect(reconstructed).toBe(expectedSum);
    }
  });
});

describe('Edge cases', () => {
  it('reconstructAtZero with duplicate x coordinates throws', () => {
    const shares: Share[] = [
      { x: 1n, y: 100n },
      { x: 1n, y: 200n },
      { x: 2n, y: 300n },
    ];
    expect(() => reconstructAtZero(shares)).toThrow();
  });

  it('reconstructAtZero with fewer than 2 points throws', () => {
    expect(() => reconstructAtZero([{ x: 1n, y: 5n }])).toThrow();
  });

  it('reconstructAtZero with empty array throws', () => {
    expect(() => reconstructAtZero([])).toThrow();
  });

  it('addShares with mismatched x coordinates throws', () => {
    const shares1: Share[] = [
      { x: 1n, y: 10n },
      { x: 2n, y: 20n },
    ];
    const shares2: Share[] = [
      { x: 1n, y: 30n },
      { x: 3n, y: 40n },
    ];
    expect(() => addShares(shares1, shares2)).toThrow();
  });

  it('addShares with different lengths throws', () => {
    const shares1: Share[] = [{ x: 1n, y: 10n }];
    const shares2: Share[] = [
      { x: 1n, y: 20n },
      { x: 2n, y: 30n },
    ];
    expect(() => addShares(shares1, shares2)).toThrow();
  });

  it('generateShares throws when n < threshold', () => {
    expect(() => generateShares(42n, 2, 5)).toThrow();
  });

  it('addMod with large values wraps correctly', () => {
    const a = P - 500n;
    const b = 1000n;
    expect(addMod(a, b)).toBe(500n);
  });

  it('subMod with negative result wraps correctly', () => {
    expect(subMod(10n, 20n)).toBe(P - 10n);
  });

  it('multiplyMod with zero returns zero', () => {
    expect(multiplyMod(0n, 12345n)).toBe(0n);
  });

  it('powerMod with exponent 0 returns 1', () => {
    expect(powerMod(100n, 0n)).toBe(1n);
  });

  it('powerMod with base 0 returns 0', () => {
    expect(powerMod(0n, 10n)).toBe(0n);
  });
});
