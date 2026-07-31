/**
 * Small pedagogical SVG diagrams used in the educational pages.
 * They are illustrative and always labeled as such in the UI.
 */

export function SecretSplitDiagram() {
  return (
    <svg viewBox="0 0 320 120" className="mx-auto h-40 w-full max-w-sm" aria-hidden="true">
      <rect x="110" y="18" width="100" height="40" rx="12" fill="#eef2ff" stroke="#4f46e5" />
      <text x="160" y="43" textAnchor="middle" fontSize="12" fontWeight="600" fill="#4f46e5">
        Secreto s
      </text>

      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={160}
          y1={58}
          x2={40 + i * 80}
          y2={88}
          stroke="#7c3aed"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
      ))}

      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={20 + i * 80} y={88} width="56" height="24" rx="8" fill="#f5f3ff" stroke="#7c3aed" />
          <text x={48 + i * 80} y={104} textAnchor="middle" fontSize="10" fontWeight="600" fill="#7c3aed">
            share {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function PolynomialDiagram() {
  return (
    <svg viewBox="0 0 320 150" className="mx-auto h-44 w-full max-w-sm" aria-hidden="true">
      <line x1="20" y1="120" x2="300" y2="120" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="40" y1="10" x2="40" y2="140" stroke="#cbd5e1" strokeWidth="1" />

      <path
        d="M40 30 C 120 100, 200 20, 300 70"
        fill="none"
        stroke="#06b6d4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <circle cx="40" cy="30" r="5" fill="#4f46e5" />
      <text x="48" y="24" fontSize="11" fontWeight="700" fill="#4f46e5">
        s = f(0)
      </text>
      <text x="6" y="14" fontSize="9" fill="#94a3b8">
        x = 0
      </text>

      {[
        { x: 120, y: 100 },
        { x: 200, y: 20 },
        { x: 300, y: 70 },
      ].map((point, i) => (
        <g key={i}>
          <circle cx={point.x} cy={point.y} r="4" fill="#7c3aed" />
          <text x={point.x - 8} y={point.y + 18} fontSize="10" fill="#64748b">
            ({i + 1}, f({i + 1}))
          </text>
        </g>
      ))}
    </svg>
  );
}

export function HomomorphismDiagram() {
  return (
    <svg viewBox="0 0 320 120" className="mx-auto h-36 w-full max-w-sm" aria-hidden="true">
      <g>
        <text x="20" y="30" fontSize="12" fontWeight="700" fill="#4f46e5">
          f₁(x)
        </text>
        <text x="20" y="50" fontSize="12" fontWeight="700" fill="#7c3aed">
          f₂(x)
        </text>
        <text x="20" y="70" fontSize="12" fontWeight="700" fill="#06b6d4">
          f₃(x)
        </text>
      </g>

      <line x1="150" y1="22" x2="170" y2="55" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="150" y1="44" x2="170" y2="57" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="150" y1="66" x2="170" y2="59" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />

      <rect x="172" y="40" width="130" height="34" rx="10" fill="#ecfeff" stroke="#06b6d4" />
      <text x="237" y="52" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0891b2">
        F(x) = Σ fᵢ(x)
      </text>
      <text x="237" y="66" textAnchor="middle" fontSize="9" fill="#67e8f9">
        suma local de cada empresa
      </text>

      <rect x="180" y="90" width="114" height="24" rx="8" fill="#d1fae5" stroke="#10b981" />
      <text x="237" y="106" textAnchor="middle" fontSize="10" fontWeight="600" fill="#059669">
        F(0) = Σ salarios
      </text>
      <line x1="237" y1="74" x2="237" y2="90" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}

export function LagrangeDiagram() {
  return (
    <svg viewBox="0 0 320 150" className="mx-auto h-44 w-full max-w-sm" aria-hidden="true">
      <line x1="20" y1="120" x2="300" y2="120" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="40" y1="10" x2="40" y2="140" stroke="#cbd5e1" strokeWidth="1" />

      {[
        { x: 100, y: 100 },
        { x: 180, y: 55 },
        { x: 260, y: 80 },
      ].map((point, i) => (
        <g key={i}>
          <circle cx={point.x} cy={point.y} r="4.5" fill="#7c3aed" />
          <text x={point.x - 20} y={point.y + 18} fontSize="10" fill="#64748b">
            (x, F(x))
          </text>
        </g>
      ))}

      <path
        d="M40 30 C 70 105, 100 100, 100 100 C 140 80, 160 60, 180 55 C 210 48, 240 78, 260 80"
        fill="none"
        stroke="#4f46e5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 4"
      />

      <circle cx="40" cy="30" r="5" fill="#10b981" />
      <text x="48" y="24" fontSize="11" fontWeight="700" fill="#059669">
        S = F(0)
      </text>
      <text x="120" y="22" fontSize="9" fill="#94a3b8">
        Lagrange con t puntos
      </text>
    </svg>
  );
}
