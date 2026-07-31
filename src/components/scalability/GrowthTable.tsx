import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { buildTable } from '@/lib/scalability/metrics';
import type { GrowthRow } from '@/lib/scalability/metrics';

export interface GrowthTableProps {
  maxN?: number;
}

export function GrowthTable({ maxN = 15 }: GrowthTableProps) {
  const rows = useMemo(() => buildTable(maxN), [maxN]);

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="border-b border-mpc-border px-5 py-4">
        <h3 className="text-sm font-bold text-mpc-text">Costos por número de empresas</h3>
        <p className="mt-1 text-xs text-mpc-text-secondary">
          Con umbral por defecto t = n − 1. Los mensajes crecen de forma cuadrática.
        </p>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-mpc-text-tertiary">
              <th className="px-5 py-3">n</th>
              <th className="px-3 py-3">t</th>
              <th className="px-3 py-3">Shares (n²)</th>
              <th className="px-3 py-3">Distribución n(n−1)</th>
              <th className="px-3 py-3">Reconstrucción (t)</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-5 py-3">Observación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mpc-border-light">
            {rows.map((row: GrowthRow) => (
              <tr key={row.n} className="transition-colors hover:bg-indigo-50/40">
                <td className="px-5 py-2.5 font-mono font-bold text-mpc-primary">{row.n}</td>
                <td className="px-3 py-2.5 font-mono">{row.t}</td>
                <td className="px-3 py-2.5 font-mono">{row.shares}</td>
                <td className="px-3 py-2.5 font-mono">{row.dist}</td>
                <td className="px-3 py-2.5 font-mono">{row.recon}</td>
                <td className="px-3 py-2.5 font-mono font-bold text-mpc-text">{row.total}</td>
                <td className="px-5 py-2.5">
                  <Badge
                    tone={
                      row.observation === 'Costo mínimo'
                        ? 'success'
                        : row.observation === 'Costo moderado'
                          ? 'accent'
                          : 'warning'
                    }
                  >
                    {row.observation}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
