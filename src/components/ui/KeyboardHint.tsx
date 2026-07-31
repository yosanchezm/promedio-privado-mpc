import { cn } from '@/lib/utils/cn';

export interface KeyboardHintProps {
  keys: string[];
  description: string;
  className?: string;
}

/** Renders "SPACE · Iniciar/Pausar" style hints with <kbd> chips. */
export function KeyboardHint({ keys, description, className }: KeyboardHintProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-mpc-text-tertiary', className)}>
      {keys.map((key, index) => (
        <span key={key} className="flex items-center gap-1.5">
          {index > 0 ? <span aria-hidden="true">·</span> : null}
          <kbd>{key}</kbd>
        </span>
      ))}
      <span className="sr-only">{description}</span>
      <span aria-hidden="true" className="ml-1">
        {description}
      </span>
    </span>
  );
}
