# Simulación MPC — Promedio Privado

Simulación web interactiva de un protocolo de **computación multiparte segura (MPC)**
para calcular el **salario promedio** de varias empresas **sin revelar ningún salario
individual**. Basado en **Shamir Secret Sharing (SSS)** sobre el campo primo
GF(2⁶¹−1) e interpolación de **Lagrange**.

> Proyecto académico de Criptografía — Universitario Nacional de Colombia.

## ¿Qué demuestra?

El clásico problema del promedio privado: `n` empresas quieren conocer `(s₁ + … + sₙ)/n`
pero ninguna quiere mostrar su valor. El protocolo lo resuelve en tres fases:

1. **Compartir** — cada empresa oculta su salario como el término constante de un
   polinomio aleatorio de grado `t−1` y reparte `n` shares.
2. **Computar** — cada empresa suma los shares que tiene (homomorfismo aditivo): obtiene
   un share de la suma total.
3. **Reconstruir** — con `t` sumas locales, Lagrange interpola el polinomio suma en
   `x = 0` y aparece el promedio. Solo el resultado se hace público.

## Características

- **Simulación paso a paso**: configura `n` y `t`, edita los salarios y recorre el
  protocolo con reproducción automática o control manual.
- **Vista simple y técnica**: explicaciones para todos, con valores reales
  (polinomios, shares, bases de Lagrange) para quien quiera el detalle matemático.
- **Visualizaciones animadas**: los shares viajan entre empresas con partículas.
- **Modo educativo**: sección "Cómo funciona" con conceptos, glosario y preguntas
  frecuentes.
- **Escalabilidad**: métricas de costo de comunicación M(n,t) = n(n−1)+t con gráficas
  de crecimiento cuadrático.
- **Verificación**: el resultado reconstruido se valida contra la suma real y el
  homomorfismo se comprueba de forma explícita.
- **100% frontend**: no hay backend, base de datos, websockets ni terceros. Todo corre
  en el navegador con `crypto.getRandomValues()`.

## Stack

| Capa        | Tecnología                                  |
| ----------- | ------------------------------------------- |
| UI          | React 19 + TypeScript + Tailwind CSS v4     |
| Animaciones | Motion (motion/react)                       |
| Enrutado    | React Router 7 (con lazy-loading por ruta)   |
| Validación  | Zod 4                                       |
| Gráficas    | Recharts                                     |
| Pruebas     | Vitest + Testing Library                    |
| Lint        | Oxlint                                      |
| Build       | Vite 8                                      |

## Requisitos

- Node.js ≥ 20 (el proyecto se probó con Node 22)
- npm ≥ 10

## Instalación y uso

```bash
npm install        # instala dependencias
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run build      # build de producción en dist/
npm run preview    # sirve el build localmente
```

## Pruebas y calidad

```bash
npm run typecheck  # tsc -b --noEmit
npm run lint       # oxlint
npm test           # vitest run (pruebas unitarias)
```

Las pruebas cubren la aritmética del campo, el esquema Shamir, el protocolo completo
(reconstrucción, homomorfismo y privacidad), las métricas de escalabilidad y la
validación de configuración.

## Docker

```bash
npm run docker:build   # docker build -t promedio-privado-mpc .
npm run docker:run     # docker run -p 8080:80 promedio-privado-mpc
```

## Estructura

```
src/
├── components/
│   ├── education/      # Conceptos, glosario y mini-diagramas
│   ├── hero/           # Hero y red de nodos
│   ├── layout/         # AppShell (nav + footer)
│   ├── scalability/    # Métricas y gráficas de costo
│   ├── simulation/     # Panel de configuración, etapas y vista técnica
│   └── ui/             # Kit de UI (Button, Card, Slider, Accordion, …)
├── hooks/              # useSimulation (máquina de pasos)
├── lib/
│   ├── mpc/            # Primitivas criptográficas (campo, Shamir, aleatoriedad)
│   ├── scalability/    # Funciones puras de costo de comunicación
│   ├── simulation/     # Protocolo, formato, tema y tipos
│   ├── utils/          # Utilidades
│   └── validation/     # Esquemas Zod con mensajes en español
├── pages/              # Rutas (carga diferida)
└── styles/             # Tailwind + utilidades de diseño
```

Más detalles en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) y
[docs/PROTOCOLO_MPC.md](docs/PROTOCOLO_MPC.md).
