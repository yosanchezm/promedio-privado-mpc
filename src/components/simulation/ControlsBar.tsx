import { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Gauge,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { KeyboardHint } from '@/components/ui/KeyboardHint';
import type { SimStatus, Speed } from '@/hooks/useSimulation';
import type { SimStep, ViewMode } from '@/lib/simulation/types';

export interface ControlsBarProps {
  status: SimStatus;
  isPlaying: boolean;
  step: SimStep | undefined;
  currentStep: number;
  totalSteps: number;
  speed: Speed;
  viewMode: ViewMode;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRestart: () => void;
  onSetSpeed: (speed: Speed) => void;
  onSetViewMode: (mode: ViewMode) => void;
  onBackToConfig: () => void;
}

const PHASE_LABELS: Record<string, string> = {
  sharing: 'Compartir',
  computing: 'Computar',
  reconstructing: 'Reconstruir',
  result: 'Resultado',
};

export function ControlsBar({
  status,
  isPlaying,
  step,
  currentStep,
  totalSteps,
  speed,
  viewMode,
  onTogglePlay,
  onNext,
  onPrev,
  onRestart,
  onSetSpeed,
  onSetViewMode,
  onBackToConfig,
}: ControlsBarProps) {
  const active = status !== 'idle';

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;

      if (event.code === 'Space') {
        event.preventDefault();
        onTogglePlay();
      } else if (event.code === 'ArrowRight') {
        event.preventDefault();
        onNext();
      } else if (event.code === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, onTogglePlay, onNext, onPrev]);

  const playLabel = status === 'running' ? 'Pausar' : status === 'done' ? 'Finalizado' : 'Reanudar';

  return (
    <div className="rounded-2xl border border-mpc-border bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="md"
            icon={isPlaying ? <Pause /> : <Play />}
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pausar reproducción' : 'Reanudar reproducción'}
          >
            {isPlaying ? 'Pausar' : playLabel}
          </Button>
          <Button size="md" variant="secondary" icon={<ChevronLeft />} onClick={onPrev} aria-label="Paso anterior">
            <span className="hidden sm:inline">Anterior</span>
          </Button>
          <Button size="md" variant="secondary" iconRight={<ChevronRight />} onClick={onNext} aria-label="Siguiente paso">
            <span className="hidden sm:inline">Siguiente</span>
          </Button>
          <Button size="md" variant="ghost" icon={<RotateCcw />} onClick={onRestart} aria-label="Reiniciar con nuevos polinomios">
            <span className="hidden sm:inline">Reiniciar</span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2" aria-live="polite">
            <span className="rounded-lg bg-mpc-border-light px-2.5 py-1 text-xs font-medium text-mpc-text-secondary">
              Paso <strong className="font-mono text-mpc-primary">{Math.min(currentStep + 1, totalSteps)}</strong>
              <span className="text-mpc-text-tertiary"> / {totalSteps}</span>
            </span>
            {step ? (
              <motion.span
                key={step.id}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden text-xs font-medium text-mpc-text-secondary md:inline"
              >
                {PHASE_LABELS[step.phase]}: {step.title}
              </motion.span>
            ) : null}
          </div>

          <SegmentedControl<'0.5' | '1' | '2'>
            ariaLabel="Velocidad de reproducción"
            size="sm"
            value={String(speed) as '0.5' | '1' | '2'}
            options={[
              { value: '0.5', label: '0.5×', title: 'Velocidad lenta' },
              { value: '1', label: '1×', title: 'Velocidad normal' },
              { value: '2', label: '2×', title: 'Velocidad rápida' },
            ]}
            onChange={(value) => onSetSpeed(Number(value) as Speed)}
          />

          <SegmentedControl
            ariaLabel="Modo de vista"
            size="sm"
            value={viewMode}
            options={[
              { value: 'simple', label: (<><Eye className="h-3.5 w-3.5" /> Simple</>) },
              { value: 'technical', label: (<><EyeOff className="h-3.5 w-3.5" /> Técnica</>) },
            ]}
            onChange={onSetViewMode}
          />

          <Button size="sm" variant="ghost" icon={<Settings2 />} onClick={onBackToConfig} aria-label="Volver a la configuración">
            <span className="hidden sm:inline">Config</span>
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-mpc-border-light pt-2.5">
        <KeyboardHint keys={['Espacio']} description="Iniciar / pausar" />
        <KeyboardHint keys={['←']} description="Paso anterior" />
        <KeyboardHint keys={['→']} description="Siguiente paso" />
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-mpc-text-tertiary">
          <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
          Reproducción automática
        </span>
      </div>
    </div>
  );
}
