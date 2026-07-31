import { describe, it, expect } from 'vitest';
import {
  participantsSchema,
  thresholdSchema,
  salarySchema,
  salariesArraySchema,
  validateSimConfig,
} from '@/lib/validation/simulation';

describe('participantsSchema', () => {
  it('accepts integers between 3 and 15', () => {
    expect(participantsSchema.safeParse(3).success).toBe(true);
    expect(participantsSchema.safeParse(10).success).toBe(true);
    expect(participantsSchema.safeParse(15).success).toBe(true);
  });

  it('rejects values outside [3, 15]', () => {
    expect(participantsSchema.safeParse(2).success).toBe(false);
    expect(participantsSchema.safeParse(16).success).toBe(false);
  });

  it('rejects non-integers', () => {
    expect(participantsSchema.safeParse(4.5).success).toBe(false);
    expect(participantsSchema.safeParse(NaN).success).toBe(false);
  });
});

describe('thresholdSchema', () => {
  it('accepts thresholds from 1 to n', () => {
    const schema = thresholdSchema(5);
    expect(schema.safeParse(1).success).toBe(true);
    expect(schema.safeParse(5).success).toBe(true);
  });

  it('rejects thresholds outside the range', () => {
    const schema = thresholdSchema(5);
    expect(schema.safeParse(0).success).toBe(false);
    expect(schema.safeParse(6).success).toBe(false);
  });

  it('exposes the participant count in the error message', () => {
    const schema = thresholdSchema(5);
    const result = schema.safeParse(6);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('5');
    }
  });
});

describe('salarySchema', () => {
  it('accepts positive integers up to 9,999,999', () => {
    expect(salarySchema.safeParse(1).success).toBe(true);
    expect(salarySchema.safeParse(9_999_999).success).toBe(true);
  });

  it('rejects non-positive and oversized salaries', () => {
    expect(salarySchema.safeParse(0).success).toBe(false);
    expect(salarySchema.safeParse(-100).success).toBe(false);
    expect(salarySchema.safeParse(10_000_000).success).toBe(false);
  });
});

describe('salariesArraySchema', () => {
  it('requires the exact expected length', () => {
    const schema = salariesArraySchema(4);
    expect(schema.safeParse([1, 2, 3, 4]).success).toBe(true);
    expect(schema.safeParse([1, 2, 3]).success).toBe(false);
    expect(schema.safeParse([1, 2, 3, 4, 5]).success).toBe(false);
  });
});

describe('validateSimConfig', () => {
  it('accepts a valid configuration', () => {
    const result = validateSimConfig(4, 3, [5000, 6000, 4500, 7000]);
    expect(result.success).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('reports the participant error for n out of range', () => {
    const result = validateSimConfig(2, 2, [5000, 6000]);
    expect(result.success).toBe(false);
    expect(result.errors.n).toBeDefined();
  });

  it('reports the threshold error when t exceeds n', () => {
    const result = validateSimConfig(4, 5, [5000, 6000, 4500, 7000]);
    expect(result.success).toBe(false);
    expect(result.errors.t).toBeDefined();
  });

  it('reports salary errors indexed by company', () => {
    const result = validateSimConfig(4, 3, [5000, 0, -1, 7000]);
    expect(result.success).toBe(false);
    expect(result.errors.salaries).toBeDefined();
    expect(result.errors.salaries?.[1]).toBeDefined();
    expect(result.errors.salaries?.[2]).toBeDefined();
    expect(result.errors.salaries?.[0]).toBeUndefined();
  });

  it('translates invalid-type salaries into the generic message', () => {
    const result = validateSimConfig(4, 3, [5000, NaN, 4500, 7000]);
    expect(result.success).toBe(false);
    expect(result.errors.salaries?.[1]).toBe('Debe ser un número válido');
  });

  it('keeps the salaries array empty when the length itself is wrong', () => {
    const result = validateSimConfig(4, 3, [5000, 6000]);
    expect(result.success).toBe(false);
    expect(result.errors.salaries).toEqual([]);
  });
});
