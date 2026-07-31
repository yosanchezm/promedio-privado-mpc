import {
  KeyRound,
  Share2,
  ShieldQuestion,
  GitMerge,
  EyeOff,
  Plus,
  Landmark,
} from 'lucide-react';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import {
  SecretSplitDiagram,
  PolynomialDiagram,
  HomomorphismDiagram,
  LagrangeDiagram,
} from '@/components/education/MiniDiagrams';

const P = 'P = 2⁶¹ − 1';

export function ConceptSection() {
  return (
    <Accordion>
      <AccordionItem title="¿Qué es un secreto en este protocolo?" icon={<KeyRound />}>
        <p>
          El secreto es el dato privado de cada empresa: su salario. En todo momento debe
          permanecer oculto para las demás. La idea de Shamir es transformar este dato en
          fragmentos (shares) que individualmente no aportan información, pero que en
          conjunto permiten recuperarlo.
        </p>
        <p className="mt-2">
          Aquí los salarios se representan como números enteros positivos y todo el
          protocolo trabaja sobre el cuerpo finito GF({P}), un campo primo lo bastante
          grande para que ninguna suma desborde.
        </p>
      </AccordionItem>

      <AccordionItem title="¿Qué es un share?" icon={<Share2 />}>
        <p>
          Un share es una pareja (x, y) donde y = f(x) es la evaluación de un polinomio en
          el punto x. Cada empresa reparte <strong>n</strong> shares (uno por participante,
          incluyéndose a sí misma) y conserva el suyo.
        </p>
        <p className="mt-2 font-medium text-mpc-text">
          Propiedad clave: un share aislado no revela el secreto. Hacen falta al menos{' '}
          <strong>t</strong> shares para reconstruirlo.
        </p>
        <div className="mt-4">
          <SecretSplitDiagram />
          <p className="mt-2 text-center text-xs text-mpc-text-tertiary">
            Diagrama ilustrativo: un secreto se convierte en n shares.
          </p>
        </div>
      </AccordionItem>

      <AccordionItem title="¿Qué hace Shamir Secret Sharing?" icon={<ShieldQuestion />}>
        <p>
          Para repartir un secreto <strong>s</strong> con umbral <strong>t</strong> entre{' '}
          <strong>n</strong> participantes, se elige un polinomio aleatorio f(x) de grado{' '}
          <strong>t − 1</strong> cuyo término constante es el secreto:
        </p>
        <div className="my-3 overflow-x-auto rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm text-mpc-text">
          f(x) = s + a₁·x + a₂·x² + … + a<sub>t−1</sub>·x<sup>t−1</sup> (mod P)
        </div>
        <p>
          Los coeficientes a₁, …, a<sub>t−1</sub> se eligen al azar. El share del
          participante <strong>j</strong> es el punto (j, f(j)). Por la teoría de
          interpolación, cualquier subconjunto de <strong>t</strong> puntos determina el
          polinomio (y por tanto s = f(0)), mientras que <strong>t − 1</strong> puntos dejan
          el polinomio completamente indeterminado.
        </p>
        <div className="mt-4">
          <PolynomialDiagram />
          <p className="mt-2 text-center text-xs text-mpc-text-tertiary">
            Diagrama ilustrativo: el secreto es f(0); los shares son puntos del polinomio.
          </p>
        </div>
      </AccordionItem>

      <AccordionItem title="¿Qué hace la interpolación de Lagrange?" icon={<GitMerge />}>
        <p>
          Con <strong>t</strong> puntos (x₁, y₁), …, (xₜ, yₜ) de un polinomio de grado
          t − 1, Lagrange reconstruye su valor en x = 0:
        </p>
        <div className="my-3 overflow-x-auto rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm text-mpc-text">
          f(0) = Σ yᵢ · ℓᵢ(0) &nbsp;con&nbsp; ℓᵢ(0) = ∏<sub>j≠i</sub> (0 − xⱼ) / (xᵢ − xⱼ)
        </div>
        <p>
          En el protocolo, los puntos son las sumas locales F(j) de cada empresa. Interpolar
          esos puntos y evaluar en x = 0 devuelve F(0) = Σ sᵢ, la suma total de salarios.
        </p>
        <div className="mt-4">
          <LagrangeDiagram />
          <p className="mt-2 text-center text-xs text-mpc-text-tertiary">
            Diagrama ilustrativo: t puntos definen F y su valor en x = 0 es el total.
          </p>
        </div>
      </AccordionItem>

      <AccordionItem title="¿Por qué preserva la privacidad?" icon={<EyeOff />}>
        <p>
          Ningún participante ve los datos de los demás. Cada empresa solo posee:
        </p>
        <ul className="mt-2 space-y-1">
          <li>• Su propio salario y su polinomio.</li>
          <li>• Los n shares que recibió (el propio y los de las otras).</li>
          <li>• Su suma local F(j), que combina shares de todos.</li>
        </ul>
        <p className="mt-2">
          Una suma local es la suma de shares de <strong>todas</strong> las empresas, así
          que no permite inferir ningún salario individual. Y con el umbral t &lt; n, para
          reconstruir el total hacen falta al menos t empresas colaborando.
        </p>
      </AccordionItem>

      <AccordionItem title="¿Qué es el homomorfismo aditivo?" icon={<Plus />}>
        <p>
          La operación «compartir» es aditiva: si sumamos los shares con la misma coordenada
          x de varios secretos, obtenemos un share de la suma de los secretos.
        </p>
        <div className="my-3 overflow-x-auto rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm text-mpc-text">
          (f₁(j) + f₂(j) + … + fₙ(j)) mod P = F(j)
        </div>
        <p>
          Esto permite a cada empresa calcular un fragmento del total <strong>sin reunir
          nunca los datos originales</strong>. Es la base del cómputo distribuido seguro:
          los participantes operan sobre fragmentos y el resultado se reconstruye al final.
        </p>
        <div className="mt-4">
          <HomomorphismDiagram />
          <p className="mt-2 text-center text-xs text-mpc-text-tertiary">
            Diagrama ilustrativo: sumar shares equivale a compartir la suma.
          </p>
        </div>
      </AccordionItem>

      <AccordionItem title="¿Por qué solo se revela el resultado final?" icon={<Landmark />}>
        <p>
          El protocolo está diseñado para que la <em>única</em> información nueva que
          aparece sea el resultado (total y promedio). Los datos intermedios — shares y
          sumas locales — son inútiles por separado, y el umbral t garantiza que un grupo
          menor de empresas no pueda coludirse para reconstruir nada.
        </p>
        <p className="mt-2">
          La seguridad se apoya en el azar criptográfico de los coeficientes: cada polinomio
          es distinto en cada ejecución, de modo que los shares no son predecibles.
        </p>
      </AccordionItem>
    </Accordion>
  );
}
