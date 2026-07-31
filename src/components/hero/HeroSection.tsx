import { motion } from 'motion/react';
import { ArrowRight, BookOpen, PlayCircle, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const NODES = [
  { x: 90, y: 60, color: '#4f46e5', label: 'Empresa 1' },
  { x: 300, y: 30, color: '#7c3aed', label: 'Empresa 2' },
  { x: 470, y: 80, color: '#06b6d4', label: 'Empresa 3' },
  { x: 180, y: 170, color: '#10b981', label: 'Empresa 4' },
  { x: 390, y: 185, color: '#f59e0b', label: 'Reconstructor' },
];

const EDGES = [
  [0, 1], [0, 2], [0, 3], [1, 2], [1, 4], [2, 4], [3, 4], [1, 3], [0, 4],
];

/** Decorative network of connected nodes used as hero background. */
function NodeNetwork() {
  return (
    <svg
      viewBox="0 0 540 220"
      className="h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="network-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {EDGES.map(([from, to], index) => (
        <motion.line
          key={index}
          x1={NODES[from].x}
          y1={NODES[from].y}
          x2={NODES[to].x}
          y2={NODES[to].y}
          stroke="url(#network-edge)"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
        />
      ))}
      {NODES.map((node, index) => (
        <g key={index}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={20}
            fill={node.color}
            fillOpacity="0.12"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.1, type: 'spring', stiffness: 200, damping: 18 }}
          />
          <circle cx={node.x} cy={node.y} r={9} fill={node.color} />
          <motion.text
            x={node.x}
            y={node.y + 34}
            textAnchor="middle"
            className="fill-slate-500"
            fontSize="10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + index * 0.08 }}
          >
            {node.label}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="radial-glow left-[-10%] top-[-20%] h-[420px] w-[420px] bg-indigo-500" />
        <div className="radial-glow right-[-12%] top-[10%] h-[380px] w-[380px] bg-violet-500" />
        <div className="radial-glow bottom-[-30%] left-[35%] h-[360px] w-[360px] bg-cyan-400" />
        <div className="bg-grid-pattern absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Badge tone="primary" icon={<Lock className="h-3.5 w-3.5" />}>
              Computación Multi-Parte Segura · Criptografía
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
            className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-mpc-text sm:text-5xl lg:text-[3.4rem]"
          >
            Simulación de MPC para el{' '}
            <span className="text-gradient">problema del promedio</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-mpc-text-secondary"
          >
            Calcula un promedio entre varias empresas <strong>sin revelar los valores
            individuales</strong>. Cada empresa oculta su salario con Shamir Secret
            Sharing, colabora sin exponer nada y solo el resultado final se hace
            público.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button to="/simulacion" size="lg" icon={<PlayCircle />}>
              Probar simulación
            </Button>
            <Button to="/como-funciona" size="lg" variant="secondary" icon={<BookOpen />} iconRight={<ArrowRight />}>
              Ver cómo funciona
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mpc-text-secondary"
          >
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-mpc-success" aria-hidden="true" />
              Campo primo GF(2⁶¹−1)
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-mpc-success" aria-hidden="true" />
              Esquema (t, n) de Shamir
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-mpc-success" aria-hidden="true" />
              Interpolación de Lagrange
            </li>
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          className="relative"
        >
          <div className="relative mx-auto max-w-lg rounded-2xl border border-mpc-border bg-white/70 p-4 shadow-[0_24px_64px_-24px_rgb(79_70_229/0.35)] backdrop-blur">
            <NodeNetwork />
            <div className="mt-2 flex items-center justify-between px-2 pb-1">
              <p className="text-xs font-medium text-mpc-text-secondary">
                n empresas comparten y suman sin revelar
              </p>
              <Badge tone="accent">homomorfismo aditivo</Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
