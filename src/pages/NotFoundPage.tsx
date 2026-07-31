import { motion } from 'motion/react';
import { Compass, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="radial-glow left-1/2 top-[-10%] h-72 w-72 -translate-x-1/2 bg-indigo-400" />
        <div className="bg-grid-pattern absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>
      <div className="relative mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-mpc-primary shadow-sm">
            <Compass className="h-8 w-8" aria-hidden="true" />
          </span>
          <h1 className="mt-6 font-mono text-6xl font-extrabold tracking-tight text-gradient">
            404
          </h1>
          <p className="mt-3 text-lg font-bold text-mpc-text">Esta página no existe</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-mpc-text-secondary">
            El enlace que seguiste no apunta a ninguna sección de la simulación. Vuelve al
            inicio o revisa la URL.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/" icon={<Home />}>
              Volver al inicio
            </Button>
            <Button to="/simulacion" variant="secondary">
              Ir a la simulación
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
