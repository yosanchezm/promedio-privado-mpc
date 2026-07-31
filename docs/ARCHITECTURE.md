# Arquitectura de la aplicación

Aplicación de una sola página (SPA) 100% cliente. No hay backend, base de datos,
websockets ni servicios externos: toda la criptografía se ejecuta en el navegador.

## Flujo de datos

```
Config (n, t, salarios)
        │
        ▼
src/lib/validation/simulation.ts   ── Zod: valida y devuelve errores en español
        │
        ▼
src/lib/simulation/protocol.ts     ── runProtocol(): ejecuta el protocolo completo
        │                            (usa las primitivas de src/lib/mpc)
        ▼
SimData (estado inmutable del protocolo)
        │
        ├── src/hooks/useSimulation.ts   ── construye los pasos y controla la reproducción
        │
        └── src/pages/SimulationPage.tsx ── orquesta las etapas visuales
```

## Capas

### 1. Primitivas criptográficas — `src/lib/mpc/`

Núcleo reutilizable, independiente de la UI. **No depende de nada más.**

- `field.ts` — aritmética modular sobre P = 2⁶¹−1 (mod, addMod, subMod, multiplyMod,
  powerMod, modularInverse).
- `random.ts` — `randomBigInt()` con `crypto.getRandomValues()` (nunca `Math.random()`).
- `shamir.ts` — `generatePolynomial`, `evaluatePolynomial`, `generateShares`,
  `addShares`, `reconstructAtZero`.

### 2. Protocolo de aplicación — `src/lib/simulation/`

- `types.ts` — contratos de tipos: `SimConfig`, `SimData`, `CompanyState`, `SimStep`,
  `ViewMode`.
- `protocol.ts` — `runProtocol(n, t, salaries)`: reparto de shares, suma local
  (homomorfismo aditivo), reconstrucción por Lagrange y verificación explícita
  (`reconstructionVerified`). Exporta también `lagrangeBasisAtZero()` para la vista
  técnica.
- `example.ts` — configuración por defecto y generación de datos aleatorios.
- `format.ts` — formateo de BigInt, polinomios, shares, promedios y primos.
- `theme.ts` — paleta por empresa (clases Tailwind literales para detección del
  compilador).

### 3. Estado y lógica de presentación — `src/hooks/useSimulation.ts`

- Construye la lista de pasos con `buildSteps(data)`. Índices de paso:
  - Compartir: `gen-i` = `(i−1)·2`, `send-i` = `(i−1)·2+1`.
  - Computar: `compute-i` = `2n + (i−1)`.
  - Reconstruir: `collect` = `3n`, `lagrange` = `3n+1`, `total` = `3n+2`.
  - Resultado: paso final `result`.
- Máquina de estados `idle | running | paused | done` con reproducción automática,
  velocidad 0.5×/1×/2× y navegación anterior/siguiente.
- Los atajos de teclado (Espacio, ←, →) se registran en `ControlsBar`.

### 4. UI

- `src/components/ui/` — kit de componentes accesibles (Button con variantes y enlaces,
  Card, Badge, Slider, NumberField, SegmentedControl, Stepper, Tooltip, Accordion,
  MetricCard, KeyboardHint).
- `src/components/simulation/` — panel de configuración, barra de controles, línea de
  fases y una etapa por fase del protocolo (DistributionStage, LocalComputationStage,
  ReconstructionStage, ResultReveal), más KnowledgePanel y TechDetailTables.
- `src/components/education/` — ConceptSection (acordeones), GlossaryGrid y
  MiniDiagrams (SVG ilustrativos).
- `src/components/scalability/` — ScalabilityMetrics, CostChart (Recharts) y
  GrowthTable.
- `src/pages/` — una página por ruta, con **carga diferida** (React.lazy).

## Rutas

| Ruta              | Página               | Contenido                                   |
| ----------------- | -------------------- | ------------------------------------------- |
| `/`               | HomePage             | Problema, fases e ideas clave               |
| `/simulacion`     | SimulationPage       | El protocolo paso a paso                    |
| `/como-funciona`  | HowItWorksPage       | Conceptos, glosario y FAQ                   |
| `/escalabilidad`  | ScalabilityPage      | Costos de comunicación y crecimiento O(n²)  |
| `/conclusiones`   | ConclusionsPage      | Aprendizajes y limitaciones                 |
| `*`               | NotFoundPage         | 404                                         |

## Decisiones

- **Sin backend**: la simulación es educativa; el protocolo real ocurre íntegramente en
  el cliente para que cualquier persona pueda reproducir y auditar cada valor.
- **Estado inmutable**: `SimData` se calcula una sola vez por configuración; los pasos
  solo referencian esos datos, garantizando consistencia entre las vistas.
- **Consistencia polinomio/shares**: los shares se evalúan a partir del mismo polinomio
  que se muestra, para que nunca haya datos "inventados" en la interfaz.
- **Código en inglés, UI en español**: los identificadores y comentarios están en
  inglés; todos los textos visibles y los mensajes de validación están en español
  neutro.
- **Accesibilidad**: navegación por teclado, `aria-*`, `prefers-reduced-motion` y
  estructura semántica.
