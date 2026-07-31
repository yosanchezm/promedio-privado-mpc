import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface StepItem {
  id: string;
  label: string;
  icon: ReactNode;
  state: 'pending' | 'active' | 'complete';
}

export interface StepperProps {
  steps: StepItem[];
  className?: string;
}

/**
 * Animated horizontal stepper. The active step carries aria-current="step"
 * and a sliding indicator (layoutId) so navigation feels continuous.
 */
export function Stepper({ steps, className }: StepperProps) {
  return (
    <ol
      className={cn('flex w-full items-stretch gap-1.5 sm:gap-2', className)}
      aria-label="Fases del protocolo"
    >
      {steps.map((step) => (
        <li
          key={step.id}
          aria-current={step.state === 'active' ? 'step' : undefined}
          className={cn(
            'relative flex min-w-0 flex-1 flex-col items-center gap-2 rounded-xl border px-2 py-2.5 text-center transition-colors duration-300',
            step.state === 'active' && 'border-mpc-primary/40 bg-indigo-50/80 shadow-sm',
            step.state === 'complete' && 'border-mpc-success/30 bg-emerald-50/60',
            step.state === 'pending' && 'border-mpc-border bg-white',
          )}
        >
          <span
            className={cn(
              'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300',
              step.state === 'active' && 'bg-gradient-to-br from-mpc-primary to-mpc-secondary text-white shadow-md shadow-indigo-500/30',
              step.state === 'complete' && 'bg-mpc-success text-white',
              step.state === 'pending' && 'bg-mpc-border-light text-mpc-text-tertiary',
            )}
          >
            {step.icon}
          </span>
          <span
            className={cn(
              'w-full truncate text-xs font-medium sm:text-sm',
              step.state === 'active' && 'text-mpc-primary',
              step.state === 'complete' && 'text-mpc-success',
              step.state === 'pending' && 'text-mpc-text-secondary',
            )}
          >
            {step.label}
          </span>
          {step.state === 'active' ? (
            <motion.span
              layoutId="stepper-active-bar"
              className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-mpc-primary to-mpc-accent"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/** Renders a stepper that reacts to the active phase name. */
export function PhaseStepper({
  phases,
  activeId,
  className,
}: {
  phases: { id: string; label: string; icon: ReactNode }[];
  activeId: string;
  className?: string;
}) {
  const items: StepItem[] = phases.map((phase) => {
    const phaseIndex = phases.findIndex((p) => p.id === phase.id);
    const activeIndex = phases.findIndex((p) => p.id === activeId);
    return {
      id: phase.id,
      label: phase.label,
      icon: phase.icon,
      state: phaseIndex < activeIndex ? 'complete' : phaseIndex === activeIndex ? 'active' : 'pending',
    };
  });

  return <Stepper steps={items} className={className} />;
}
