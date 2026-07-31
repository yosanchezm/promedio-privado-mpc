import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeTone =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';

const TONE_STYLES: Record<BadgeTone, string> = {
  primary: 'bg-indigo-50 text-mpc-primary border-indigo-100',
  secondary: 'bg-violet-50 text-mpc-secondary border-violet-100',
  accent: 'bg-cyan-50 text-mpc-accent border-cyan-100',
  success: 'bg-mpc-success-light text-mpc-success border-emerald-100',
  warning: 'bg-mpc-warning-light text-amber-600 border-amber-100',
  danger: 'bg-mpc-error-light text-mpc-error border-red-100',
  neutral: 'bg-slate-100 text-mpc-text-secondary border-slate-200',
};

export interface BadgeProps {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = 'neutral', icon, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        TONE_STYLES[tone],
        className,
      )}
    >
      {icon ? <span className="[&>svg]:h-3.5 [&>svg]:w-3.5" aria-hidden="true">{icon}</span> : null}
      {children}
    </span>
  );
}
