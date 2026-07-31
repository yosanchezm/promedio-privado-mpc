import { Share2, Calculator, GitMerge, Flag } from 'lucide-react';
import { PhaseStepper } from '@/components/ui/Stepper';
import type { SimPhase } from '@/lib/simulation/types';

const PHASES = [
  { id: 'sharing' as SimPhase, label: 'Compartir', icon: <Share2 className="h-4 w-4" aria-hidden="true" /> },
  { id: 'computing' as SimPhase, label: 'Computar', icon: <Calculator className="h-4 w-4" aria-hidden="true" /> },
  { id: 'reconstructing' as SimPhase, label: 'Reconstruir', icon: <GitMerge className="h-4 w-4" aria-hidden="true" /> },
  { id: 'result' as SimPhase, label: 'Resultado', icon: <Flag className="h-4 w-4" aria-hidden="true" /> },
];

export interface PhaseTimelineProps {
  phase: SimPhase;
}

/** Horizontal stepper highlighting the active protocol phase. */
export function PhaseTimeline({ phase }: PhaseTimelineProps) {
  return <PhaseStepper phases={PHASES} activeId={phase} />;
}
