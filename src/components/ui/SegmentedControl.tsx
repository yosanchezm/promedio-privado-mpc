import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  title?: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center rounded-xl border border-mpc-border bg-mpc-border-light/70 p-1',
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={selected}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex items-center justify-center rounded-lg font-medium transition-colors',
              size === 'sm' ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-sm',
              selected ? 'text-white' : 'text-mpc-text-secondary hover:text-mpc-text',
            )}
          >
            {selected ? (
              <motion.span
                layoutId={`segmented-${ariaLabel}`}
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-mpc-primary to-mpc-secondary shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            ) : null}
            <span className="relative z-10 flex items-center gap-1.5">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
