# Protocolo MPC para el promedio privado

## Notación

- `n` — número de empresas participantes.
- `t` — umbral: número de sumas locales necesarias para reconstruir (1 ≤ t ≤ n).
- `sᵢ` — salario (secreto) de la empresa `i`.
- `P = 2⁶¹ − 1 = 2305843009213693951` — campo primo GF(P).
- `fᵢ(x) = sᵢ + aᵢ₁·x + aᵢ₂·x² + … + aᵢ,ₜ₋₁·xᵗ⁻¹ (mod P)` — polinomio aleatorio de la
  empresa `i`, de grado `t − 1`, con el salario como término constante.

## Propiedad de Shamir

Un polinomio de grado `t − 1` queda determinado por **cualquier** subconjunto de `t`
puntos. Por tanto:

- Con `t` shares se recupera `sᵢ = fᵢ(0)`.
- Con `t − 1` shares, el secreto es matemáticamente indeterminado (cada posible valor
  tiene el mismo número de polinomios compatibles).

## Homomorfismo aditivo

Si `F(x) = Σᵢ fᵢ(x)` (suma coeficiente a coeficiente, mod P), entonces
`F(0) = Σᵢ sᵢ`. Además, para cada punto:

```
F(j) = Σᵢ fᵢ(j)  (mod P)
```

Es decir: **la suma de los shares en la misma coordenada es un share de la suma de los
secretos**. Por eso cada empresa puede aportar `F(j)` sin ver los salarios.

## El protocolo

### Fase 1 — Compartir

Para cada empresa `i` (1 ≤ i ≤ n):

1. Genera `fᵢ(x)` de grado `t − 1` con término constante `sᵢ` (coeficientes
   aleatorios con `crypto.getRandomValues()`).
2. Evalúa `n` shares `(j, fᵢ(j))` para `j = 1 … n`.
3. Conserva su share propio y envía el share `j` a la empresa `j`.

### Fase 2 — Computar (local)

La empresa `j` suma todos los shares que tiene (el propio y los `n − 1` recibidos):

```
F(j) = f₁(j) + … + fₙ(j)  (mod P)
```

Este valor es su "suma local". Por el homomorfismo, `F(j)` es un punto del polinomio
suma `F`.

### Fase 3 — Reconstruir

1. Se recolectan `t` sumas locales, por ejemplo `F(1) … F(t)`.
2. Se interpolan con Lagrange en `x = 0`:

```
ℓᵢ(0) = ∏ⱼ₌ᵢ (0 − xⱼ) / (xᵢ − xⱼ)   (mod P)
F(0)   = Σᵢ yᵢ · ℓᵢ(0)                 (mod P)
```

3. `F(0) = Σ sᵢ` es la suma total.
4. El promedio es `F(0) / n` (con dos decimales cuando no es divisible).

### Caso especial t = 1

Con `t = 1` cada polinomio tiene grado 0 (constante `sᵢ`), de modo que `F(x) = Σ sᵢ`
para todo `x` y **una sola** suma local determina el total. `runProtocol` marca este
caso con una nota explicativa.

## Privacidad

- Ningún share individual revela `sᵢ`: un punto de un polinomio de grado ≥ 1 no
  determina su término constante.
- Ninguna empresa ve los datos de las demás: solo recibe shares (puntos de polinomios
  ajenos) y su propia suma local, que mezcla shares de todas.
- Con menos de `t` sumas locales, la reconstrucción es imposible (propiedad de Shamir).

## Verificación en la implementación

`runProtocol` valida internamente tres invariantes y los expone en
`SimData.reconstructionVerified`:

1. `totalReconstructed === Σ sᵢ` (reconstrucción correcta).
2. `Σ yᵢ·ℓᵢ(0) mod P === Σ sᵢ` (los valores de Lagrange exhibidos son consistentes).
3. Homomorfismo: `evaluatePolynomial(Σᵢ coeficientes, j) === F(j)` para toda empresa
   (las sumas locales coinciden con el polinomio suma).

## Modelo de adversario

El esquema asume participantes **semi-honestos** (honest-but-curious): siguen el
protocolo correctamente pero pueden intentar aprender de la información recibida. Bajo
este modelo, el protocolo garantiza que un subconjunto de menos de `t` empresas no puede
inferir ningún salario individual.

## Costo de comunicación

- Shares generados: `n²`.
- Mensajes de distribución: `n(n − 1)`.
- Mensajes de reconstrucción: `t`.
- Total: **M(n, t) = n(n − 1) + t** — crece de forma cuadrática con `n`, la principal
  limitación práctica de escalabilidad.
