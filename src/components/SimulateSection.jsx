import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MARKET_OPTIONS } from '../data/markets';
import { useLeaderboardMarket } from '../hooks/useLeaderboardMarket';

const number = (n, digits = 4) => n.toLocaleString('en-US', { maximumFractionDigits: digits });

export function SimulateSection() {
  const [marketId, setMarketId] = useState(MARKET_OPTIONS[0].id);
  const [tradeSize, setTradeSize] = useState(100);
  const [focusName, setFocusName] = useState(MARKET_OPTIONS[0].contenders[0].name);

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
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    resetMarket(market);
    setWeightInputs(market.contenders.map((c) => c.weight));
    setFocusName(market.contenders[0].name);
    setSyncError('');
  }, [marketId]);

  const weightSum = weightInputs.reduce((a, b) => a + b, 0);
  const canSync = weightSum > 0;
  const focused = protocol.find((row) => row.name === focusName) || protocol[0];
  const buyPreview = focused ? previewBuy(focused.name, tradeSize) : null;
  const sellPreview = focused ? previewSell(focused.name, tradeSize) : null;

  const applyScenario = (mode) => {
    if (mode === 'momentum') {
      const sorted = [...protocol].sort((a, b) => b.spot - a.spot);
      const top = sorted[0].name;
      const bumped = protocol.map((row) => (row.name === top ? Math.min(row.weight + 0.08, 0.8) : row.weight));
      const normalizedTotal = bumped.reduce((acc, weight) => acc + weight, 0);
      setWeightInputs(bumped.map((weight) => weight / normalizedTotal));
    }
    if (mode === 'reversion') {
      setWeightInputs(protocol.map(() => 1 / protocol.length));
    }
    if (mode === 'upset') {
      const inverted = [...protocol].sort((a, b) => a.weight - b.weight).map((row) => row.weight + 0.04);
      const total = inverted.reduce((acc, weight) => acc + weight, 0);
      setWeightInputs(inverted.map((weight) => weight / total));
    }
  };

  return (
    <section className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur">
      <div className="grid gap-4 lg:grid-cols-3">
        <div>
          <p className="mb-2 text-sm text-slate-400">League Universe</p>
          <select
            aria-label="Select mock league"
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2"
          >
            {MARKET_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2 text-sm text-slate-400">Action Notional (USDC / Tokens)</p>
          <input
            aria-label="Trade notional"
            type="number"
            value={tradeSize}
            min={1}
            onChange={(e) => setTradeSize(Math.max(1, Number(e.target.value) || 1))}
            className="mono w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2"
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-slate-400">Focus Contender</p>
          <select
            value={focusName}
            onChange={(e) => setFocusName(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2"
          >
            {protocol.map((row) => (
              <option key={row.name} value={row.name}>
                {row.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <button type="button" onClick={() => injectLiquidity(1.2)} className="rounded-xl border border-cyan-500 px-4 py-2 text-cyan-300">
          Inject LP Capital (+20%)
        </button>
        <button type="button" onClick={() => applyScenario('momentum')} className="rounded-xl border border-slate-600 px-4 py-2 text-slate-200">
          Scenario: Momentum
        </button>
        <button type="button" onClick={() => applyScenario('reversion')} className="rounded-xl border border-slate-600 px-4 py-2 text-slate-200">
          Scenario: Mean Reversion
        </button>
        <button type="button" onClick={() => applyScenario('upset')} className="rounded-xl border border-slate-600 px-4 py-2 text-slate-200">
          Scenario: Upset Rotation
        </button>
        <button
          type="button"
          disabled={!canSync}
          onClick={() => {
            const ok = triggerOracleSync(weightInputs);
            if (!ok) setSyncError('Weights must be positive values before sync.');
            else setSyncError('');
          }}
          className="rounded-xl border border-amber-500 px-4 py-2 text-amber-400 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
        >
          TRIGGER ORACLE SYNC
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="mb-3 text-sm text-slate-300">Manually Edit Weights (auto-normalized at sync)</p>
          <div className="grid gap-3 md:grid-cols-3">
            {protocol.map((row, idx) => (
              <label key={row.name} className="block">
                <span className="text-xs text-slate-400">{row.name}</span>
                <input
                  aria-label={`${row.name} oracle weight`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={weightInputs[idx]}
                  onChange={(e) => {
                    const next = [...weightInputs];
                    next[idx] = Math.max(0, Number(e.target.value) || 0);
                    setWeightInputs(next);
                  }}
                  className="mono mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
                />
              </label>
            ))}
          </div>
          <p className="mono mt-2 text-xs text-emerald-300">sum = {weightSum.toFixed(4)}</p>
          {syncError && <p className="mt-1 text-xs text-rose-300">{syncError}</p>}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Execution Preview</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-100">{focused?.name}</h3>
          <div className="mt-3 grid gap-2 text-sm">
            <p className="text-slate-400">
              BUY expected receive: <span className="mono text-amber-400">{buyPreview ? number(buyPreview.received, 4) : '—'}</span>
            </p>
            <p className="text-slate-400">
              BUY effective price: <span className="mono text-cyan-300">{buyPreview ? buyPreview.impliedExecution.toFixed(5) : '—'} USDC/token</span>
            </p>
            <p className="text-slate-400">
              SELL expected return: <span className="mono text-amber-400">{sellPreview ? number(sellPreview.z, 4) : '—'} USDC</span>
            </p>
            <p className="text-slate-400">
              SELL recovery ratio: <span className="mono text-cyan-300">{sellPreview ? (sellPreview.impliedExecution * 100).toFixed(2) : '—'}%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-xs text-slate-400">Portfolio USDC</p>
          <p className="mono text-2xl text-slate-50">${number(portfolio.usdc, 2)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-xs text-slate-400">Holdings MTM</p>
          <p className="mono text-2xl text-cyan-300">${number(metrics.holdingsValue, 2)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-xs text-slate-400">Portfolio Net Value</p>
          <p className="mono text-2xl text-slate-100">${number(metrics.net, 2)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-xs text-slate-400">Protocol vAMM Depth</p>
          <p className="mono text-2xl text-amber-400">${number(metrics.totalDepth, 2)}</p>
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead className="bg-slate-900/90 text-left text-slate-400">
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
            {[...protocol]
              .sort((a, b) => b.weight - a.weight)
              .map((row, idx) => {
                const pd = ((row.spot - row.weight) / row.weight) * 100;
                const insufficientSell = (portfolio.holdings[row.name] || 0) < tradeSize;
                const insufficientBuy = portfolio.usdc < tradeSize;
                return (
                  <tr key={row.name} className="border-t border-slate-800/80">
                    <td className="mono p-3">{idx + 1}</td>
                    <td className="p-3 font-medium text-slate-100">{row.name}</td>
                    <td className="mono p-3 text-cyan-300">{(row.weight * 100).toFixed(2)}%</td>
                    <td className="mono p-3 text-cyan-400">${row.weight.toFixed(4)}</td>
                    <td className="mono p-3 text-amber-400">${row.spot.toFixed(4)}</td>
                    <td className={`mono p-3 ${pd >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{pd.toFixed(2)}%</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          disabled={insufficientBuy}
                          onClick={() => zapBuy(row.name, tradeSize)}
                          className="rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          BUY
                        </button>
                        <button
                          disabled={insufficientSell}
                          onClick={() => zapSell(row.name, tradeSize)}
                          className="rounded-md border border-slate-600 px-3 py-1 text-xs font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          SELL
                        </button>
                      </div>
                      <p className="mono mt-1 text-[10px] text-slate-500">Inv: {number(portfolio.holdings[row.name] || 0, 3)}</p>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Routing Tape</p>
          <div className="mt-3 max-h-36 space-y-2 overflow-auto pr-1">
            {eventLog.length === 0 && <p className="text-sm text-slate-500">No routed events yet. Execute a trade or oracle sync.</p>}
            {eventLog.map((evt) => (
              <p key={evt.id} className="mono text-xs text-slate-300">
                {evt.message}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-400">Design Notes</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Primary reserve remains solvent because issuance is always full-basket.</li>
            <li>Spot prices can drift between syncs, but are deterministically re-anchored on oracle boundaries.</li>
            <li>LP injections scale both sides of every curve equally, reducing slippage without changing fair NAV.</li>
          </ul>
        </div>
      </div>

      <AnimatePresence>
        <div className="fixed bottom-4 right-4 z-40 space-y-2">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-md rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100"
            >
              {toast.message}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </section>
  );
}
