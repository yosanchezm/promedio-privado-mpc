import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface AccordionItemProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, icon, children, defaultOpen = false }: AccordionItemProps) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-mpc-border bg-white shadow-sm transition-colors focus-within:border-mpc-primary/50">
      <h3>
        <button
          id={id}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center gap-3 px-5 py-4 text-left"
        >
          {icon ? (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-mpc-primary [&>svg]:h-5 [&>svg]:w-5">
              {icon}
            </span>
          ) : null}
          <span className="flex-1 text-sm font-semibold text-mpc-text sm:text-base">{title}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-mpc-text-tertiary"
            aria-hidden="true"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm leading-relaxed text-mpc-text-secondary">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export interface AccordionProps {
  items?: { title: string; icon?: ReactNode; content: ReactNode }[];
  className?: string;
  children?: ReactNode;
}

export function Accordion({ items, className, children }: AccordionProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items
        ? items.map((item) => (
            <AccordionItem key={item.title} title={item.title} icon={item.icon}>
              {item.content}
            </AccordionItem>
          ))
        : children}
    </div>
  );
}
