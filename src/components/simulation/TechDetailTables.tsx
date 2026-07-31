import { FunctionSquare, Share2, Inbox, GitMerge, Sigma, Landmark } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { SimData } from '@/lib/simulation/types';
import { formatAverage, formatPolynomialFull, shortBigInt } from '@/lib/simulation/format';
import { formatPrime } from '@/lib/simulation/format';

const MONO_TD = 'px-3 py-2 font-mono text-xs text-mpc-text align-top break-all';

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-mpc-border bg-slate-50/80 px-5 py-3.5">
        <span className="text-mpc-primary [&>svg]:h-4.5 [&>svg]:w-4.5" aria-hidden="true">
          {icon}
        </span>
        <h3 className="text-sm font-bold text-mpc-text">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

export interface TechDetailTablesProps {
  data: SimData;
}

export function TechDetailTables({ data }: TechDetailTablesProps) {
  const { companies, config } = data;

  return (
    <div className="flex flex-col gap-6">
      <Section icon={<Landmark className="h-4.5 w-4.5" />} title="Campo primo y parámetros">
        <div className="flex flex-wrap gap-2">
          <Badge tone="primary">P = 2⁶¹ − 1 = {formatPrime()}</Badge>
          <Badge tone="neutral">n = {config.n} empresas</Badge>
          <Badge tone="neutral">t = {config.t} (umbral)</Badge>
          <Badge tone="neutral">grado = {config.t - 1}</Badge>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-mpc-text-secondary">
          Todas las operaciones (evaluación de polinomios, suma de shares, interpolación) se
          realizan módulo P. La suma total {data.totalReconstructed} &lt; P, por lo que no hay
          envoltura modular.
        </p>
      </Section>

      <Section icon={<FunctionSquare className="h-4.5 w-4.5" />} title="Polinomios por empresa">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-[0.65rem] font-semibold uppercase tracking-wide text-mpc-text-tertiary">
                <th className="px-3 py-2">Empresa</th>
                <th className="px-3 py-2">Secreto (sᵢ = término constante)</th>
                <th className="px-3 py-2">Polinomio fᵢ(x) mod P</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mpc-border-light">
              {companies.map((company) => (
                <tr key={company.index}>
                  <td className="px-3 py-2 font-semibold text-mpc-text">E{company.index}</td>
                  <td className={MONO_TD}>{company.secret}</td>
                  <td className={MONO_TD}>{formatPolynomialFull(company.coefficients)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section icon={<Share2 className="h-4.5 w-4.5" />} title="Shares generados y distribuidos">
        <div className="space-y-3">
          {companies.map((company) => (
            <details key={company.index} className="group rounded-xl border border-mpc-border-light bg-slate-50/50">
              <summary className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-semibold text-mpc-text hover:text-mpc-primary">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mpc-primary text-xs font-bold text-white">
                  {company.index}
                </span>
                {company.name} — {company.outgoingShares.length + 1} shares evaluados en x = 1…{config.n}
              </summary>
              <div className="overflow-x-auto px-4 pb-3">
                <table className="w-full min-w-[420px] border-separate border-spacing-0">
                  <thead>
                    <tr className="text-left text-[0.65rem] font-semibold uppercase tracking-wide text-mpc-text-tertiary">
                      <th className="px-3 py-1.5">Destino</th>
                      <th className="px-3 py-1.5">x</th>
                      <th className="px-3 py-1.5">fᵢ(x) mod P</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mpc-border-light">
                    {[company.ownShare, ...company.outgoingShares].map((share, index) => {
                      const destination = index === 0 ? 'Propio' : `Empresa ${share.x}`;
                      return (
                        <tr key={index}>
                          <td className="px-3 py-1.5 text-xs font-medium text-mpc-text">{destination}</td>
                          <td className={MONO_TD}>{share.x}</td>
                          <td className={MONO_TD}>{share.y}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section icon={<Inbox className="h-4.5 w-4.5" />} title="Shares recibidos por empresa">
        <div className="space-y-3">
          {companies.map((company) => (
            <details key={company.index} className="group rounded-xl border border-mpc-border-light bg-slate-50/50">
              <summary className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-semibold text-mpc-text hover:text-mpc-primary">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mpc-secondary text-xs font-bold text-white">
                  {company.index}
                </span>
                {company.name} — {company.receivedShares.length + 1} shares
              </summary>
              <div className="overflow-x-auto px-4 pb-3">
                <table className="w-full min-w-[420px] border-separate border-spacing-0">
                  <thead>
                    <tr className="text-left text-[0.65rem] font-semibold uppercase tracking-wide text-mpc-text-tertiary">
                      <th className="px-3 py-1.5">Origen</th>
                      <th className="px-3 py-1.5">x</th>
                      <th className="px-3 py-1.5">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mpc-border-light">
                    <tr>
                      <td className="px-3 py-1.5 text-xs font-medium text-mpc-text">Propio (fᵢ(j))</td>
                      <td className={MONO_TD}>{company.ownShare.x}</td>
                      <td className={MONO_TD}>{company.ownShare.y}</td>
                    </tr>
                    {company.receivedShares.map((received, index) => (
                      <tr key={index}>
                        <td className="px-3 py-1.5 text-xs font-medium text-mpc-text">
                          Empresa {received.from} (f{subScript(received.from)}(j))
                        </td>
                        <td className={MONO_TD}>{received.share.x}</td>
                        <td className={MONO_TD}>{received.share.y}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 text-xs text-mpc-text-secondary">
                  Suma local F({company.index}) = <strong className="font-mono">{company.localSum}</strong> mod P
                </p>
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section icon={<GitMerge className="h-4.5 w-4.5" />} title="Reconstrucción (Lagrange en x = 0)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-[0.65rem] font-semibold uppercase tracking-wide text-mpc-text-tertiary">
                <th className="px-3 py-2">x</th>
                <th className="px-3 py-2">F(x) (suma local)</th>
                <th className="px-3 py-2">ℓᵢ(0) mod P</th>
                <th className="px-3 py-2">yᵢ · ℓᵢ(0) mod P</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mpc-border-light">
              {data.reconstructionPoints.map((point, index) => {
                const weighted = (point.y * BigInt(data.basis[index])) % data.prime;
                const normalized = ((weighted % data.prime) + data.prime) % data.prime;
                return (
                  <tr key={point.x}>
                    <td className={MONO_TD}>{point.x}</td>
                    <td className={MONO_TD}>{point.y}</td>
                    <td className={MONO_TD}>{data.basis[index]}</td>
                    <td className={MONO_TD}>{normalized}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-indigo-50 px-4 py-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-mpc-primary">
              Suma total reconstruida S
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-mpc-primary">{data.totalReconstructed}</p>
          </div>
          <div className="rounded-xl bg-cyan-50 px-4 py-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-mpc-accent">
              Promedio = S / n
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-mpc-accent">
              ${formatAverage(data.average)}
              {data.averageIsExact ? ' (exacto)' : ''}
            </p>
          </div>
        </div>
        {data.reconstructionNote ? (
          <p className="mt-3 rounded-xl bg-mpc-warning-light px-4 py-2.5 text-xs text-amber-700">
            {data.reconstructionNote}
          </p>
        ) : null}
      </Section>

      <Section icon={<Sigma className="h-4.5 w-4.5" />} title="Verificación del homomorfismo aditivo">
        <p className="text-xs leading-relaxed text-mpc-text-secondary">
          Se verificó que cada suma local F(j) = Σᵢ fᵢ(j) mod P coincide con la evaluación en
          x = j del polinomio suma (coeficientes sumados módulo P). Esto confirma el
          homomorfismo: <em>compartir y luego sumar es igual a sumar y luego compartir</em>.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-mpc-text-secondary">
          Referencia: F(x) = {shortBigInt(data.totalReconstructed, 16)} en x = 0. Suma de
          secretos: {companies.map((c) => c.secret).join(' + ')} = {data.totalReconstructed}.
        </p>
      </Section>
    </div>
  );
}

function subScript(value: number): string {
  const digits = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
  return String(value)
    .split('')
    .map((d) => digits[Number(d)])
    .join('');
}
