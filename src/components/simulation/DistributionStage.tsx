import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Building2, Lock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import type { SimData, ViewMode } from '@/lib/simulation/types';
import { nodePalette } from '@/lib/simulation/theme';
import { formatSalary, shortBigInt } from '@/lib/simulation/format';
import { cn } from '@/lib/utils/cn';

interface Position {
  x: number;
  y: number;
}

interface Particle {
  id: string;
  from: Position;
  to: Position;
  color: string;
  delay: number;
}

const genStepIndex = (company: number) => (company - 1) * 2;
const sendStepIndex = (company: number) => (company - 1) * 2 + 1;

export interface DistributionStageProps {
  data: SimData;
  currentStepIndex: number;
  viewMode: ViewMode;
}

export function DistributionStage({ data, currentStepIndex, viewMode }: DistributionStageProps) {
  const { companies, config } = data;
  const n = config.n;
  const [positions, setPositions] = useState<Map<number, Position>>(new Map());
  const [particles, setParticles] = useState<Particle[]>([]);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const readPositions = (): Map<number, Position> => {
      const next = new Map<number, Position>();
      const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-company-card]'));
      for (const node of nodes) {
        const index = Number(node.dataset.companyCard);
        const rect = node.getBoundingClientRect();
        next.set(index, {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
      return next;
    };

    setPositions(readPositions());

    const onResize = () => setPositions(readPositions());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [n]);

  const spawnedFor = useRef<number | null>(null);

  useEffect(() => {
    const active = companies.find(
      (company) => currentStepIndex === sendStepIndex(company.index),
    );
    const target = active ? active.index : null;

    if (target === null) {
      spawnedFor.current = null;
      return;
    }

    if (spawnedFor.current === target || reducedMotion) return;
    const from = positions.get(target);
    if (!from) return;
    spawnedFor.current = target;

    const palette = nodePalette(target);
    const newParticles: Particle[] = [];
    companies.forEach((receiver) => {
      if (receiver.index === target) return;
      const to = positions.get(receiver.index);
      if (!to) return;
      newParticles.push({
        id: `${target}-${receiver.index}-${Date.now()}`,
        from,
        to,
        color: palette.hex,
        delay: 0.1 + receiver.index * 0.06,
      });
    });
    setParticles(newParticles);
  }, [currentStepIndex, companies, positions, reducedMotion]);

  const removeParticle = (id: string) => {
    setParticles((current) => current.filter((particle) => particle.id !== id));
  };

  return (
    <section className="relative">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-mpc-text">Fase 1 · Compartir secretos</h2>
          <p className="mt-1 max-w-2xl text-sm text-mpc-text-secondary">
            Cada empresa conserva una parte y envía otras a las demás. Ningún fragmento
            revela el salario original.
          </p>
        </div>
        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-mpc-primary">
          {n} empresas · polinomio de grado {config.t - 1}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {companies.map((company) => {
          const palette = nodePalette(company.index);
          const generated = currentStepIndex >= genStepIndex(company.index);
          const sent = currentStepIndex > sendStepIndex(company.index);
          const generating = currentStepIndex === genStepIndex(company.index);
          const sending = currentStepIndex === sendStepIndex(company.index);
          const pending = !generated && !sending;

          return (
            <div
              key={company.index}
              data-company-card={company.index}
              className={cn(
                'relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300',
                sending && 'ring-2 ring-offset-2',
                palette.border,
                palette.ring,
                sent && 'opacity-90',
                !generated && 'opacity-75',
              )}
            >
              <div className="flex items-center gap-2.5 pr-24">
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                    palette.solid,
                  )}
                  aria-hidden="true"
                >
                  {company.index}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-mpc-text" title={company.name}>
                    {company.name}
                  </p>
                  <p className="flex min-w-0 items-center gap-1 text-xs text-mpc-text-tertiary">
                    {generated ? (
                      <>
                        <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span
                          className="truncate"
                          title={`Salario: ${formatSalary(Number(company.secret))}`}
                        >
                          Salario: {formatSalary(Number(company.secret))}
                        </span>
                      </>
                    ) : (
                      'Salario oculto'
                    )}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  'absolute right-4 top-4 flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.65rem] font-semibold',
                  sending && 'bg-indigo-50 text-mpc-primary',
                  sent && 'bg-emerald-50 text-mpc-success',
                  generating && 'bg-violet-50 text-mpc-secondary',
                  pending && 'bg-slate-100 text-mpc-text-tertiary',
                )}
              >
                  {sending ? (<><Send className="h-3 w-3" /> Enviando</>) : null}
                  {generating ? (<><Loader2 className="h-3 w-3 animate-spin" /> Generando</>) : null}
                  {sent ? (<><CheckCircle2 className="h-3 w-3" /> Listo</>) : null}
                  {pending ? 'Esperando' : null}
                </span>

                {viewMode === 'technical' ? (
                <div className="rounded-xl bg-slate-50 px-3 py-2 font-mono text-[0.65rem] leading-relaxed text-mpc-text-secondary">
                  <p className="mb-0.5 font-sans text-[0.6rem] font-semibold uppercase tracking-wide text-mpc-text-tertiary">
                    Polinomio
                  </p>
                  <p className="break-all">f(x) = {company.coefficients.join(', ')}…</p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-1.5">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[0.65rem]',
                    palette.bg,
                    palette.text,
                  )}
                  title={`Share propio (${company.ownShare.x}, ${company.ownShare.y})`}
                >
                  <Building2 className="h-3 w-3" aria-hidden="true" />
                  propio ({company.ownShare.x}, {shortBigInt(company.ownShare.y)})
                </span>

                {company.receivedShares.map((received) => (
                  <motion.span
                    key={received.from}
                    initial={sent ? { opacity: 0, scale: 0.5 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[0.65rem]',
                      sent ? 'bg-white ring-1 ring-inset' : 'hidden',
                      'ring-mpc-border',
                    )}
                    title={`De ${companies[received.from - 1].name}: (${received.share.x}, ${received.share.y})`}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', nodePalette(received.from).solid)} aria-hidden="true" />
                    de E{received.from} → {shortBigInt(received.share.y)}
                  </motion.span>
                ))}
              </div>

              {sending ? (
                <p className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[0.7rem] leading-snug text-mpc-primary">
                  Enviando {n - 1} shares a las demás empresas…
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {createPortal(
        <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: 0,
                  top: 0,
                  width: 14,
                  height: 14,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 14px ${particle.color}`,
                }}
                initial={{ x: particle.from.x - 7, y: particle.from.y - 7, scale: 0.4, opacity: 0 }}
                animate={{ x: particle.to.x - 7, y: particle.to.y - 7, scale: 1, opacity: [0, 1, 1, 0.9] }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 1.1, delay: particle.delay, ease: 'easeInOut' }}
                onAnimationComplete={() => removeParticle(particle.id)}
              />
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </section>
  );
}
