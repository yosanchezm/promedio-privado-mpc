import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Award, Target } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const LEARNINGS = [
  {
    title: 'Privacidad sin confianza',
    text: 'El promedio se calculó correctamente y nadie vio los salarios individuales. La seguridad es matemática, no contractual.',
  },
  {
    title: 'El umbral es poder',
    text: 'Elegir t decide el equilibrio entre disponibilidad (t bajo) y seguridad (t alto). Con t = n, todos deben colaborar.',
  },
  {
    title: 'Sumar shares es sumar secretos',
    text: 'El homomorfismo aditivo de Shamir convierte la suma privada en una operación local trivial sobre fragmentos.',
  },
  {
    title: 'El costo es real',
    text: 'La distribución O(n²) hace que la escalabilidad sea la principal limitación práctica del protocolo.',
  },
  {
    title: 'GF(2⁶¹−1) importa',
    text: 'Trabajar en un campo primo enorme garantiza que los shares parezcan aleatorios y la interpolación sea exacta.',
  },
];

const LIMITATIONS = [
  'Los participantes son semi-honestos: siguen el protocolo pero son curiosos. Un adversario malicioso que no siga las reglas rompe el esquema básico.',
  'La sincronía: el protocolo asume canales confiables y orden de mensajes. En redes reales hacen falta re-transmisiones y acuse de recibo.',
  'El costo de comunicación cuadrático limita el número práctico de empresas.',
  'El promedio es exacto solo cuando la suma es divisible entre n; en otro caso aparece un decimal.',
];

export function ConclusionsPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="radial-glow right-[-8%] top-[-8%] h-72 w-72 bg-indigo-400" />
        <div className="radial-glow left-[-10%] top-[40%] h-64 w-64 bg-violet-400" />
        <div className="bg-grid-pattern absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge tone="success">Conclusiones</Badge>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-mpc-text sm:text-4xl">
            ¿Qué aprendimos?
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-mpc-text-secondary">
            Después de simular el protocolo completo, estas son las conclusiones técnicas
            y las limitaciones que hay que tener presentes.
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 space-y-4"
        >
          {LEARNINGS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <Card interactive className="flex items-start gap-4">
                <span className="mt-0.5 shrink-0 text-mpc-success">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-bold text-mpc-text">{item.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-mpc-text-secondary">{item.text}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-mpc-text">
            <Award className="h-6 w-6 text-mpc-primary" aria-hidden="true" />
            Limitaciones del modelo
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {LIMITATIONS.map((text) => (
              <Card key={text} className="flex items-start gap-3 bg-white/70">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-mpc-warning" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-mpc-text-secondary">{text}</p>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-12 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-mpc-primary shadow-sm">
                <Target className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-mpc-text">Cierre</p>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-mpc-text-secondary">
                  Esta simulación demuestra de forma interactiva que la computación multiparte
                  resuelve un problema real con elegancia matemática: el resultado es correcto,
                  verificable y la privacidad nunca se negocia.
                </p>
              </div>
            </div>
            <Link
              to="/simulacion"
              className="inline-flex items-center gap-2 rounded-xl bg-mpc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-mpc-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mpc-primary"
            >
              Revisar la simulación
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
