export type Persona = 'Trader' | 'Fan' | 'LP' | 'League Creator';
export type DetailMode = 'beginner' | 'advanced';

export type ContenderSeed = {
  id: string;
  name: string;
  ticker: string;
  badge: string;
  color: string;
  metricLabel: string;
  metricValue: number;
  metricDelta: number;
  weight: number;
  depth: number;
};

export type LeaguePreset = {
  id: 'demo' | 'ai' | 'epl' | 'defi';
  name: string;
  oracleName: string;
  syncCadence: string;
  contenders: ContenderSeed[];
};

export type ContenderState = ContenderSeed & {
  nav: number;
  spot: number;
  x: number;
  y: number;
  rank: number;
};

export type Portfolio = {
  cash: number;
  holdings: Record<string, number>;
  costBasis: Record<string, number>;
  realizedPnl: number;
  startNav: number;
};

export type LPState = {
  principal: number;
  feePool: number;
  parkedScore: number;
  lastTs: number;
};

export type ChangeCard = {
  action: string;
  summary: string;
  bullets: string[];
};

export type TradeResult = {
  ok: boolean;
  message: string;
  change?: ChangeCard;
};
