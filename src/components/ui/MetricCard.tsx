import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: 'primary' | 'secondary' | 'accent' | 'success';
  className?: string;
}

const ACCENT_STYLES: Record<NonNullable<MetricCardProps['accent']>, string> = {
  primary: 'bg-indigo-50 text-mpc-primary',
  secondary: 'bg-violet-50 text-mpc-secondary',
  accent: 'bg-cyan-50 text-mpc-accent',
  success: 'bg-emerald-50 text-mpc-success',
};

export function MetricCard({ icon, label, value, sub, accent = 'primary', className }: MetricCardProps) {
  return (
    <Card padded={false} className={cn('p-5', className)}>
      <div className="flex items-start gap-4">
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl [&>svg]:h-5.5 [&>svg]:w-5.5',
            ACCENT_STYLES[accent],
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-mpc-text-tertiary">
            {label}
          </p>
          <p className="mt-0.5 font-mono text-2xl font-bold text-mpc-text">{value}</p>
          {sub ? <p className="mt-0.5 text-xs text-mpc-text-secondary">{sub}</p> : null}
        </div>
      </div>
    </Card>
  );
}
