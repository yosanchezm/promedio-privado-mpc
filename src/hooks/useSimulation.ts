import { useCallback, useEffect, useRef, useState } from 'react';
import { runProtocol } from '@/lib/simulation/protocol';
import type { SimConfig, SimData, SimStep } from '@/lib/simulation/types';
import { formatPolynomialFull, shortBigInt } from '@/lib/simulation/format';
import { P } from '@/lib/mpc';

export type SimStatus = 'idle' | 'running' | 'paused' | 'done';
export type Speed = 0.5 | 1 | 2;

const BASE_STEP_MS = 2400;

/**
 * Builds the full typed step list from a precomputed protocol run.
 *
 * Phase 1 (sharing): per company — generate polynomial, then send n - 1 shares.
 * Phase 2 (computing): per company — receive n shares and compute the local sum.
 * Phase 3 (reconstructing): collect t local sums, Lagrange at x = 0, total.
 * Result: private average.
 */
export function buildSteps(data: SimData): SimStep[] {
  const { companies, config } = data;
  const n = config.n;
  const t = config.t;
  const steps: SimStep[] = [];

  for (const company of companies) {
    steps.push({
      id: `gen-${company.index}`,
      phase: 'sharing',
      companyIndex: company.index,
      title: `${company.name} genera su polinomio`,
      description: `${company.name} oculta su salario de $${company.secret} como el término constante de un polinomio de grado ${t - 1}.`,
      technical: `f(${company.index})(x) = ${formatPolynomialFull(company.coefficients)}  (mod P)\nCoeficientes: [${company.coefficients.join(', ')}]`,
      payload: {},
    });

    steps.push({
      id: `send-${company.index}`,
      phase: 'sharing',
      companyIndex: company.index,
      title: `${company.name} envía ${n - 1} shares`,
      description: `${company.name} conserva su propio share y envía un share distinto a cada una de las otras ${n - 1} empresas. Ningún share revela el salario por sí solo.`,
      technical: `Shares generados (x, f(${company.index})(x)):\n${company.outgoingShares
        .map((share) => `  (${share.x}, ${shortBigInt(share.y, 16)})`)
        .join('\n')}\nShare propio: (${company.ownShare.x}, ${shortBigInt(company.ownShare.y, 16)})`,
      payload: { sentShares: company.outgoingShares },
    });
  }

  for (const company of companies) {
    steps.push({
      id: `compute-${company.index}`,
      phase: 'computing',
      companyIndex: company.index,
      title: `${company.name} calcula su suma local`,
      description: `${company.name} suma los ${n} shares que tiene (el propio y los ${n - 1} recibidos). El resultado F(${company.index}) no revela los salarios individuales.`,
      technical:
        `F(${company.index}) = Σ f_i(${company.index}) mod P\n` +
        `  = ${company.ownShare.y}${company.receivedShares
          .map((r) => `\n  + ${r.share.y}`)
          .join('')}\n  = ${company.localSum} (mod P)`,
      payload: { localSum: company.localSum },
    });
  }

  const points = data.reconstructionPoints;

  steps.push({
    id: 'collect',
    phase: 'reconstructing',
    title: `Recolectar ${t} sumas locales`,
    description: `El reconstructor pide ${t} sumas locales (los primeros ${t} puntos). Con menos de ${t} no hay suficiente información.`,
    technical: `Puntos usados (x, F(x)):\n${points
      .map((p) => `  (${p.x}, ${shortBigInt(p.y, 16)})`)
      .join('\n')}`,
    payload: { points },
  });

  steps.push({
    id: 'lagrange',
    phase: 'reconstructing',
    title: 'Interpolación de Lagrange en x = 0',
    description:
      'Con los puntos recolectados se interpola el polinomio suma F y se evalúa en x = 0, donde se encuentra el total.',
    technical: `Basis de Lagrange ℓ_i(0) = ∏ (0 − x_j)/(x_i − x_j) mod P:\n${points
      .map((p, i) => `  ℓ_${p.x}(0) = ${data.basis[i]}`)
      .join('\n')}\nS = Σ y_i·ℓ_i(0) mod P = ${data.totalReconstructed}`,
    payload: { points, basis: data.basis },
  });

  steps.push({
    id: 'total',
    phase: 'reconstructing',
    title: 'Suma total',
    description: `El valor reconstruido en x = 0 es la suma de los ${n} salarios: $${data.totalReconstructed}.`,
    technical: `S = ${data.totalReconstructed}  (mod P = ${P})\nPuntos: ${points
      .map((p) => `(${p.x}, ${shortBigInt(p.y, 12)})`)
      .join(', ')}\nBasis: [${data.basis.join(', ')}]`,
    payload: { points, total: data.totalReconstructed },
  });

  steps.push({
    id: 'result',
    phase: 'result',
    title: 'Promedio privado',
    description: `La suma total se divide entre ${n} empresas. El promedio es público; los salarios individuales permanecen privados.`,
    technical: `Promedio = ${data.totalReconstructed} / ${n} = ${data.average}${
      data.averageIsExact ? ' (exacto)' : ' (2 decimales)'
    }`,
    payload: {
      total: data.totalReconstructed,
      average: data.average,
      averageIsExact: data.averageIsExact,
    },
  });

  return steps;
}

/**
 * Step machine driving the simulation. Precomputes the protocol data, exposes
 * typed navigation (next / prev / restart), and provides autoplay with speed.
 */
export function useSimulation() {
  const [status, setStatus] = useState<SimStatus>('idle');
  const [data, setData] = useState<SimData | null>(null);
  const [steps, setSteps] = useState<SimStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);
  const dataRef = useRef<SimData | null>(null);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const start = useCallback((config: SimConfig) => {
    const result = runProtocol(config.n, config.t, config.salaries);
    const built = buildSteps(result);
    setData(result);
    setSteps(built);
    setCurrentStep(0);
    setStatus('running');
  }, []);

  const next = useCallback(() => {
    setCurrentStep((index) => {
      if (index >= steps.length - 1) {
        setStatus('done');
        return index;
      }
      return index + 1;
    });
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrentStep((index) => {
      if (index > 0) {
        setStatus((s) => (s === 'done' ? 'paused' : s));
        return index - 1;
      }
      return index;
    });
  }, []);

  const play = useCallback(() => {
    setStatus((s) => (s === 'idle' ? s : 'running'));
  }, []);

  const pause = useCallback(() => {
    setStatus((s) => (s === 'running' ? 'paused' : s));
  }, []);

  const restart = useCallback(() => {
    const current = dataRef.current;
    if (!current) return;
    start({
      n: current.config.n,
      t: current.config.t,
      salaries: current.config.salaries,
    });
  }, [start]);

  const setSpeedValue = useCallback((value: Speed) => {
    setSpeed(value);
  }, []);

  const resetToConfig = useCallback(() => {
    setStatus('idle');
    setData(null);
    setSteps([]);
    setCurrentStep(0);
  }, []);

  // Autoplay: a timeout re-armed on every step change keeps a steady rhythm.
  useEffect(() => {
    if (status !== 'running') return;
    const delay = Math.round(BASE_STEP_MS / speed);
    const timer = setTimeout(() => {
      setCurrentStep((index) => {
        if (index >= steps.length - 1) {
          setStatus('done');
          return index;
        }
        return index + 1;
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [status, currentStep, speed, steps.length]);

  return {
    status,
    data,
    steps,
    currentStep,
    step: steps[currentStep],
    totalSteps: steps.length,
    speed,
    isPlaying: status === 'running',
    start,
    next,
    prev,
    play,
    pause,
    restart,
    resetToConfig,
    setSpeed: setSpeedValue,
  };
}
