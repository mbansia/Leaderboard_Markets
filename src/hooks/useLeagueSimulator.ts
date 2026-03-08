import { useMemo, useState } from 'react';
import { leaguePresets, type LeaguePreset } from '../data/leagues';

export type TradeSide = 'buy' | 'sell';
export type Tx = { id: number; detail: string; amount: number; side: TradeSide; contender: string };

const normalizeWeights = (weights: number[]) => {
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => w / sum);
};

export function useLeagueSimulator() {
  const [presetId, setPresetId] = useState(leaguePresets[0].id);
  const preset = useMemo<LeaguePreset>(() => leaguePresets.find((p) => p.id === presetId) ?? leaguePresets[0], [presetId]);
  const [contenders, setContenders] = useState(preset.contenders);
  const [reserveDepth, setReserveDepth] = useState(1);
  const [portfolioUsd, setPortfolioUsd] = useState(10000);
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [txs, setTxs] = useState<Tx[]>([]);

  const resetToPreset = (id = presetId) => {
    const p = leaguePresets.find((x) => x.id === id) ?? leaguePresets[0];
    setPresetId(p.id);
    setContenders(p.contenders);
    setReserveDepth(1);
    setPortfolioUsd(10000);
    setPositions({});
    setTxs([]);
  };

  const switchPreset = (id: string) => resetToPreset(id);

  const executeTrade = (id: string, usdc: number, side: TradeSide) => {
    const c = contenders.find((x) => x.id === id);
    if (!c || usdc <= 0) return null;
    const depthFactor = c.depth * reserveDepth * 4000;
    const impact = Math.min(0.18, usdc / depthFactor);
    const signedImpact = side === 'buy' ? impact : -impact;
    const avgPrice = c.spot * (1 + signedImpact * 0.5);
    const qty = usdc / avgPrice;
    setContenders((prev) => prev.map((row) => (row.id === id ? { ...row, spot: Math.max(0.02, row.spot * (1 + signedImpact)) } : row)));
    setPortfolioUsd((v) => v + (side === 'sell' ? usdc : -usdc));
    setPositions((p) => ({ ...p, [id]: (p[id] ?? 0) + (side === 'buy' ? qty : -qty) }));
    setTxs((prev) => [{ id: Date.now(), detail: `${side.toUpperCase()} ${c.ticker}`, amount: usdc, side, contender: id }, ...prev].slice(0, 12));
    return { qty, avgPrice, slippage: impact * 100 };
  };

  const syncOracle = () => {
    const randomWeights = contenders.map((c) => Math.max(0.04, c.weight * (0.9 + Math.random() * 0.2)));
    const normalized = normalizeWeights(randomWeights);
    setContenders((prev) =>
      prev.map((c, i) => ({
        ...c,
        weight: normalized[i],
        spot: normalized[i],
      })),
    );
  };

  const injectLiquidity = (factor: number) => setReserveDepth((d) => Math.min(3, Math.max(0.5, d + factor)));

  return {
    preset,
    contenders,
    reserveDepth,
    portfolioUsd,
    positions,
    txs,
    switchPreset,
    executeTrade,
    syncOracle,
    injectLiquidity,
    resetToPreset,
  };
}
