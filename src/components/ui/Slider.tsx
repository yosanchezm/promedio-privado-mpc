import { useId } from 'react';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Renders the current value (or a custom formatter of it) next to the label. */
  formatValue?: (value: number) => string;
  hint?: string;
  onChange: (value: number) => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue,
  hint,
  onChange,
  ariaLabel,
  disabled = false,
}: SliderProps) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-mpc-text">
          {label}
        </label>
        <output
          htmlFor={id}
          className="rounded-lg bg-mpc-border-light px-2 py-0.5 font-mono text-sm font-semibold text-mpc-primary"
        >
          {formatValue ? formatValue(value) : value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="mpc-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={ariaLabel ?? label}
        aria-valuetext={formatValue ? formatValue(value) : String(value)}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ '--fill': `${fill}%` } as React.CSSProperties}
      />
      {hint ? <p className="mt-1.5 text-xs text-mpc-text-secondary">{hint}</p> : null}
    </div>
  );
}
