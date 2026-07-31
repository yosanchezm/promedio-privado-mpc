import { Share2, Send, GitMerge, MessagesSquare } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import {
  sharesTotal,
  distributionMessages,
  reconstructionMessages,
  totalMessages,
} from '@/lib/scalability/metrics';

export interface ScalabilityMetricsProps {
  n: number;
  t: number;
}

export function ScalabilityMetrics({ n, t }: ScalabilityMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={<Share2 />}
        label="Shares generados"
        value={String(sharesTotal(n))}
        sub={`n² = ${n} × ${n}`}
        accent="primary"
      />
      <MetricCard
        icon={<Send />}
        label="Mensajes de distribución"
        value={String(distributionMessages(n))}
        sub={`n(n−1) = ${n} × ${n - 1}`}
        accent="secondary"
      />
      <MetricCard
        icon={<GitMerge />}
        label="Mensajes de reconstrucción"
        value={String(reconstructionMessages(t))}
        sub={`t = ${t}`}
        accent="accent"
      />
      <MetricCard
        icon={<MessagesSquare />}
        label="Mensajes totales"
        value={String(totalMessages(n, t))}
        sub={`n(n−1) + t = ${n * (n - 1)} + ${t}`}
        accent="success"
      />
    </div>
  );
}
