/**
 * Visual palette per company. Companies cycle through the four node colors
 * defined in the Tailwind theme (mpc-node-1..4). Class names are written as
 * literal strings so Tailwind can statically detect them.
 */
export interface NodePalette {
  /** Filled dot / icon background. */
  solid: string;
  /** Soft card background. */
  bg: string;
  /** Text / icon color. */
  text: string;
  /** Border accent. */
  border: string;
  /** Soft glow ring used around active cards. */
  ring: string;
  /** Solid hex color used for particles and charts. */
  hex: string;
}

const PALETTES: NodePalette[] = [
  {
    solid: 'bg-mpc-node-1',
    bg: 'bg-mpc-node-1-bg',
    text: 'text-mpc-node-1',
    border: 'border-mpc-node-1',
    ring: 'ring-mpc-node-1',
    hex: '#4f46e5',
  },
  {
    solid: 'bg-mpc-node-2',
    bg: 'bg-mpc-node-2-bg',
    text: 'text-mpc-node-2',
    border: 'border-mpc-node-2',
    ring: 'ring-mpc-node-2',
    hex: '#7c3aed',
  },
  {
    solid: 'bg-mpc-node-3',
    bg: 'bg-mpc-node-3-bg',
    text: 'text-mpc-node-3',
    border: 'border-mpc-node-3',
    ring: 'ring-mpc-node-3',
    hex: '#06b6d4',
  },
  {
    solid: 'bg-mpc-node-4',
    bg: 'bg-mpc-node-4-bg',
    text: 'text-mpc-node-4',
    border: 'border-mpc-node-4',
    ring: 'ring-mpc-node-4',
    hex: '#10b981',
  },
];

/** Returns the palette for a 1-based company index. */
export function nodePalette(index: number): NodePalette {
  return PALETTES[(index - 1 + PALETTES.length) % PALETTES.length];
}
