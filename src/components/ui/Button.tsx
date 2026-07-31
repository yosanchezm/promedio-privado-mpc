import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { ReactNode, ComponentPropsWithoutRef, Ref } from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<
    ComponentPropsWithoutRef<'button'>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'
  > {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  /** When set, renders a react-router Link instead of a button. */
  to?: string;
  replace?: boolean;
  state?: unknown;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-mpc-primary to-mpc-secondary text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-110',
  secondary:
    'bg-white text-mpc-text border border-mpc-border shadow-sm hover:border-mpc-primary/40 hover:bg-mpc-border-light',
  ghost: 'bg-transparent text-mpc-text-secondary hover:bg-mpc-border-light hover:text-mpc-text',
  danger: 'bg-mpc-error-light text-mpc-error hover:bg-red-100',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, iconRight, className, children, disabled, to, replace, state, ...props },
  ref,
) {
  const content = (
    <>
      {icon ? <span className="shrink-0 [&>svg]:h-[1.15em] [&>svg]:w-[1.15em]" aria-hidden="true">{icon}</span> : null}
      {children}
      {iconRight ? <span className="shrink-0 [&>svg]:h-[1.15em] [&>svg]:w-[1.15em]" aria-hidden="true">{iconRight}</span> : null}
    </>
  );

  const classes = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mpc-primary',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className,
  );

  if (to !== undefined) {
    return (
      <Link
        to={to}
        replace={replace}
        state={state}
        ref={ref as Ref<HTMLAnchorElement>}
        className={classes}
        aria-disabled={disabled || undefined}
        {...(props as Record<string, unknown>)}
      >
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      ref={ref}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {content}
    </motion.button>
  );
});
