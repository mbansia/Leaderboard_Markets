import type { LeaguePreset } from '../types/market';

export const LEAGUES: LeaguePreset[] = [
  {
    id: 'ai',
    name: 'AI Models',
    oracleName: 'Benchmark Composite',
    syncCadence: 'Weekly',
    contenders: [
      { id: 'atlas', name: 'Atlas', ticker: 'ATL', badge: 'AT', color: '#0284c7', metricLabel: 'Benchmark score', metricValue: 93.2, metricDelta: 1.2, weight: 0.24, depth: 1.2 },
      { id: 'nova', name: 'Nova', ticker: 'NVA', badge: 'NV', color: '#0ea5e9', metricLabel: 'Benchmark score', metricValue: 90.3, metricDelta: -0.4, weight: 0.2, depth: 1.1 },
      { id: 'quill', name: 'Quill', ticker: 'QLL', badge: 'QL', color: '#6366f1', metricLabel: 'Benchmark score', metricValue: 87.6, metricDelta: 0.8, weight: 0.17, depth: 1.02 },
      { id: 'forge', name: 'Forge', ticker: 'FRG', badge: 'FG', color: '#f59e0b', metricLabel: 'Benchmark score', metricValue: 84.5, metricDelta: -0.6, weight: 0.15, depth: 0.98 },
      { id: 'lyric', name: 'Lyric', ticker: 'LYR', badge: 'LY', color: '#14b8a6', metricLabel: 'Benchmark score', metricValue: 82.1, metricDelta: 0.4, weight: 0.13, depth: 0.95 },
      { id: 'echo', name: 'Echo', ticker: 'ECO', badge: 'EC', color: '#8b5cf6', metricLabel: 'Benchmark score', metricValue: 78.7, metricDelta: -0.2, weight: 0.11, depth: 0.9 },
    ],
  },
  {
    id: 'epl',
    name: 'Premier League',
    oracleName: 'Points Table',
    syncCadence: 'Matchweek',
    contenders: [
      { id: 'city', name: 'Manchester City', ticker: 'MCI', badge: 'MC', color: '#0ea5e9', metricLabel: 'Points', metricValue: 78, metricDelta: 3, weight: 0.23, depth: 1.25 },
      { id: 'arsenal', name: 'Arsenal', ticker: 'ARS', badge: 'AR', color: '#ef4444', metricLabel: 'Points', metricValue: 76, metricDelta: 1, weight: 0.21, depth: 1.14 },
      { id: 'liverpool', name: 'Liverpool', ticker: 'LIV', badge: 'LV', color: '#dc2626', metricLabel: 'Points', metricValue: 74, metricDelta: 0, weight: 0.19, depth: 1.12 },
      { id: 'tottenham', name: 'Tottenham', ticker: 'TOT', badge: 'TT', color: '#1e293b', metricLabel: 'Points', metricValue: 66, metricDelta: -1, weight: 0.14, depth: 1.02 },
      { id: 'newcastle', name: 'Newcastle', ticker: 'NEW', badge: 'NW', color: '#334155', metricLabel: 'Points', metricValue: 63, metricDelta: 2, weight: 0.12, depth: 0.98 },
      { id: 'chelsea', name: 'Chelsea', ticker: 'CHE', badge: 'CH', color: '#2563eb', metricLabel: 'Points', metricValue: 56, metricDelta: 1, weight: 0.11, depth: 0.93 },
    ],
  },
  {
    id: 'defi',
    name: 'Crypto Protocols',
    oracleName: 'TVL Share',
    syncCadence: 'Daily',
    contenders: [
      { id: 'aave', name: 'Aave', ticker: 'AAVE', badge: 'AA', color: '#7c3aed', metricLabel: 'TVL ($B)', metricValue: 11.8, metricDelta: 0.3, weight: 0.22, depth: 1.18 },
      { id: 'uni', name: 'Uniswap', ticker: 'UNI', badge: 'UN', color: '#ec4899', metricLabel: 'TVL ($B)', metricValue: 10.4, metricDelta: 0.1, weight: 0.2, depth: 1.12 },
      { id: 'maker', name: 'Maker', ticker: 'MKR', badge: 'MK', color: '#10b981', metricLabel: 'TVL ($B)', metricValue: 8.9, metricDelta: -0.2, weight: 0.17, depth: 1.05 },
      { id: 'jupiter', name: 'Jupiter', ticker: 'JUP', badge: 'JP', color: '#0ea5e9', metricLabel: 'TVL ($B)', metricValue: 7.3, metricDelta: 0.5, weight: 0.15, depth: 1 },
      { id: 'pendle', name: 'Pendle', ticker: 'PEND', badge: 'PD', color: '#f59e0b', metricLabel: 'TVL ($B)', metricValue: 6.6, metricDelta: 0.2, weight: 0.14, depth: 0.95 },
      { id: 'curve', name: 'Curve', ticker: 'CRV', badge: 'CV', color: '#3b82f6', metricLabel: 'TVL ($B)', metricValue: 5.2, metricDelta: -0.1, weight: 0.12, depth: 0.9 },
    ],
  },
];
