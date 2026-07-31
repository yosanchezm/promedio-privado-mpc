import { z } from 'zod';

/** Number of participants: integer in [3, 15]. */
export const participantsSchema = z
  .number({ error: 'Debe ser un número' })
  .int('Debe ser un número entero')
  .min(3, 'Se necesitan al menos 3 empresas')
  .max(15, 'Máximo 15 empresas');

/** Threshold: integer in [1, n]. Built per n to validate against it. */
export function thresholdSchema(n: number): z.ZodNumber {
  return z
    .number({ error: 'Debe ser un número' })
    .int('Debe ser un número entero')
    .min(1, 'El umbral debe ser al menos 1')
    .max(n, `El umbral no puede superar el número de empresas (${n})`);
}

/** Individual salary: positive integer, max 9,999,999. */
export const salarySchema = z
  .number({ error: 'Debe ser un número' })
  .int('Debe ser un número entero')
  .min(1, 'El salario debe ser positivo')
  .max(9_999_999, 'El salario no puede superar 9.999.999');

/** Exact-length array of salaries matching the participant count. */
export function salariesArraySchema(n: number): z.ZodArray<z.ZodNumber> {
  return z.array(salarySchema).length(n, `Se esperan exactamente ${n} salarios`);
}

export interface SimConfigErrors {
  n?: string;
  t?: string;
  /** One entry per company index (0-based), present only when invalid. */
  salaries?: (string | undefined)[];
}

const INVALID_TYPE_MESSAGE = 'Debe ser un número válido';

/**
 * Validates a full simulation config and returns Spanish error messages.
 * Returns { success: true } when the config is valid.
 */
export function validateSimConfig(
  n: number,
  t: number,
  salaries: number[],
): { success: boolean; errors: SimConfigErrors } {
  const schema = z.object({
    n: participantsSchema,
    t: thresholdSchema(n),
    salaries: salariesArraySchema(n),
  });

  const result = schema.safeParse({ n, t, salaries });
  if (result.success) {
    return { success: true, errors: {} };
  }

  const errors: SimConfigErrors = { salaries: [] };

  for (const issue of result.error.issues) {
    const [field, index] = issue.path as [string, number | undefined];

    if (field === 'salaries') {
      if (index === undefined) continue;
      if (!errors.salaries) errors.salaries = [];
      if (errors.salaries[index] === undefined) {
        errors.salaries[index] =
          issue.code === 'invalid_type' ? INVALID_TYPE_MESSAGE : issue.message;
      }
      continue;
    }

    if (field === 'n' && errors.n === undefined) {
      errors.n = issue.code === 'invalid_type' ? INVALID_TYPE_MESSAGE : issue.message;
    }
    if (field === 't' && errors.t === undefined) {
      errors.t = issue.code === 'invalid_type' ? INVALID_TYPE_MESSAGE : issue.message;
    }
  }

  return { success: false, errors };
}
