import type { Share } from '@/lib/mpc';

/**
 * User-configurable parameters of the simulation.
 */
export interface SimConfig {
  /** Number of participating companies (3..15). */
  n: number;
  /** Threshold: minimum number of local sums required to reconstruct. */
  t: number;
  /** Individual salaries (plain values, one per company). */
  salaries: number[];
}

/**
 * Phases of the MPC protocol as shown in the timeline.
 */
export type SimPhase = 'sharing' | 'computing' | 'reconstructing' | 'result';

/**
 * Display mode of the simulation interface.
 */
export type ViewMode = 'simple' | 'technical';

/**
 * A share received by one company from another, keeping its origin.
 */
export interface ReceivedShare {
  /** 1-based index of the sender company. */
  from: number;
  /** The share payload (x = receiver point, y = f_from(x)). */
  share: Share;
}

/**
 * Complete per-company state after running the protocol.
 */
export interface CompanyState {
  /** 1-based index. */
  index: number;
  name: string;
  /** Private salary (the secret encoded as constant term). */
  secret: bigint;
  /** Polynomial coefficients [c0, c1, ..., c_{t-1}], c0 = secret, as decimal strings (BigInt-safe for React props). */
  coefficients: string[];
  /** Share the company keeps for itself (x = index). */
  ownShare: Share;
  /** Shares sent to the other companies (n - 1 items). */
  outgoingShares: Share[];
  /** Shares received from the other companies (n - 1 items). */
  receivedShares: ReceivedShare[];
  /** Local sum F(index) = sum over all companies of f_i(index) mod P. */
  localSum: bigint;
}

/**
 * Full precomputed result of one protocol run.
 */
export interface SimData {
  config: SimConfig;
  /** P = 2^61 - 1, the field prime used for every operation. */
  prime: bigint;
  companies: CompanyState[];
  /** The t local-sum points used for reconstruction (x = 1..t). */
  reconstructionPoints: Share[];
  /** Lagrange basis values l_i(0) ... as decimal strings (BigInt-safe for React props). */
  basis: string[];
  totalReconstructed: bigint;
  /** Average as a plain number; may be fractional. */
  average: number;
  /** True when totalReconstructed is divisible by n. */
  averageIsExact: boolean;
  /** Sanity check: reconstructed total equals the plain sum of salaries. */
  reconstructionVerified: boolean;
  /** Human note about the t = 1 special case, when applicable. */
  reconstructionNote?: string;
}

/**
 * A single typed step of the animated simulation.
 */
export interface SimStep {
  id: string;
  phase: SimPhase;
  title: string;
  description: string;
  /** Detailed technical content rendered only in the technical view. */
  technical?: string;
  /** 1-based company this step belongs to, when relevant. */
  companyIndex?: number;
  payload?: {
    points?: Share[];
    basis?: string[];
    total?: bigint;
    average?: number;
    averageIsExact?: boolean;
    localSum?: bigint;
    sentShares?: Share[];
  };
}
