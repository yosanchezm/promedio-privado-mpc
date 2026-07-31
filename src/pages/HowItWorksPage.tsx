import { motion } from 'motion/react';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { ConceptSection } from '@/components/education/ConceptSection';
import { GlossaryGrid } from '@/components/education/GlossaryGrid';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const FAQ = [
  {
    q: '¿Por qué las empresas no pueden simplemente decirse sus salarios en privado?',
    a: 'Porque confiar en que otros guarden un secreto no es seguro ni verificable. El protocolo MPC elimina la necesidad de confianza: la matemática garantiza que el resultado se calcula sin exponer las entradas.',
  },
  {
    q: '¿Qué pasa si una empresa se niega a participar?',
    a: 'El umbral t está diseñado para eso: mientras haya al menos t empresas colaborando, la reconstrucción funciona. Las demás sumas locales simplemente no se usan.',
  },
  {
    q: '¿Qué pasa si varias empresas se confabulan?',
    a: 'Con menos de t sumas locales, no hay forma de reconstruir el total. La información de t − 1 puntos deja el polinomio completamente indeterminado. Este protocolo asume participantes semi-honestos (siguen el protocolo pero curiosos).',
  },
  {
    q: '¿Por qué los shares se ven tan grandes?',
    a: 'Porque se operan módulo P = 2⁶¹−1, un primo de 61 bits. Los valores aleatorios del campo son enormes; eso es parte de lo que hace impredecibles los fragmentos.',
  },
  {
    q: '¿El promedio puede salir con decimales?',
    a: 'Sí. Si la suma total no es divisible entre n, el promedio se muestra con dos decimales. El protocolo reconstruye la suma exacta; solo la división final introduce decimales.',
  },
];

export function HowItWorksPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="radial-glow right-[-8%] top-[-10%] h-72 w-72 bg-violet-400" />
        <div className="radial-glow left-[-8%] top-[35%] h-64 w-64 bg-cyan-400" />
        <div className="bg-grid-pattern absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge tone="secondary">Modo educativo</Badge>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-mpc-text sm:text-4xl">
            Cómo funciona la simulación
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-mpc-text-secondary">
            Todo el protocolo descansa sobre cinco ideas: secretos, shares, polinomios,
            interpolación y un homomorfismo aditivo. Explora cada concepto en orden.
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <ConceptSection />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mt-14"
        >
          <h2 className="text-2xl font-extrabold tracking-tight text-mpc-text">Glosario</h2>
          <p className="mt-2 mb-6 text-sm text-mpc-text-secondary">
            Los términos que necesitas para entender cualquier gráfica o fórmula de la app.
          </p>
          <GlossaryGrid />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mt-14"
        >
          <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-mpc-text">
            <HelpCircle className="h-6 w-6 text-mpc-accent" aria-hidden="true" />
            Preguntas frecuentes
          </h2>
          <div className="mt-6">
            <Accordion
              items={FAQ.map((item) => ({
                title: item.q,
                content: item.a,
              }))}
            />
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-cyan-50 p-6"
        >
          <div>
            <p className="font-bold text-mpc-text">Ahora sí: ponlo en práctica</p>
            <p className="mt-1 text-sm text-mpc-text-secondary">
              Ajusta n y t, mira los shares volar y verifica que el promedio llega sin filtrar nada.
            </p>
          </div>
          <Button to="/simulacion" icon={<ArrowRight />}>
            Ir a la simulación
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
