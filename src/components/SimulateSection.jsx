import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MARKET_OPTIONS } from '../data/markets';
import { useLeaderboardMarket } from '../hooks/useLeaderboardMarket';

const number = (n, digits = 2) => n.toLocaleString('en-US', { maximumFractionDigits: digits });

const stories = {
  user: [
    {
      icon: '🎯',
      title: 'Open your thesis',
      body: 'Buy one contender to express a relative-performance view. You start with $10,000 cash, so deployed capital and total account NAV are different numbers.',
      action: 'Run this step to execute one guided BUY on your focus contender.',
    },
    {
      icon: '🧭',
      title: 'Move the oracle, then sync',
      body: 'Edit contender weights to represent new real-world performance. Sync snaps vAMM quote reserves back to oracle NAV while keeping token depth intact.',
      action: 'Adjust oracle weights below, then run this step to SYNC.',
    },
    {
      icon: '💸',
      title: 'Realize part of PnL',
      body: 'Sell part of your position to convert paper gains/losses into realized PnL. Remaining position keeps an unrealized PnL based on live spot.',
      action: 'Run this step to execute one guided SELL on the same contender.',
    },
  ],
  lp: [
    {
      icon: '🏦',
      title: 'Add liquidity depth',
      body: 'LPs scale both sides of pools to improve execution quality. This should compress price impact for the same trade notional.',
      action: 'Run this step to inject more reserve depth.',
    },
    {
      icon: '🧲',
      title: 'Collect flow',
      body: 'When traders route through curves, fees accrue to LPs. This is the core LP cash-flow engine between sync boundaries.',
      action: 'Run this step to simulate one trader zap through your depth.',
    },
    {
      icon: '🔄',
      title: 'Boundary sync',
      body: 'At sync, oracle truth is committed and prices re-anchor deterministically. LPs retain depth while reference price resets.',
      action: 'Run this step to execute the oracle sync.',
    },
  ],
};

export function SimulateSection() {
  const [marketId, setMarketId] = useState(MARKET_OPTIONS[0].id);
  const [role, setRole] = useState('user');
  const [storyStep, setStoryStep] = useState(0);
  const [tradeSize, setTradeSize] = useState(100);

  const market = useMemo(() => MARKET_OPTIONS.find((item) => item.id === marketId), [marketId]);
  const {
    portfolio,
    protocol,
    toasts,
    metrics,
    eventLog,
    resetMarket,
    previewBuy,
    previewSell,
    zapBuy,
    zapSell,
    injectLiquidity,
    triggerOracleSync,
  } = useLeaderboardMarket(market);

  const [weightInputs, setWeightInputs] = useState(market.contenders.map((c) => c.weight));
  const [focusName, setFocusName] = useState(market.contenders[0].name);

  useEffect(() => {
    resetMarket(market);
    setWeightInputs(market.contenders.map((c) => c.weight));
    setFocusName(market.contenders[0].name);
    setStoryStep(0);
  }, [marketId]);

  const focused = protocol.find((row) => row.name === focusName) || protocol[0];
  const buyPreview = focused ? previewBuy(focused.name, tradeSize) : null;
  const sellPreview = focused ? previewSell(focused.name, tradeSize) : null;
  const activeStory = stories[role][storyStep];

  const runCurrentStep = () => {
    if (role === 'user') {
      if (storyStep === 0 && focused) zapBuy(focused.name, tradeSize);
      if (storyStep === 1) triggerOracleSync(weightInputs);
      if (storyStep === 2 && focused) zapSell(focused.name, Math.min(tradeSize, portfolio.holdings[focused.name] || 0));
    }
    if (role === 'lp') {
      if (storyStep === 0) injectLiquidity(1.2);
      if (storyStep === 1 && focused) zapBuy(focused.name, tradeSize);
      if (storyStep === 2) triggerOracleSync(weightInputs);
    }
  };

  return (
    <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-cyan-50 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-indigo-700">🕹️ Guided Simulation Mode</p>
        <p className="mt-2 text-slate-700">Follow the steps in order: pick a role, run each story action, then inspect the explanation cards after every action.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <label>
          <p className="mb-2 text-sm text-slate-600">🌍 League Universe</p>
          <select value={marketId} onChange={(e) => setMarketId(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
            {MARKET_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </label>

        <label>
          <p className="mb-2 text-sm text-slate-600">🧑 Your Role</p>
          <select value={role} onChange={(e) => { setRole(e.target.value); setStoryStep(0); }} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
            <option value="user">Trader / Hedger</option>
            <option value="lp">Liquidity Provider</option>
          </select>
        </label>

        <label>
          <p className="mb-2 text-sm text-slate-600">⭐ Focus Contender</p>
          <select value={focusName} onChange={(e) => setFocusName(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
            {protocol.map((row) => (
              <option key={row.name} value={row.name}>{row.name}</option>
            ))}
          </select>
        </label>

        <label>
          <p className="mb-2 text-sm text-slate-600">💵 Action Notional</p>
          <input type="number" min={1} value={tradeSize} onChange={(e) => setTradeSize(Math.max(1, Number(e.target.value) || 1))} className="mono w-full rounded-xl border border-slate-300 bg-white px-3 py-2"/>
        </label>
      </div>

      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">{activeStory.icon} Story Step {storyStep + 1} / {stories[role].length}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{activeStory.title}</p>
            <p className="mt-1 text-sm text-slate-700">{activeStory.body}</p>
            <p className="mt-1 text-sm font-medium text-cyan-700">👉 {activeStory.action}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStoryStep((s) => Math.max(0, s - 1))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">Back</button>
            <button onClick={runCurrentStep} className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white">Run Step</button>
            <button onClick={() => setStoryStep((s) => Math.min(stories[role].length - 1, s + 1))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">Next</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">📈 Trader PnL (explained)</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <p className="text-sm text-slate-600">Cash Balance: <span className="mono text-slate-900">${number(metrics.userPnl.cash)}</span></p>
            <p className="text-sm text-slate-600">Position Value: <span className="mono text-amber-700">${number(metrics.userPnl.positionValue)}</span></p>
            <p className="text-sm text-slate-600">Open Cost Basis: <span className="mono text-slate-900">${number(metrics.userPnl.openCostBasis)}</span></p>
            <p className="text-sm text-slate-600">Realized Proceeds: <span className="mono text-cyan-700">${number(metrics.userPnl.realizedProceeds)}</span></p>
            <p className="text-sm text-slate-600">Realized PnL: <span className="mono text-cyan-700">${number(metrics.userPnl.realizedPnl)}</span></p>
            <p className="text-sm text-slate-600">Unrealized PnL: <span className={`mono ${metrics.userPnl.unrealizedPnl >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>${number(metrics.userPnl.unrealizedPnl)}</span></p>
            <p className="text-sm text-slate-600">Total PnL: <span className={`mono ${metrics.userPnl.totalPnl >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>${number(metrics.userPnl.totalPnl)}</span></p>
            <p className="text-sm text-slate-600">Account NAV: <span className="mono text-indigo-700">${number(metrics.userPnl.accountNav)}</span></p>
          </div>
          <p className="mt-3 rounded-lg bg-white p-3 text-xs text-slate-600">Why can NAV look much bigger than Invested? Because NAV = <strong>remaining cash + open positions</strong>. You only deploy part of your starting $10,000, so account NAV includes undeployed cash too.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">🏦 LP Economics</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <p className="text-sm text-slate-600">Principal NAV: <span className="mono text-slate-900">${number(metrics.lpPnl.principal)}</span></p>
            <p className="text-sm text-slate-600">Fees Value: <span className="mono text-cyan-700">${number(metrics.lpPnl.fees)}</span></p>
            <p className="text-sm text-slate-600">Fee Shares: <span className="mono text-amber-600">{number(metrics.lpPnl.feeShares, 4)}</span></p>
            <p className="text-sm text-slate-600">LP Total NAV: <span className="mono text-emerald-700">${number(metrics.lpPnl.nav)}</span></p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">🔍 Execution Preview ({focusName})</p>
          <p className="mt-2 text-sm text-slate-600">BUY expected: <span className="mono text-amber-600">{buyPreview ? number(buyPreview.received, 4) : '—'} tokens</span></p>
          <p className="mt-1 text-sm text-slate-600">SELL expected: <span className="mono text-amber-600">{sellPreview ? number(sellPreview.z, 4) : '—'} USDC</span></p>
          <p className="mt-1 text-sm text-slate-600">Spot/NAV: <span className="mono text-cyan-700">{focused ? `${focused.spot.toFixed(4)} / ${focused.weight.toFixed(4)}` : '—'}</span></p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">⚖️ Oracle Weight Editor</p>
          <div className="grid gap-2 md:grid-cols-3">
            {protocol.map((row, idx) => (
              <label key={row.name} className="text-xs text-slate-600">
                {row.name}
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={weightInputs[idx]}
                  onChange={(e) => {
                    const next = [...weightInputs];
                    next[idx] = Math.max(0, Number(e.target.value) || 0);
                    setWeightInputs(next);
                  }}
                  className="mono mt-1 w-full rounded border border-slate-300 px-2 py-1"
                />
              </label>
            ))}
          </div>
          <p className="mono mt-2 text-xs text-slate-500">raw sum: {weightInputs.reduce((a, b) => a + b, 0).toFixed(4)} (normalized at sync)</p>
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Contender</th>
              <th className="p-3">Oracle Weight (%)</th>
              <th className="p-3">Fundamental NAV ($)</th>
              <th className="p-3">Live Spot Price ($)</th>
              <th className="p-3">Premium/Discount (%)</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...protocol].sort((a, b) => b.weight - a.weight).map((row, idx) => {
              const pd = ((row.spot - row.weight) / row.weight) * 100;
              const insufficientSell = (portfolio.holdings[row.name] || 0) < tradeSize;
              const insufficientBuy = portfolio.usdc < tradeSize;
              return (
                <tr key={row.name} className="border-t border-slate-200">
                  <td className="mono p-3">{idx + 1}</td>
                  <td className="p-3 font-medium text-slate-900">{row.name}</td>
                  <td className="mono p-3 text-cyan-700">{(row.weight * 100).toFixed(2)}%</td>
                  <td className="mono p-3 text-cyan-600">${row.weight.toFixed(4)}</td>
                  <td className="mono p-3 text-amber-600">${row.spot.toFixed(4)}</td>
                  <td className={`mono p-3 ${pd >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>{pd.toFixed(2)}%</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button disabled={insufficientBuy} onClick={() => zapBuy(row.name, tradeSize)} className="rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-white disabled:opacity-40">BUY</button>
                      <button disabled={insufficientSell} onClick={() => zapSell(row.name, tradeSize)} className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-40">SELL</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">🧾 Routing Tape</p>
        <div className="mt-2 max-h-32 space-y-1 overflow-auto">
          {eventLog.length === 0 && <p className="text-sm text-slate-500">No activity yet.</p>}
          {eventLog.map((evt) => <p key={evt.id} className="mono text-xs text-slate-700">{evt.message}</p>)}
        </div>
      </div>

      <AnimatePresence>
        <div className="fixed bottom-4 right-4 z-40 space-y-2">
          {toasts.map((toast) => (
            <motion.div key={toast.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-md rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 shadow">
              {toast.message}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </section>
  );
}
