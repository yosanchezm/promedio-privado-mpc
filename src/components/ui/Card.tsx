import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a hover lift + border accent. */
  interactive?: boolean;
  /** Removes the default padding. */
  padded?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { interactive = false, padded = true, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-mpc-border bg-white shadow-sm',
        'shadow-[0_1px_3px_rgb(15_23_42/0.05),0_8px_24px_-12px_rgb(79_70_229/0.12)]',
        padded && 'p-6',
        interactive &&
          'transition-all duration-200 hover:-translate-y-0.5 hover:border-mpc-primary/30 hover:shadow-[0_12px_32px_-12px_rgb(79_70_229/0.25)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
