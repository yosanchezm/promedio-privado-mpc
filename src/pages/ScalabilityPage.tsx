import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Network, Sigma } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { ScalabilityMetrics } from '@/components/scalability/ScalabilityMetrics';
import { CostChart } from '@/components/scalability/CostChart';
import { GrowthTable } from '@/components/scalability/GrowthTable';
import { defaultThreshold } from '@/lib/scalability/metrics';

export function ScalabilityPage() {
  const [n, setN] = useState(10);
  const [t, setT] = useState(defaultThreshold(10));

  const totalMessages = useMemo(() => n * (n - 1) + t, [n, t]);
  const shares = useMemo(() => n * n, [n]);

  const handleNChange = (next: number) => {
    setN(next);
    setT((current) => Math.min(current, next));
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="radial-glow left-[-8%] top-[-8%] h-72 w-72 bg-cyan-400" />
        <div className="radial-glow right-[-10%] top-[30%] h-64 w-64 bg-indigo-400" />
        <div className="bg-grid-pattern absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge tone="primary">Escalabilidad</Badge>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-mpc-text sm:text-4xl">
            ¿Qué pasa cuando hay más empresas?
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-mpc-text-secondary">
            El protocolo es correcto para cualquier n, pero su costo de comunicación crece
            de forma cuadrática. Ajusta los parámetros y mira cómo cambia la carga de la red.
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <Card>
            <div className="grid gap-8 md:grid-cols-2">
              <Slider
                label="Número de empresas (n)"
                value={n}
                min={3}
                max={15}
                onChange={handleNChange}
                formatValue={(value) => `${value}`}
                hint={`Cada empresa genera ${n} shares y envía ${n - 1}.`}
                ariaLabel="Número de empresas"
              />
              <Slider
                label="Umbral de reconstrucción (t)"
                value={t}
                min={1}
                max={n}
                onChange={setT}
                formatValue={(value) => `${value}`}
                hint={
                  t === n
                    ? 'Todas las empresas deben colaborar.'
                    : `Basta con ${t} sumas locales para reconstruir.`
                }
                ariaLabel="Umbral de reconstrucción"
              />
            </div>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <ScalabilityMetrics n={n} t={t} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mt-8 grid gap-6 lg:grid-cols-2"
        >
          <CostChart />
          <Card className="flex flex-col">
            <h3 className="flex items-center gap-2 text-sm font-bold text-mpc-text">
              <Sigma className="h-4 w-4 text-mpc-primary" aria-hidden="true" />
              Interpretación
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-xl bg-mpc-border-light/60 px-4 py-3">
                <dt className="text-mpc-text-secondary">Mensajes totales M(n, t)</dt>
                <dd className="font-mono font-bold text-mpc-text">
                  n(n−1) + t = {n}×{n - 1} + {t} = <span className="text-mpc-primary">{totalMessages}</span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl bg-mpc-border-light/60 px-4 py-3">
                <dt className="text-mpc-text-secondary">Shares generados</dt>
                <dd className="font-mono font-bold text-mpc-text">
                  n² = <span className="text-mpc-primary">{shares}</span>
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-mpc-text-secondary">
              La fase de distribución domina el costo: cada empresa debe enviar un share a las
              otras n − 1. Eso produce O(n²) mensajes, un factor clave al evaluar MPC en el
              mundo real frente a otras técnicas como la criptografía totalmente homomórfica,
              que cambia cómputo por comunicación.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-mpc-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mpc-accent" aria-hidden="true" />
                Compartir un share por par de empresas: n(n−1) mensajes.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mpc-accent" aria-hidden="true" />
                La reconstrucción es barata: solo t sumas locales viajan al reconstruidor.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mpc-accent" aria-hidden="true" />
                El cómputo local crece igual de rápido: n polinomios de grado t−1.
              </li>
            </ul>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <GrowthTable />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <Card className="flex flex-wrap items-center justify-between gap-6 border-dashed">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-mpc-accent">
                <Network className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-mpc-text">En resumen</p>
                <p className="mt-1 max-w-2xl text-sm text-mpc-text-secondary">
                  MPC brilla por su privacidad, no por su eficiencia de red. Para pocas
                  empresas es trivial; para cientos, el costo cuadrático obliga a estrategias
                  como la agregación por pares o umbrales menores.
                </p>
              </div>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
