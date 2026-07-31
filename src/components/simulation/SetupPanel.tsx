import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Dices, Eraser, Play, RefreshCw, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { NumberField } from '@/components/ui/NumberField';
import { Badge } from '@/components/ui/Badge';
import { DEFAULT_CONFIG, generateRandomSalaries, companyName } from '@/lib/simulation/example';
import { validateSimConfig } from '@/lib/validation/simulation';
import type { SimConfig } from '@/lib/simulation/types';

export interface SetupPanelProps {
  onStart: (config: SimConfig) => void;
}

const DEFAULT_T = 3;
const DEFAULT_SALARIES = DEFAULT_CONFIG.salaries.map(String);

export function SetupPanel({ onStart }: SetupPanelProps) {
  const [n, setN] = useState(DEFAULT_CONFIG.n);
  const [t, setT] = useState(DEFAULT_T);
  const [salaries, setSalaries] = useState<string[]>(DEFAULT_SALARIES);

  const parsed = useMemo(
    () => salaries.map((salary) => (salary.trim() === '' ? Number.NaN : Number(salary))),
    [salaries],
  );

  const validation = useMemo(
    () => validateSimConfig(n, t, parsed),
    [n, t, parsed],
  );

  const handleNChange = (value: number) => {
    setN(value);
    setT((current) => Math.max(1, Math.min(current, Math.max(1, value - 1))));
    setSalaries((current) => {
      if (current.length === value) return current;
      if (current.length < value) {
        return [...current, ...Array(value - current.length).fill('5000')];
      }
      return current.slice(0, value);
    });
  };

  const handleTChange = (value: number) => {
    setT(Math.max(1, Math.min(value, n)));
  };

  const handleSalaryChange = (index: number, value: string) => {
    setSalaries((current) => current.map((s, i) => (i === index ? value : s)));
  };

  const useExample = () => {
    setN(DEFAULT_CONFIG.n);
    setT(DEFAULT_T);
    setSalaries(DEFAULT_CONFIG.salaries.map(String));
  };

  const randomize = () => {
    const values = generateRandomSalaries(n);
    setSalaries(values.map(String));
    setT((current) => Math.max(1, Math.min(current, n - 1)));
  };

  const reset = () => {
    setN(DEFAULT_CONFIG.n);
    setT(DEFAULT_T);
    setSalaries(DEFAULT_SALARIES);
  };

  const invalidCount = parsed.filter((salary) => Number.isNaN(salary) || salary < 1).length;

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="border-b border-mpc-border bg-gradient-to-r from-indigo-50/80 via-white to-cyan-50/60 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-mpc-text">
              <Building2 className="h-5 w-5 text-mpc-primary" aria-hidden="true" />
              Configura la simulación
            </h2>
            <p className="mt-1 text-sm text-mpc-text-secondary">
              Define cuántas empresas participan, el umbral de reconstrucción y sus salarios.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" icon={<RefreshCw />} onClick={useExample}>
              Usar ejemplo
            </Button>
            <Button size="sm" variant="secondary" icon={<Dices />} onClick={randomize}>
              Valores aleatorios
            </Button>
            <Button size="sm" variant="ghost" icon={<Eraser />} onClick={reset}>
              Reiniciar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1fr_1.4fr]">
        <div className="space-y-6">
          <Slider
            label="Número de empresas (n)"
            value={n}
            min={3}
            max={15}
            formatValue={(value) => String(value)}
            hint="Más empresas aumentan el costo de comunicación (O(n²))."
            onChange={handleNChange}
          />
          <Slider
            label="Umbral (t)"
            value={t}
            min={1}
            max={n}
            formatValue={(value) => String(value)}
            hint="Mínimo de empresas que deben colaborar para reconstruir la suma."
            onChange={handleTChange}
          />
          <div className="rounded-xl bg-mpc-border-light px-4 py-3 text-xs leading-relaxed text-mpc-text-secondary">
            Con <strong className="text-mpc-primary">t = {t}</strong>, cada empresa usa un
            polinomio de grado <strong className="font-mono">{t - 1}</strong> y se necesitan{' '}
            <strong className="text-mpc-primary">t sumas locales</strong> para reconstruir el
            total.
          </div>
        </div>

        <div className="flex items-start gap-2 self-start rounded-xl border border-cyan-100 bg-cyan-50/60 p-4 text-sm leading-relaxed text-cyan-900">
          <Users className="mt-0.5 h-5 w-5 shrink-0 text-mpc-accent" aria-hidden="true" />
          <p>
            Cada empresa mantiene <strong>privado</strong> su salario. Solo los fragmentos
            (shares) viajan entre participantes, y ninguno revela el valor original.
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-mpc-text">Salarios (privados)</h3>
            <Badge tone={invalidCount > 0 ? 'danger' : 'neutral'}>
              {invalidCount > 0 ? `${invalidCount} inválido(s)` : `${n} válido(s)`}
            </Badge>
          </div>
          <div className="grid max-h-72 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            {salaries.map((salary, index) => (
              <NumberField
                key={index}
                label={companyName(index + 1)}
                value={salary}
                prefix="$"
                min={1}
                max={9_999_999}
                ariaLabel={`Salario de ${companyName(index + 1)}`}
                error={validation.errors.salaries?.[index]}
                onChange={(value) => handleSalaryChange(index, value)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-mpc-border px-6 py-4">
        <AnimatePresence>
          {!validation.success ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                role="alert"
                className="mb-3 rounded-xl border border-mpc-error/30 bg-mpc-error-light px-4 py-2.5 text-sm text-mpc-error"
              >
                Corrige los errores antes de iniciar: {validation.errors.n ?? validation.errors.t ?? ''}
                {!validation.errors.n && !validation.errors.t && validation.errors.salaries?.some(Boolean)
                  ? 'Revisa los salarios marcados.'
                  : ''}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <Button
          size="lg"
          className="w-full sm:w-auto"
          icon={<Play />}
          disabled={!validation.success}
          onClick={() => onStart({ n, t, salaries: parsed })}
        >
          Iniciar simulación
        </Button>
      </div>
    </Card>
  );
}
