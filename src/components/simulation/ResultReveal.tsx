import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BadgeCheck, Flag, ShieldCheck, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { SimData } from '@/lib/simulation/types';
import { formatAverage, formatSalaryBigInt } from '@/lib/simulation/format';

function useCountUp(target: number, durationMs = 1200, enabled: boolean) {
  const [value, setValue] = useState(enabled ? 0 : target);
  const frame = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || reducedMotion) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [target, durationMs, enabled, reducedMotion]);

  return value;
}

export interface ResultRevealProps {
  data: SimData;
}

export function ResultReveal({ data }: ResultRevealProps) {
  const count = useCountUp(data.average, 1400, true);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-mpc-border bg-white shadow-sm">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="radial-glow left-[-8%] top-[-40%] h-64 w-64 bg-indigo-400" />
        <div className="radial-glow right-[-8%] bottom-[-40%] h-64 w-64 bg-cyan-400" />
      </div>

      <div className="relative px-6 py-10 sm:px-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="success" icon={<Flag className="h-3.5 w-3.5" />}>
            Resultado final
          </Badge>
          {data.reconstructionVerified ? (
            <Badge tone="success" icon={<BadgeCheck className="h-3.5 w-3.5" />}>
              Reconstrucción verificada
            </Badge>
          ) : null}
          {data.averageIsExact ? (
            <Badge tone="accent">División exacta</Badge>
          ) : (
            <Badge tone="warning">Promedio con decimales</Badge>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <p className="flex items-center gap-2 text-sm font-medium text-mpc-text-secondary">
            <Users className="h-4 w-4 text-mpc-primary" aria-hidden="true" />
            Promedio salarial privado entre {data.config.n} empresas
          </p>
          <motion.p
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-gradient text-6xl font-extrabold tracking-tight sm:text-7xl"
            aria-label={`Promedio: ${formatAverage(data.average)} pesos`}
          >
            ${formatAverage(Math.round(count * 100) / 100)}
          </motion.p>
          <p className="text-xs text-mpc-text-tertiary">
            {data.config.n} salarios · suma total {formatSalaryBigInt(data.totalReconstructed)} ÷ {data.config.n}
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-mpc-border bg-white/70 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mpc-text-tertiary">
              <ShieldCheck className="h-3.5 w-3.5 text-mpc-success" aria-hidden="true" />
              Privacidad preservada
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-mpc-text-secondary">
              Ninguna empresa reveló su salario. Cada una solo vio fragmentos propios y
              ajenos que, por separado, no revelan información.
            </p>
          </div>
          <div className="rounded-xl border border-mpc-border bg-white/70 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mpc-text-tertiary">
              <BadgeCheck className="h-3.5 w-3.5 text-mpc-primary" aria-hidden="true" />
              Corrección del protocolo
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-mpc-text-secondary">
              La interpolación con {data.config.t} puntos reconstruyó exactamente la suma de
              los {data.config.n} salarios.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
