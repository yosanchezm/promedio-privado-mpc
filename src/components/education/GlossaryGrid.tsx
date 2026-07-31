import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface GlossaryEntry {
  term: string;
  definition: ReactNode;
}

const ENTRIES: GlossaryEntry[] = [
  {
    term: 'MPC',
    definition:
      'Computación Multi-Parte Segura: protocolos en los que varias partes calculan una función conjunta sin revelar sus entradas privadas.',
  },
  {
    term: 'Secreto',
    definition:
      'El dato privado de cada empresa (su salario). Nunca se transmite ni se revela durante el protocolo.',
  },
  {
    term: 'Share',
    definition:
      'Fragmento (x, y) de un secreto. Un share aislado no revela nada; hacen falta t shares para recuperar el secreto.',
  },
  {
    term: 'Shamir Secret Sharing',
    definition:
      'Esquema (t, n) que reparte un secreto en n fragmentos usando un polinomio aleatorio de grado t − 1.',
  },
  {
    term: 'Umbral (t, n)',
    definition:
      'Con t de los n participantes es posible reconstruir el secreto; con menos de t es imposible.',
  },
  {
    term: 'Campo primo GF(P)',
    definition: `Aritmética módulo P = 2⁶¹ − 1 (primo de Mersenne). Todas las operaciones del protocolo se hacen en este cuerpo.`,
  },
  {
    term: 'Término constante',
    definition:
      'El coeficiente a₀ del polinomio. En Shamir, es exactamente el secreto compartido.',
  },
  {
    term: 'Polinomio de grado t − 1',
    definition:
      'El polinomio aleatorio que codifica cada secreto. Un polinomio de grado d queda determinado por d + 1 puntos.',
  },
  {
    term: 'Interpolación de Lagrange',
    definition:
      'Técnica para reconstruir el polinomio a partir de t puntos y evaluarlo en cualquier x (en particular en x = 0).',
  },
  {
    term: 'Homomorfismo aditivo',
    definition:
      'Propiedad por la cual sumar shares de varios secretos produce un share de la suma de los secretos.',
  },
  {
    term: 'Promedio privado',
    definition:
      'El problema resuelto: calcular la media de n valores sin revelar ninguno de ellos.',
  },
  {
    term: 'Complejidad O(n²)',
    definition:
      'El costo de comunicación crece con el cuadrado del número de empresas: cada una envía n − 1 mensajes.',
  },
];

export function GlossaryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ENTRIES.map((entry) => (
        <Card key={entry.term} className="p-5">
          <h3 className="font-mono text-sm font-bold text-mpc-primary">{entry.term}</h3>
          <p className="mt-2 text-sm leading-relaxed text-mpc-text-secondary">{entry.definition}</p>
        </Card>
      ))}
    </div>
  );
}
