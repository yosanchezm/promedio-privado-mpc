import { describe, it, expect } from 'vitest';
import { P, reconstructAtZero } from '@/lib/mpc';
import { runProtocol, lagrangeBasisAtZero } from '@/lib/simulation/protocol';
import type { Share } from '@/lib/mpc';

const DEFAULT_SALARIES = [5000, 6000, 4500, 7000];

describe('runProtocol — configuration validation', () => {
  it('rejects n < 2', () => {
    expect(() => runProtocol(1, 1, [5000])).toThrow(/n must be an integer >= 2/);
  });

  it('rejects non-integer n', () => {
    expect(() => runProtocol(2.5, 2, [5000, 6000])).toThrow(/n must be an integer/);
  });

  it('rejects t < 1', () => {
    expect(() => runProtocol(3, 0, [5000, 6000, 4500])).toThrow(/1 <= t <= n/);
  });

  it('rejects t > n', () => {
    expect(() => runProtocol(3, 4, [5000, 6000, 4500])).toThrow(/1 <= t <= n/);
  });

  it('rejects a salary list of the wrong length', () => {
    expect(() => runProtocol(3, 2, [5000, 6000])).toThrow(/exactly 3 values/);
  });

  it('rejects non-positive salaries', () => {
    expect(() => runProtocol(3, 2, [5000, 0, 4500])).toThrow(/positive integer/);
  });

  it('rejects fractional salaries', () => {
    expect(() => runProtocol(3, 2, [5000, 6000.5, 4500])).toThrow(/positive integer/);
  });

  it('rejects a total sum that exceeds the field prime', () => {
    const huge = [1_000_000_000_000_000_000, 1_000_000_000_000_000_000, 1_000_000_000_000_000_000];
    expect(() => runProtocol(3, 2, huge)).toThrow(/exceeds the field prime/);
  });
});

describe('runProtocol — default configuration', () => {
  const data = runProtocol(4, 3, DEFAULT_SALARIES);
  const plainSum = 5000n + 6000n + 4500n + 7000n;

  it('uses the Mersenne prime as field', () => {
    expect(data.prime).toBe(P);
  });

  it('reconstructs the exact total salary', () => {
    expect(data.totalReconstructed).toBe(plainSum);
  });

  it('computes the correct average', () => {
    expect(data.average).toBe(Number(plainSum) / 4);
    expect(data.averageIsExact).toBe(true);
  });

  it('verifies reconstruction end to end', () => {
    expect(data.reconstructionVerified).toBe(true);
  });

  it('creates one company state per participant with 1-based names', () => {
    expect(data.companies).toHaveLength(4);
    expect(data.companies.map((c) => c.name)).toEqual([
      'Empresa 1',
      'Empresa 2',
      'Empresa 3',
      'Empresa 4',
    ]);
  });

  it('hides every salary as the constant term of its own polynomial', () => {
    data.companies.forEach((company, index) => {
      expect(company.secret).toBe(BigInt(DEFAULT_SALARIES[index]));
      expect(BigInt(company.coefficients[0])).toBe(BigInt(DEFAULT_SALARIES[index]));
    });
  });

  it('keeps only n - 1 outgoing shares and n - 1 received shares per company', () => {
    data.companies.forEach((company) => {
      expect(company.outgoingShares).toHaveLength(3);
      expect(company.receivedShares).toHaveLength(3);
    });
  });

  it('distributes each company a share of every other company, never its own', () => {
    data.companies.forEach((company) => {
      const fromIndices = company.receivedShares.map((r) => r.from);
      expect(new Set(fromIndices).size).toBe(3);
      expect(fromIndices).not.toContain(company.index);
    });
  });

  it('computes each local sum as the mod-P addition of its own share and received shares', () => {
    data.companies.forEach((company) => {
      let sum = company.ownShare.y;
      for (const received of company.receivedShares) {
        sum = (sum + received.share.y) % P;
      }
      expect(company.localSum).toBe(sum);
    });
  });

  it('uses exactly the first t companies for reconstruction', () => {
    expect(data.reconstructionPoints).toHaveLength(3);
    expect(data.reconstructionPoints.map((p) => p.x)).toEqual([1n, 2n, 3n]);
  });

  it('has no reconstruction note for t > 1', () => {
    expect(data.reconstructionNote).toBeUndefined();
  });
});

describe('runProtocol — threshold variants', () => {
  const variants: Array<[number, number, number[]]> = [
    [3, 1, [1000, 2000, 3000]],
    [3, 2, [1000, 2000, 3000]],
    [3, 3, [1000, 2000, 3000]],
    [4, 2, [7000, 8000, 9000, 10000]],
    [5, 4, [1500, 2500, 3500, 4500, 5500]],
    [6, 5, [1200, 2400, 3600, 4800, 6000, 7200]],
    [15, 14, Array.from({ length: 15 }, (_, i) => (i + 1) * 1000)],
  ];

  variants.forEach(([n, t, salaries]) => {
    it(`reconstructs the total correctly for n=${n}, t=${t}`, () => {
      const data = runProtocol(n, t, salaries);
      const plainSum = salaries.reduce((acc, s) => acc + s, 0);
      expect(data.totalReconstructed).toBe(BigInt(plainSum));
      expect(data.reconstructionVerified).toBe(true);
      expect(data.average).toBe(plainSum / n);
      expect(data.averageIsExact).toBe(plainSum % n === 0);
      expect(data.reconstructionPoints).toHaveLength(t);
    });
  });

  it('marks an average as inexact when the total is not divisible by n', () => {
    const data = runProtocol(3, 2, [5000, 6000, 4500]);
    expect((5000 + 6000 + 4500) % 3).not.toBe(0);
    expect(data.averageIsExact).toBe(false);
    expect(data.average).toBeCloseTo((5000 + 6000 + 4500) / 3, 6);
  });

  it('explains the constant-polynomial case for t = 1', () => {
    const data = runProtocol(3, 1, [1000, 2000, 3000]);
    expect(data.totalReconstructed).toBe(6000n);
    expect(data.reconstructionNote).toMatch(/t = 1/);
  });

  it('computes the same reconstruction from any t-subset of local sums', () => {
    const n = 5;
    const t = 3;
    const salaries = [1000, 2000, 3000, 4000, 5000];
    const data = runProtocol(n, t, salaries);

    const subsets: number[][] = [
      [1, 2, 3],
      [1, 3, 5],
      [2, 4, 5],
      [3, 4, 5],
    ];

    subsets.forEach((xs) => {
      const points: Share[] = xs.map((x) => {
        const company = data.companies[x - 1];
        return { x: BigInt(x), y: company.localSum };
      });
      expect(reconstructAtZero(points)).toBe(data.totalReconstructed);
    });
  });
});

describe('lagrangeBasisAtZero', () => {
  it('returns the identity basis for a single point', () => {
    const points: Share[] = [{ x: 1n, y: 42n }];
    expect(lagrangeBasisAtZero(points)).toEqual([1n]);
  });

  it('satisfies sum(y_i * l_i(0)) === total', () => {
    const data = runProtocol(4, 3, DEFAULT_SALARIES);
    const weighted = data.reconstructionPoints.reduce(
      (acc, point, i) => acc + point.y * BigInt(data.basis[i]),
      0n,
    );
    expect(weighted % P).toBe(data.totalReconstructed);
  });

  it('reconstructs the same value as reconstructAtZero', () => {
    const data = runProtocol(5, 4, [1000, 2000, 3000, 4000, 5000]);
    expect(reconstructAtZero(data.reconstructionPoints)).toBe(data.totalReconstructed);
  });
});

describe('runProtocol — privacy properties', () => {
  it('a single local sum never reveals the total', () => {
    const n = 4;
    const t = 3;
    const salaries = [5000, 6000, 4500, 7000];
    const data = runProtocol(n, t, salaries);
    const plainSum = salaries.reduce((acc, s) => acc + BigInt(s), 0n);

    data.companies.forEach((company) => {
      expect(company.localSum).not.toBe(plainSum);
    });
  });

  it('no company ever receives another company raw salary as a share', () => {
    const data = runProtocol(4, 3, DEFAULT_SALARIES);
    const secrets = new Set(DEFAULT_SALARIES.map((s) => BigInt(s)));

    data.companies.forEach((company) => {
      company.receivedShares.forEach(({ share }) => {
        expect(secrets.has(share.y)).toBe(false);
      });
      expect(secrets.has(company.ownShare.y)).toBe(false);
    });
  });

  it('reconstructing with only t - 1 local sums yields the wrong total', () => {
    const n = 4;
    const t = 3;
    const salaries = [5000, 6000, 4500, 7000];
    const data = runProtocol(n, t, salaries);
    const plainSum = salaries.reduce((acc, s) => acc + BigInt(s), 0n);

    const partial = data.reconstructionPoints.slice(0, t - 1);
    expect(partial).toHaveLength(2);
    expect(reconstructAtZero(partial)).not.toBe(plainSum);
  });
});
