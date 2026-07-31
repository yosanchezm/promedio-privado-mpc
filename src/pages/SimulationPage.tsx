import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import {
  SetupPanel,
  ControlsBar,
  PhaseTimeline,
  DistributionStage,
  LocalComputationStage,
  ReconstructionStage,
  ResultReveal,
  KnowledgePanel,
  TechDetailTables,
} from '@/components/simulation';
import type { ViewMode } from '@/lib/simulation/types';

export function SimulationPage() {
  const simulation = useSimulation();
  const [viewMode, setViewMode] = useState<ViewMode>('simple');

  const { data, step, currentStep, status } = simulation;
  const hasRun = status !== 'idle';

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="radial-glow left-[-10%] top-[-10%] h-72 w-72 bg-indigo-400" />
        <div className="radial-glow right-[-12%] top-[20%] h-64 w-64 bg-cyan-400" />
        <div className="bg-grid-pattern absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-mpc-text sm:text-4xl">
            Simulación del protocolo
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-mpc-text-secondary sm:text-base">
            Configura las empresas y sigue cada paso del protocolo: cómo se ocultan los
            salarios, cómo se computa sobre fragmentos y cómo se reconstruye el promedio sin
            revelar nada individual.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!hasRun || !data ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <SetupPanel onStart={simulation.start} />
            </motion.div>
          ) : (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <ControlsBar
                status={status}
                isPlaying={simulation.isPlaying}
                step={step}
                currentStep={currentStep}
                totalSteps={simulation.totalSteps}
                speed={simulation.speed}
                viewMode={viewMode}
                onTogglePlay={() => (simulation.isPlaying ? simulation.pause() : simulation.play())}
                onNext={simulation.next}
                onPrev={simulation.prev}
                onRestart={simulation.restart}
                onSetSpeed={simulation.setSpeed}
                onSetViewMode={setViewMode}
                onBackToConfig={simulation.resetToConfig}
              />

              <PhaseTimeline phase={step?.phase ?? 'sharing'} />

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step?.id ?? 'intro'}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-6"
                    >
                      <div className="rounded-2xl border border-mpc-border bg-white p-5 shadow-sm">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mpc-text-tertiary">
                          <Sparkles className="h-3.5 w-3.5 text-mpc-primary" aria-hidden="true" />
                          Paso actual
                        </p>
                        <h2 className="mt-1.5 text-xl font-bold text-mpc-text">{step?.title}</h2>
                        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-mpc-text-secondary">
                          {step?.description}
                        </p>
                        {viewMode === 'technical' && step?.technical ? (
                          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 px-4 py-3 font-mono text-xs leading-relaxed text-emerald-300">
                            {step.technical}
                          </pre>
                        ) : null}
                      </div>

                      {step?.phase === 'sharing' ? (
                        <DistributionStage
                          data={data}
                          currentStepIndex={currentStep}
                          viewMode={viewMode}
                        />
                      ) : null}
                      {step?.phase === 'computing' ? (
                        <LocalComputationStage
                          data={data}
                          currentStepIndex={currentStep}
                          viewMode={viewMode}
                        />
                      ) : null}
                      {step?.phase === 'reconstructing' ? (
                        <ReconstructionStage
                          data={data}
                          currentStepIndex={currentStep}
                          viewMode={viewMode}
                        />
                      ) : null}
                      {step?.phase === 'result' ? <ResultReveal data={data} /> : null}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <aside className="min-w-0">
                  <div className="sticky top-24 flex flex-col gap-6">
                    <KnowledgePanel data={data} />
                  </div>
                </aside>
              </div>

              {viewMode === 'technical' ? <TechDetailTables data={data} /> : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
