import { useState } from 'react';
import { Check, Eye, EyeOff, ShieldCheck, UserRound } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { SimData } from '@/lib/simulation/types';
import { formatSalary } from '@/lib/simulation/format';

type Perspective = 'company' | 'reconstructor';

export interface KnowledgePanelProps {
  data: SimData;
}

interface Knowledge {
  knows: string[];
  notKnows: string[];
}

/**
 * Honest privacy panel: what each actor knows and does not know. The values
 * come straight from the protocol data — a company only ever sees its own
 * secret, its polynomial and the shares it holds.
 */
export function KnowledgePanel({ data }: KnowledgePanelProps) {
  const { companies, config } = data;
  const [perspective, setPerspective] = useState<Perspective>('company');
  const [companyIndex, setCompanyIndex] = useState(1);

  const knowledge: Knowledge =
    perspective === 'reconstructor'
      ? {
          knows: [
            `${config.t} sumas locales (los puntos usados)`,
            `El total reconstruido S = ${formatSalary(Number(data.totalReconstructed))}`,
            `El promedio final (público)`,
          ],
          notKnows: [
            `Los salarios individuales`,
            `Los polinomios de las empresas`,
            `Los shares sueltos de cada empresa`,
          ],
        }
      : {
          knows: [
            `Su salario: ${formatSalary(Number(companies[companyIndex - 1].secret))}`,
            'Su polinomio y sus coeficientes',
            `Los ${config.n} shares que tiene (propio + ${config.n - 1} recibidos)`,
            `Su suma local F(${companyIndex})`,
          ],
          notKnows: [
            'Los salarios de las demás empresas',
            'Los polinomios de las demás empresas',
            `Las sumas locales F(j) de las otras ${config.n - 1} empresas`,
          ],
        };

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="border-b border-mpc-border bg-gradient-to-r from-indigo-50/70 to-cyan-50/60 px-5 py-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-mpc-primary" aria-hidden="true" />
          <h3 className="text-sm font-bold text-mpc-text">¿Quién sabe qué?</h3>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SegmentedControl<Perspective>
            ariaLabel="Perspectiva del panel de conocimiento"
            size="sm"
            value={perspective}
            options={[
              { value: 'company', label: 'Participante' },
              { value: 'reconstructor', label: 'Reconstructor' },
            ]}
            onChange={setPerspective}
          />
          {perspective === 'company' ? (
            <label className="flex items-center gap-2 text-xs font-medium text-mpc-text-secondary">
              <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
              Empresa
              <select
                value={companyIndex}
                onChange={(event) => setCompanyIndex(Number(event.target.value))}
                className="rounded-lg border border-mpc-border bg-white px-2 py-1 text-xs font-semibold text-mpc-text focus:outline-none focus:ring-2 focus:ring-mpc-primary/40"
              >
                {companies.map((company) => (
                  <option key={company.index} value={company.index}>
                    {company.index}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-mpc-success">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Conoce
          </p>
          <ul className="mt-2.5 space-y-2">
            {knowledge.knows.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-snug text-mpc-text">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mpc-success" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-mpc-text-tertiary">
            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> No conoce
          </p>
          <ul className="mt-2.5 space-y-2">
            {knowledge.notKnows.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-snug text-mpc-text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-mpc-border-light px-5 py-3.5">
        <p className="text-xs leading-relaxed text-mpc-text-secondary">
          {config.t < config.n ? (
            <>
              Con el umbral <strong className="font-mono">t = {config.t}</strong>, al menos{' '}
              <strong>{config.t} sumas locales</strong> deben coludirse para reconstruir el
              total. Ningún subconjunto menor es suficiente.
            </>
          ) : (
            <>
              Con <strong className="font-mono">t = n = {config.n}</strong>, todas las sumas
              locales son necesarias para reconstruir el total.
            </>
          )}{' '}
          El resultado final (total y promedio) es <Badge tone="success">público</Badge>.
        </p>
      </div>
    </Card>
  );
}
