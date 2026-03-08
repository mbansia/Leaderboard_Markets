export type Contender = {
  id: string;
  name: string;
  ticker: string;
  mark: string;
  weight: number;
  spot: number;
  depth: number;
};

export type LeaguePreset = {
  id: string;
  name: string;
  unit: string;
  contenders: Contender[];
};

export const leaguePresets: LeaguePreset[] = [
  {
    id: 'ai',
    name: 'AI Models',
    unit: 'Model Share',
    contenders: [
      { id: 'atlas', name: 'Atlas', ticker: 'ATL', mark: 'A', weight: 0.22, spot: 0.228, depth: 1.2 },
      { id: 'nova', name: 'Nova', ticker: 'NVA', mark: 'N', weight: 0.18, spot: 0.174, depth: 1.15 },
      { id: 'quill', name: 'Quill', ticker: 'QLL', mark: 'Q', weight: 0.16, spot: 0.168, depth: 1.05 },
      { id: 'forge', name: 'Forge', ticker: 'FRG', mark: 'F', weight: 0.14, spot: 0.137, depth: 0.98 },
      { id: 'lyric', name: 'Lyric', ticker: 'LYR', mark: 'L', weight: 0.12, spot: 0.118, depth: 1.02 },
      { id: 'pulse', name: 'Pulse', ticker: 'PLS', mark: 'P', weight: 0.1, spot: 0.103, depth: 0.95 },
      { id: 'echo', name: 'Echo', ticker: 'ECO', mark: 'E', weight: 0.08, spot: 0.072, depth: 0.88 },
    ],
  },
  {
    id: 'epl',
    name: 'Premier League',
    unit: 'Standing Share',
    contenders: [
      { id: 'city', name: 'Manchester City', ticker: 'MCI', mark: 'MC', weight: 0.21, spot: 0.218, depth: 1.28 },
      { id: 'ars', name: 'Arsenal', ticker: 'ARS', mark: 'AR', weight: 0.19, spot: 0.185, depth: 1.18 },
      { id: 'liv', name: 'Liverpool', ticker: 'LIV', mark: 'LI', weight: 0.17, spot: 0.176, depth: 1.2 },
      { id: 'tot', name: 'Tottenham', ticker: 'TOT', mark: 'TO', weight: 0.14, spot: 0.138, depth: 1.01 },
      { id: 'new', name: 'Newcastle', ticker: 'NEW', mark: 'NE', weight: 0.12, spot: 0.117, depth: 0.96 },
      { id: 'che', name: 'Chelsea', ticker: 'CHE', mark: 'CH', weight: 0.1, spot: 0.095, depth: 0.9 },
      { id: 'bha', name: 'Brighton', ticker: 'BHA', mark: 'BR', weight: 0.07, spot: 0.071, depth: 0.86 },
    ],
  },
  {
    id: 'defi',
    name: 'Crypto Protocols',
    unit: 'TVL Share',
    contenders: [
      { id: 'aave', name: 'Aave', ticker: 'AAVE', mark: 'AA', weight: 0.2, spot: 0.192, depth: 1.17 },
      { id: 'uni', name: 'Uniswap', ticker: 'UNI', mark: 'UN', weight: 0.18, spot: 0.184, depth: 1.13 },
      { id: 'maker', name: 'Maker', ticker: 'MKR', mark: 'MK', weight: 0.16, spot: 0.158, depth: 1.1 },
      { id: 'pendle', name: 'Pendle', ticker: 'PEND', mark: 'PE', weight: 0.14, spot: 0.146, depth: 0.99 },
      { id: 'jupiter', name: 'Jupiter', ticker: 'JUP', mark: 'JU', weight: 0.12, spot: 0.116, depth: 0.96 },
      { id: 'ethena', name: 'Ethena', ticker: 'ENA', mark: 'EN', weight: 0.11, spot: 0.104, depth: 0.93 },
      { id: 'curve', name: 'Curve', ticker: 'CRV', mark: 'CR', weight: 0.09, spot: 0.1, depth: 0.89 },
    ],
  },
];
