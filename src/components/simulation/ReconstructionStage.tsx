import { motion } from 'motion/react';
import { GitMerge, Inbox, Sigma, TrendingDown } from 'lucide-react';
import type { SimData, ViewMode } from '@/lib/simulation/types';
import { formatSalaryBigInt, shortBigInt } from '@/lib/simulation/format';
import { cn } from '@/lib/utils/cn';

const collectStepIndex = (n: number) => 3 * n;
const lagrangeStepIndex = (n: number) => 3 * n + 1;
const totalStepIndex = (n: number) => 3 * n + 2;

export interface ReconstructionStageProps {
  data: SimData;
  currentStepIndex: number;
  viewMode: ViewMode;
}

export function ReconstructionStage({ data, currentStepIndex, viewMode }: ReconstructionStageProps) {
  const { reconstructionPoints: points, basis, config } = data;
  const n = config.n;
  const t = config.t;

  const collecting = currentStepIndex >= collectStepIndex(n);
  const interpolating = currentStepIndex >= lagrangeStepIndex(n);
  const totalShown = currentStepIndex >= totalStepIndex(n);

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-mpc-text">Fase 3 · Reconstrucción</h2>
        <p className="mt-1 max-w-2xl text-sm text-mpc-text-secondary">
          El reconstructor reúne {t} sumas locales, interpola el polinomio suma con Lagrange
          y evalúa en x = 0 para obtener el total.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl border border-mpc-border bg-white p-5 shadow-sm">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-mpc-text">
            <Inbox className="h-4 w-4 text-mpc-primary" aria-hidden="true" />
            Sumas locales recolectadas ({collecting ? t : 0}/{t})
          </p>
          <ul className="space-y-2">
            {points.map((point, index) => {
              const visible = collecting && currentStepIndex >= collectStepIndex(n);
              return (
                <motion.li
                  key={point.x}
                  initial={visible ? { opacity: 0, x: -16 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.12, duration: 0.35 }}
                  className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2"
                >
                  <code className="font-mono text-xs text-mpc-text">
                    ({point.x}, {shortBigInt(point.y)})
                  </code>
                  {interpolating && viewMode === 'technical' ? (
                    <code className="font-mono text-[0.65rem] text-mpc-secondary">
                      ℓ({point.x})(0) = {shortBigInt(BigInt(basis[index]), 10)}
                    </code>
                  ) : null}
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <motion.div
            animate={
              collecting && !totalShown
                ? { scale: [1, 1.06, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 1.6, repeat: totalShown ? 0 : Infinity, ease: 'easeInOut' }}
            className={cn(
              'flex h-24 w-24 items-center justify-center rounded-full shadow-lg',
              totalShown
                ? 'bg-gradient-to-br from-mpc-success to-emerald-500 shadow-emerald-500/30'
                : 'bg-gradient-to-br from-mpc-primary to-mpc-secondary shadow-indigo-500/30',
            )}
          >
            <GitMerge className="h-10 w-10 text-white" aria-hidden="true" />
          </motion.div>
          <p className="text-xs font-semibold text-mpc-text-secondary">Reconstructor</p>
          <p className="text-center text-[0.65rem] leading-snug text-mpc-text-tertiary">
            Conoce {t} de {n} sumas locales
          </p>
        </div>

        <div className="rounded-2xl border border-mpc-border bg-white p-5 shadow-sm">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-mpc-text">
            <Sigma className="h-4 w-4 text-mpc-primary" aria-hidden="true" />
            Interpolación en x = 0
          </p>

          {viewMode === 'technical' && interpolating ? (
            <div className="mb-3 rounded-xl bg-violet-50 px-3 py-2.5 font-mono text-[0.65rem] leading-relaxed text-mpc-secondary">
              <p>ℓᵢ(0) = ∏ⱼ₌ᵢ (0 − xⱼ) / (xᵢ − xⱼ)  mod P</p>
              <p className="mt-1">
                S = Σ yᵢ·ℓᵢ(0) mod P = {shortBigInt(data.totalReconstructed, 16)}
              </p>
            </div>
          ) : null}

          <div
            className={cn(
              'rounded-xl px-4 py-3 transition-all duration-500',
              totalShown
                ? 'bg-emerald-50 ring-1 ring-emerald-200'
                : 'bg-slate-50 opacity-60',
            )}
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-mpc-text-tertiary">
              Suma total S = Σ salarios
            </p>
            <p
              className={cn(
                'mt-1 font-mono text-xl font-bold',
                totalShown ? 'text-mpc-success' : 'text-mpc-text-tertiary',
              )}
            >
              {totalShown ? formatSalaryBigInt(data.totalReconstructed) : '···'}
            </p>
            {totalShown ? (
              <p className="mt-1 flex items-center gap-1 text-xs text-mpc-text-secondary">
                <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                Fase 4 · dividir entre {n} para obtener el promedio
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
