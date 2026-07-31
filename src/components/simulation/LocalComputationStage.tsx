import { motion } from 'motion/react';
import { Calculator, CheckCircle2, Sigma } from 'lucide-react';
import type { SimData, ViewMode } from '@/lib/simulation/types';
import { nodePalette } from '@/lib/simulation/theme';
import { shortBigInt } from '@/lib/simulation/format';
import { cn } from '@/lib/utils/cn';

const computeStepIndex = (company: number, n: number) => 2 * n + (company - 1);

export interface LocalComputationStageProps {
  data: SimData;
  currentStepIndex: number;
  viewMode: ViewMode;
}

export function LocalComputationStage({ data, currentStepIndex, viewMode }: LocalComputationStageProps) {
  const { companies, config } = data;
  const n = config.n;

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-mpc-text">Fase 2 · Cómputo local</h2>
        <p className="mt-1 max-w-2xl text-sm text-mpc-text-secondary">
          Cada empresa suma los {n} shares que tiene. Gracias al homomorfismo aditivo, el
          resultado F(j) es un share de la suma total… y no revela los salarios originales.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => {
          const palette = nodePalette(company.index);
          const isActive = currentStepIndex === computeStepIndex(company.index, n);
          const computed = currentStepIndex > computeStepIndex(company.index, n);

          return (
            <motion.div
              key={company.index}
              className={cn(
                'min-w-0 rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300',
                isActive ? 'ring-2 ring-offset-2' : '',
                isActive ? palette.ring : 'border-mpc-border',
                computed && 'opacity-90',
              )}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                      palette.solid,
                    )}
                    aria-hidden="true"
                  >
                    {company.index}
                  </span>
                  <p className="truncate text-sm font-semibold text-mpc-text" title={company.name}>
                    {company.name}
                  </p>
                </div>
                {computed ? (
                  <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-semibold text-mpc-success">
                    <CheckCircle2 className="h-3 w-3" /> Sumado
                  </span>
                ) : (
                  <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-semibold text-mpc-text-tertiary">
                    <Calculator className="h-3 w-3" /> Pendiente
                  </span>
                )}
              </div>

              <ul className="space-y-1.5">
                <li className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5">
                  <span className="text-xs text-mpc-text-secondary">Share propio</span>
                  <code className="font-mono text-xs text-mpc-text" title={`(${company.ownShare.x}, ${company.ownShare.y})`}>
                    ({company.ownShare.x}, {shortBigInt(company.ownShare.y)})
                  </code>
                </li>
                {company.receivedShares.map((received) => (
                  <li key={received.from} className="flex items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-1.5 ring-1 ring-inset ring-mpc-border-light">
                    <span className="flex items-center gap-1.5 text-xs text-mpc-text-secondary">
                      <span className={cn('h-1.5 w-1.5 rounded-full', nodePalette(received.from).solid)} aria-hidden="true" />
                      Desde {data.companies[received.from - 1].name}
                    </span>
                    <code className="font-mono text-xs text-mpc-text" title={`(${received.share.x}, ${received.share.y})`}>
                      {shortBigInt(received.share.y)}
                    </code>
                  </li>
                ))}
              </ul>

              <div className="mt-3 rounded-xl bg-gradient-to-r from-indigo-50 to-cyan-50 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-mpc-primary">
                  <Sigma className="h-3 w-3" aria-hidden="true" /> Suma local F({company.index})
                </p>
                <p className="mt-0.5 font-mono text-sm font-bold text-mpc-primary">
                  {shortBigInt(company.localSum, 14)}
                </p>
                {viewMode === 'technical' ? (
                  <p className="mt-1 break-all font-mono text-[0.6rem] leading-relaxed text-mpc-text-tertiary">
                    F({company.index}) = Σ fᵢ({company.index}) mod P
                  </p>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-sm text-cyan-900">
        <strong className="font-semibold">Nota de privacidad:</strong> cada suma local es
        una combinación de shares de todas las empresas. Por sí sola no contiene información
        sobre ningún salario individual.
      </p>
    </section>
  );
}
