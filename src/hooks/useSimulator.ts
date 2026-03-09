import { useMemo, useState } from 'react';

type Token = { name: string; metric: number; weight: number; nav: number; spot: number; holdings: number };

const presets = {
  ai: ['Model A', 'Model B', 'Model C'],
  crypto: ['Proto A', 'Proto B', 'Proto C'],
  football: ['Club A', 'Club B', 'Club C']
} as const;

export function useSimulator() {
  const [vertical, setVertical] = useState<keyof typeof presets>('ai');
  const [cash, setCash] = useState(1000);
  const [tokens, setTokens] = useState<Token[]>([
    { name: 'A', metric: 100, weight: 33.33, nav: 333.33, spot: 333.33, holdings: 0 },
    { name: 'B', metric: 100, weight: 33.33, nav: 333.33, spot: 333.33, holdings: 0 },
    { name: 'C', metric: 100, weight: 33.33, nav: 333.33, spot: 333.33, holdings: 0 }
  ]);

  const buy = (i: number, amount: number) => {
    if (amount <= 0 || amount > cash) return;
    setCash((c) => c - amount);
    setTokens((prev) => prev.map((t, idx) => idx === i ? { ...t, holdings: t.holdings + amount / t.spot, spot: t.spot * 1.02 } : { ...t, spot: t.spot * 0.99 }));
  };

  const sell = (i: number, amountToken: number) => {
    setTokens((prev) => prev.map((t, idx) => idx === i && amountToken <= t.holdings ? { ...t, holdings: t.holdings - amountToken, spot: t.spot * 0.98 } : t));
    const target = tokens[i];
    if (target && amountToken <= target.holdings) setCash((c) => c + amountToken * target.spot);
  };

  const sync = () => setTokens((prev) => prev.map((t) => ({ ...t, spot: t.nav })));
  const injectLP = () => setTokens((prev) => prev.map((t) => ({ ...t, spot: t.spot * 0.995 })));
  const reset = () => {
    setCash(1000);
    setTokens((prev) => prev.map((t, i) => ({ ...t, name: ['A', 'B', 'C'][i], metric: 100, weight: 33.33, nav: 333.33, spot: 333.33, holdings: 0 })));
  };

  const portfolioValue = useMemo(() => cash + tokens.reduce((s, t) => s + t.holdings * t.spot, 0), [cash, tokens]);

  return { vertical, setVertical, presets, cash, tokens, buy, sell, sync, injectLP, reset, portfolioValue };
}
