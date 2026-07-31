import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';

const SimulationPage = lazy(() =>
  import('@/pages/SimulationPage').then((m) => ({ default: m.SimulationPage })),
);
const HowItWorksPage = lazy(() =>
  import('@/pages/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage })),
);
const ScalabilityPage = lazy(() =>
  import('@/pages/ScalabilityPage').then((m) => ({ default: m.ScalabilityPage })),
);
const ConclusionsPage = lazy(() =>
  import('@/pages/ConclusionsPage').then((m) => ({ default: m.ConclusionsPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-mpc-border border-t-mpc-primary" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/simulacion" element={<SimulationPage />} />
            <Route path="/como-funciona" element={<HowItWorksPage />} />
            <Route path="/escalabilidad" element={<ScalabilityPage />} />
            <Route path="/conclusiones" element={<ConclusionsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}
