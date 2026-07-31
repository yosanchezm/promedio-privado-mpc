import { motion } from 'motion/react';
import {
  ArrowRight,
  Share2,
  Calculator,
  GitMerge,
  Lock,
  EyeOff,
  ShieldCheck,
  Lightbulb,
  ArrowLeftRight,
} from 'lucide-react';
import { HeroSection } from '@/components/hero/HeroSection';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const PHASES = [
  {
    icon: <Share2 className="h-6 w-6" aria-hidden="true" />,
    color: 'bg-indigo-50 text-mpc-primary',
    title: '1 · Compartir',
    text: 'Cada empresa oculta su salario como el término constante de un polinomio y reparte n shares.',
  },
  {
    icon: <Calculator className="h-6 w-6" aria-hidden="true" />,
    color: 'bg-violet-50 text-mpc-secondary',
    title: '2 · Computar',
    text: 'Cada empresa suma los shares que tiene. El homomorfismo aditivo construye un share de la suma total.',
  },
  {
    icon: <GitMerge className="h-6 w-6" aria-hidden="true" />,
    color: 'bg-cyan-50 text-mpc-accent',
    title: '3 · Reconstruir',
    text: 'Con t sumas locales, Lagrange interpola el polinomio suma y evalúa en x = 0: aparece el promedio.',
  },
];

const KEY_IDEAS = [
  {
    icon: <Lock className="h-5 w-5" aria-hidden="true" />,
    title: 'El salario original permanece privado',
    text: 'Ninguna empresa ve los valores de las demás: solo fragmentos.',
  },
  {
    icon: <EyeOff className="h-5 w-5" aria-hidden="true" />,
    title: 'Los fragmentos por sí solos no revelan el secreto',
    text: 'Un share aislado es información inútil sin los otros.',
  },
  {
    icon: <ArrowLeftRight className="h-5 w-5" aria-hidden="true" />,
    title: 'Sumar shares equivale a compartir la suma',
    text: 'El homomorfismo aditivo permite operar sobre datos sin verlos.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    title: 'Solo el resultado final se revela',
    text: 'El promedio es público; los datos intermedios nunca salen a la luz.',
  },
];

export function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <Badge tone="primary">El problema</Badge>
            <h2 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-mpc-text">
              Tres empresas quieren un promedio… sin revelar sus salarios
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-mpc-text-secondary">
              Imagina que {`n`} empresas quieren saber el salario promedio de su sector para
              tomar decisiones. Ninguna está dispuesta a mostrar su nómina: el dato es
              confidencial. La solución no es confiar en nadie, sino en matemáticas.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              { name: 'Empresa A', value: '$5.000', color: 'bg-mpc-node-1' },
              { name: 'Empresa B', value: '$6.000', color: 'bg-mpc-node-2' },
              { name: 'Empresa C', value: '$4.500', color: 'bg-mpc-node-3' },
            ].map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <Card interactive className="text-center">
                  <span
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-white ${company.color}`}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-semibold text-mpc-text">{company.name}</h3>
                  <p className="mt-1 font-mono text-lg font-bold text-mpc-primary">{company.value}</p>
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-mpc-text-tertiary">
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                    Confidencial
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-6 text-center"
          >
            <p className="text-lg font-semibold text-mpc-text">
              Quieren calcular <span className="text-gradient font-extrabold">(A + B + C) / 3</span> pero nadie
              quiere mostrar su valor.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-mpc-text-secondary">
              Este proyecto implementa una simulación del protocolo MPC que resuelve
              exactamente ese dilema usando Shamir Secret Sharing.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="radial-glow left-[20%] top-[-10%] h-80 w-80 bg-violet-400" />
          <div className="bg-grid-pattern-fine absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <Badge tone="secondary">El protocolo en 3 fases</Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-mpc-text">
              Compartir · Computar · Reconstruir
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PHASES.map((phase, index) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
              >
                <Card interactive className="h-full">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${phase.color}`}>
                    {phase.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-mpc-text">{phase.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mpc-text-secondary">{phase.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="mt-10"
          >
            <Card className="border-dashed">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold text-mpc-text">Ideas clave</h3>
                  <p className="mt-1 text-sm text-mpc-text-secondary">
                    Lo que esta simulación busca que entiendas de forma intuitiva.
                  </p>
                </div>
                <Button to="/simulacion" icon={<ArrowRight />}>
                  Probar la simulación
                </Button>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {KEY_IDEAS.map((idea) => (
                  <div key={idea.title} className="flex gap-3 rounded-xl bg-mpc-border-light/60 p-4">
                    <span className="shrink-0 text-mpc-primary [&>svg]:h-5 [&>svg]:w-5">{idea.icon}</span>
                    <div>
                      <p className="text-sm font-semibold leading-snug text-mpc-text">{idea.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-mpc-text-secondary">{idea.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <Lightbulb className="mx-auto h-8 w-8 text-mpc-accent" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-mpc-text">
              La matemática importa
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-mpc-text-secondary">
              La privacidad no depende de la confianza, sino de la aritmética sobre el campo
              primo GF(2⁶¹−1), los polinomios aleatorios de Shamir y la interpolación de
              Lagrange. Explora cada concepto paso a paso en la sección educativa.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button to="/como-funciona" variant="secondary" icon={<ArrowRight />}>
                Cómo funciona
              </Button>
              <Button to="/escalabilidad" variant="ghost">
                Analizar escalabilidad
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
