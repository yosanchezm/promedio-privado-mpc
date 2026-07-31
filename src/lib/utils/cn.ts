/**
 * Tiny class-name joiner used across the UI kit. Skips falsy values.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
