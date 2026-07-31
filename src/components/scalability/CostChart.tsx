import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import {
  defaultThreshold,
  distributionMessages,
  totalMessages,
} from '@/lib/scalability/metrics';

export interface CostChartProps {
  maxN?: number;
}

/**
 * Total messages vs number of companies. Shows the quadratic O(n²) growth of
 * the distribution cost. Axes and tooltips are in Spanish.
 */
export function CostChart({ maxN = 20 }: CostChartProps) {
  const data = useMemo(() => {
    const rows: { n: number; total: number; distribution: number }[] = [];
    for (let n = 3; n <= maxN; n++) {
      const t = defaultThreshold(n);
      rows.push({
        n,
        total: totalMessages(n, t),
        distribution: distributionMessages(n),
      });
    }
    return rows;
  }, [maxN]);

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="border-b border-mpc-border px-5 py-4">
        <h3 className="text-sm font-bold text-mpc-text">Crecimiento del costo de comunicación</h3>
        <p className="mt-1 text-xs text-mpc-text-secondary">
          Mensajes totales M(n, t) = n(n−1) + t con t = n − 1. El costo crece de forma
          cuadrática con el número de empresas.
        </p>
      </div>
      <div className="min-w-0 p-2 sm:p-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="fillDist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="n"
                label={{ value: 'Empresas (n)', position: 'insideBottom', offset: -2, fontSize: 12, fill: '#64748b' }}
                tick={{ fontSize: 12, fill: '#64748b' }}
                stroke="#cbd5e1"
              />
              <YAxis
                label={{ value: 'Mensajes', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }}
                tick={{ fontSize: 12, fill: '#64748b' }}
                stroke="#cbd5e1"
              />
              <Tooltip
                formatter={(value) => [String(value), 'Mensajes']}
                labelFormatter={(label) => `n = ${label} empresas`}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                  boxShadow: '0 8px 24px -12px rgb(15 23 42 / 0.2)',
                }}
              />
              <Legend
                formatter={(value) => (value === 'total' ? 'Mensajes totales' : 'Distribución n(n−1)')}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="distribution"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#fillDist)"
                name="distribution"
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fill="url(#fillTotal)"
                name="total"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
