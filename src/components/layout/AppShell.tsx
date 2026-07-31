import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sigma, GraduationCap } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/simulacion', label: 'Simulación' },
  { to: '/como-funciona', label: 'Cómo funciona' },
  { to: '/escalabilidad', label: 'Escalabilidad' },
  { to: '/conclusiones', label: 'Conclusiones' },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    scrollToTop();
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-mpc-bg">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-mpc-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-40 border-b border-mpc-border/70 bg-white/80 backdrop-blur-lg">
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
          aria-label="Navegación principal"
        >
          <NavLink to="/" className="flex items-center gap-2.5 text-mpc-text">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-mpc-primary to-mpc-accent text-white shadow-md shadow-indigo-500/30">
              <Sigma className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-tight sm:text-base">
                Promedio Privado MPC
              </span>
              <span className="block text-[0.65rem] font-medium text-mpc-text-tertiary">
                Simulación educativa
              </span>
            </span>
          </NavLink>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-mpc-primary'
                        : 'text-mpc-text-secondary hover:bg-mpc-border-light hover:text-mpc-text',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive ? (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 -z-10 rounded-xl bg-indigo-50"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      ) : null}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-mpc-border text-mpc-text lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              id="menu-movil"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-mpc-border/70 bg-white lg:hidden"
            >
              <ul className="flex flex-col gap-1 px-4 py-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-xl px-4 py-2.5 text-sm font-medium',
                          isActive
                            ? 'bg-indigo-50 text-mpc-primary'
                            : 'text-mpc-text-secondary hover:bg-mpc-border-light',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main id="contenido" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-mpc-border/70 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
          <div className="flex items-center justify-center gap-2 text-sm text-mpc-text-secondary sm:justify-start">
            <GraduationCap className="h-4 w-4 text-mpc-primary" aria-hidden="true" />
            <span>
              Proyecto académico de Criptografía — Universitario Nacional de Colombia
            </span>
          </div>
          <p className="text-xs text-mpc-text-tertiary">
            Promedio privado con Shamir Secret Sharing · Campo GF(2⁶¹−1) · Sin datos reales
          </p>
        </div>
      </footer>
    </div>
  );
}
