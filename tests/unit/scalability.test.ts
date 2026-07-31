import { describe, it, expect } from 'vitest';
import {
  sharesTotal,
  distributionMessages,
  reconstructionMessages,
  totalMessages,
  defaultThreshold,
  growthClass,
  buildTable,
} from '@/lib/scalability/metrics';

describe('sharesTotal', () => {
  it('counts n shares per company', () => {
    expect(sharesTotal(3)).toBe(9);
    expect(sharesTotal(4)).toBe(16);
    expect(sharesTotal(10)).toBe(100);
  });
});

describe('distributionMessages', () => {
  it('counts one message per ordered pair of companies', () => {
    expect(distributionMessages(3)).toBe(6);
    expect(distributionMessages(4)).toBe(12);
    expect(distributionMessages(10)).toBe(90);
  });
});

describe('reconstructionMessages', () => {
  it('equals the threshold t', () => {
    expect(reconstructionMessages(1)).toBe(1);
    expect(reconstructionMessages(3)).toBe(3);
    expect(reconstructionMessages(9)).toBe(9);
  });
});

describe('totalMessages', () => {
  it('sums distribution and reconstruction', () => {
    expect(totalMessages(4, 3)).toBe(15);
    expect(totalMessages(4, 2)).toBe(14);
    expect(totalMessages(3, 1)).toBe(7);
  });

  it('grows quadratically with n', () => {
    expect(totalMessages(15, 14)).toBeGreaterThan(totalMessages(10, 9));
    expect(totalMessages(10, 9)).toBeGreaterThan(totalMessages(5, 4));
  });
});

describe('defaultThreshold', () => {
  it('defaults to n - 1', () => {
    expect(defaultThreshold(4)).toBe(3);
    expect(defaultThreshold(10)).toBe(9);
  });

  it('never drops below 1', () => {
    expect(defaultThreshold(1)).toBe(1);
    expect(defaultThreshold(2)).toBe(1);
  });
});

describe('growthClass', () => {
  it('classifies linear, quadratic and exponential costs', () => {
    expect(growthClass(3, 3)).toBe('lineal');
    expect(growthClass(12, 4)).toBe('cuadrático');
    expect(growthClass(16, 4)).toBe('cuadrático');
    expect(growthClass(1000, 4)).toBe('exponencial');
  });
});

describe('buildTable', () => {
  it('builds one row per n in range with default threshold', () => {
    const rows = buildTable(15);
    expect(rows).toHaveLength(13); // n = 3..15
    rows.forEach((row, i) => {
      expect(row.n).toBe(3 + i);
      expect(row.t).toBe(row.n - 1);
    });
  });

  it('computes row metrics from the formulas', () => {
    const rows = buildTable(15);
    rows.forEach((row) => {
      expect(row.shares).toBe(row.n * row.n);
      expect(row.dist).toBe(row.n * (row.n - 1));
      expect(row.recon).toBe(row.t);
      expect(row.total).toBe(row.n * (row.n - 1) + row.t);
    });
  });

  it('honours a custom minimum and threshold strategy', () => {
    const rows = buildTable(10, 4, (n) => Math.max(1, n - 2));
    expect(rows).toHaveLength(7); // n = 4..10
    rows.forEach((row, i) => {
      expect(row.n).toBe(4 + i);
      expect(row.t).toBe(row.n - 2);
    });
  });

  it('assigns a recognized observation to every row', () => {
    const observations = new Set(['Costo mínimo', 'Costo moderado', 'Crecimiento cuadrático']);
    buildTable(15).forEach((row) => {
      expect(observations.has(row.observation)).toBe(true);
    });
  });
});
