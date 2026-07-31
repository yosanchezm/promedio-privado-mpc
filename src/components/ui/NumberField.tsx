import { useId } from 'react';
import { cn } from '@/lib/utils/cn';

export interface NumberFieldProps {
  label: string;
  value: string;
  min?: number;
  max?: number;
  prefix?: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export function NumberField({
  label,
  value,
  min,
  max,
  prefix,
  placeholder,
  error,
  onChange,
  disabled = false,
  ariaLabel,
}: NumberFieldProps) {
  const id = useId();
  const errorId = useId();

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-mpc-text">
        {label}
      </label>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-mpc-text-tertiary">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          placeholder={placeholder}
          aria-label={ariaLabel ?? label}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            'w-full rounded-xl border bg-white px-3 py-2 text-sm text-mpc-text shadow-sm transition-colors',
            prefix ? 'pl-8' : 'pl-3',
            'placeholder:text-mpc-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-mpc-primary/40',
            error ? 'border-mpc-error' : 'border-mpc-border',
          )}
        />
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-mpc-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
