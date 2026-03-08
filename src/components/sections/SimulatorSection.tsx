import { useMemo, useState } from 'react';
import { LEAGUES } from '../../data/leagues';
import { PERSONA_CALLOUTS } from '../../data/content';
import { CANONICAL_STEPS } from '../../data/canonicalJourney';
import { fmtNum, fmtPct, fmtUsd } from '../../lib/formatting';
import { useLeaderboardMarket } from '../../hooks/useLeaderboardMarket';
import type { DetailMode, Persona } from '../../types/market';
import { Section } from '../ui/Section';

const f = (n: number) => n.toFixed(2);

export function SimulatorSection({ mode, persona }: { mode: DetailMode; persona: Persona }) {
  const m = useLeaderboardMarket();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [target, setTarget] = useState('token-a');
  const [amount, setAmount] = useState(300);
  const [markToNav, setMarkToNav] = useState(false);
  const [modeTab, setModeTab] = useState<'guided' | 'free'>('guided');
  const [guidedStep, setGuidedStep] = useState(0);

  const activeStep = CANONICAL_STEPS[guidedStep];

  const posValue = m.contenders.reduce((sum, c) => sum + (m.portfolio.holdings[c.id] ?? 0) * (markToNav ? c.nav : c.spot), 0);
  const accountNav = m.portfolio.cash + posValue;
  const unrealized = m.contenders.reduce((sum, c) => {
    const q = m.portfolio.holdings[c.id] ?? 0;
    const cb = m.portfolio.costBasis[c.id] ?? 0;
    return sum + q * (markToNav ? c.nav : c.spot) - cb;
  }, 0);

  const routePreview = useMemo(() => m.previewTrade(side, target, amount), [m, side, target, amount]);

  const runAction = () => {
    if (side === 'buy') m.buy(target, amount);
    else m.sell(target, amount);
  };

  const setGuided = () => {
    setModeTab('guided');
    m.setLeague('demo');
    setTarget('token-a');
    setAmount(300);
    setGuidedStep(0);
  };

  const setFree = () => setModeTab('free');

  const advanceGuided = () => setGuidedStep((s) => Math.min(CANONICAL_STEPS.length - 1, s + 1));
  const rewindGuided = () => setGuidedStep((s) => Math.max(0, s - 1));

  return (
    <Section id="simulate" title="Simulate" kicker="Trade and follow the same beginner example">
      <div className="mb-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
        Persona lens: <strong>{persona}</strong> — {PERSONA_CALLOUTS[persona]}
      </div>

      <div className="mb-4 inline-flex rounded-full border border-slate-300 bg-white p-1 text-sm">
        <button onClick={setGuided} className={`rounded-full px-4 py-1 ${modeTab === 'guided' ? 'bg-slate-900 text-white' : ''}`}>Guided mode</button>
        <button onClick={setFree} className={`rounded-full px-4 py-1 ${modeTab === 'free' ? 'bg-slate-900 text-white' : ''}`}>Free mode</button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {LEAGUES.filter((l) => modeTab === 'guided' ? l.id === 'demo' : l.id !== 'demo').map((l) => (
          <button key={l.id} onClick={() => { m.setLeague(l.id); setTarget(l.contenders[0].id); }} className={`rounded-full px-3 py-1 ${m.league.id === l.id ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>
            {l.name}
          </button>
        ))}
        <button onClick={() => m.undo()} className="rounded-full border border-slate-300 px-3 py-1">Undo</button>
        <button onClick={() => m.reset(modeTab === 'guided' ? 'demo' : m.league.id)} className="rounded-full border border-slate-300 px-3 py-1">Reset</button>
      </div>

      {modeTab === 'guided' && (
        <div className="mb-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm">
          <p className="font-semibold">{activeStep.title}</p>
          <p className="mt-1">{activeStep.story}</p>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            <div>
              <p className="font-medium">Before</p>
              <p className="font-mono">Reserve {f(activeStep.before.reserveUsdc)} · Baskets {f(activeStep.before.basketUnits)}</p>
              <p className="font-mono">A/B/C spot {f(activeStep.before.lanes.a.spot)} / {f(activeStep.before.lanes.b.spot)} / {f(activeStep.before.lanes.c.spot)}</p>
            </div>
            <div>
              <p className="font-medium">After</p>
              <p className="font-mono">Reserve {f(activeStep.after.reserveUsdc)} · Baskets {f(activeStep.after.basketUnits)}</p>
              <p className="font-mono">A/B/C spot {f(activeStep.after.lanes.a.spot)} / {f(activeStep.after.lanes.b.spot)} / {f(activeStep.after.lanes.c.spot)}</p>
            </div>
          </div>
          <ul className="mt-2 list-disc pl-5">
            {activeStep.actionMath.slice(0, 3).map((line) => <li key={line}>{line}</li>)}
          </ul>
          <p className="mt-2"><strong>What changed:</strong> {activeStep.takeaway}</p>
          <div className="mt-2 flex gap-2"><button onClick={rewindGuided} className="rounded border border-slate-300 px-3 py-1">Previous step</button><button onClick={advanceGuided} className="rounded bg-slate-900 px-3 py-1 text-white">Next step</button></div>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="overflow-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="text-slate-500"><tr><th className="p-2 text-left">Rank</th><th className="p-2 text-left">Contender</th><th>Metric</th><th>Weight</th><th>NAV</th><th>Spot</th><th>Premium / Discount</th><th>{mode === 'advanced' ? 'Reserves (x,y)' : 'Lane depth'}</th><th>Holdings</th><th>Select</th></tr></thead>
            <tbody>{m.contenders.map((c) => {
              const pd = (c.spot - c.nav) / c.nav;
              return <tr key={c.id} className="border-t border-slate-100"><td className="p-2">{c.rank}</td><td className="p-2"><button onClick={() => setTarget(c.id)} className="flex items-center gap-2 rounded px-1 py-1 hover:bg-slate-100"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white" style={{ background: c.color }}>{c.badge}</span><span>{c.name} <span className="font-mono text-xs text-slate-500">{c.ticker}</span></span></button></td><td>{fmtNum(c.metricValue)} <span title="Objective leaderboard metric">ⓘ</span></td><td className="font-mono">{fmtPct(c.weight)}</td><td className="font-mono">{c.nav.toFixed(2)}</td><td className="font-mono">{c.spot.toFixed(2)}</td><td className={`font-mono ${pd >= 0 ? 'text-amber-700' : 'text-cyan-700'}`}>{(pd * 100).toFixed(2)}%</td><td className="font-mono">{mode === 'advanced' ? `${c.x.toFixed(2)}, ${c.y.toFixed(2)}` : `${(c.y / 3).toFixed(2)} token-side depth`}</td><td className="font-mono">{(m.portfolio.holdings[c.id] ?? 0).toFixed(2)}</td><td><button onClick={() => { setTarget(c.id); setAmount(side === 'buy' ? 300 : Math.min(0.3, m.portfolio.holdings[c.id] ?? 0)); }} className="rounded border border-slate-300 px-2 py-1">Use in ticket</button></td></tr>;
            })}</tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <p className="font-semibold">Trade ticket</p>
            <div className="mt-2 flex gap-2"><button onClick={() => setSide('buy')} className={`rounded px-3 py-1 ${side === 'buy' ? 'bg-cyan-600 text-white' : 'bg-slate-100'}`}>Buy</button><button onClick={() => setSide('sell')} className={`rounded px-3 py-1 ${side === 'sell' ? 'bg-amber-500 text-white' : 'bg-slate-100'}`}>Sell</button></div>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className="mt-2 w-full rounded border border-slate-200 p-2">{m.contenders.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <label className="mt-2 block text-xs text-slate-500">{side === 'buy' ? 'USDC to spend' : 'Token units to sell'}</label>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1 w-full rounded border border-slate-200 p-2 font-mono" />
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {side === 'buy' ? [100, 200, 300].map((v) => <button key={v} onClick={() => setAmount(v)} className="rounded border border-slate-300 px-2 py-1">{v} USDC</button>) : [0.1, 0.2, 0.3].map((v) => <button key={v} onClick={() => setAmount(v)} className="rounded border border-slate-300 px-2 py-1">{v} units</button>)}
            </div>
            <button onClick={runAction} className="mt-3 w-full rounded bg-slate-900 p-2 text-white">Submit trade</button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            <p className="font-semibold">Route preview</p>
            {routePreview ? (
              <ul className="mt-2 space-y-1 font-mono text-xs">
                <li>Basket minted: {f(routePreview.basketMinted)}</li>
                <li>Non-target legs sold: {f(routePreview.nonTargetSold)}</li>
                <li>Quote recovered: {f(routePreview.quoteRecovered)}</li>
                <li>Target units bought via routing: {f(routePreview.targetBought)}</li>
                <li>{side === 'buy' ? 'Total target received' : 'Estimated payout'}: {f(routePreview.totalTarget)}</li>
              </ul>
            ) : <p className="mt-2 text-slate-500">Enter an amount to preview.</p>}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold">Portfolio & PnL</p>
            <label className="mt-1 flex items-center gap-2 text-xs"><input type="checkbox" checked={markToNav} onChange={(e) => setMarkToNav(e.target.checked)} /> Mark to NAV (off = mark to spot)</label>
            <div className="mt-2 space-y-1 font-mono text-sm">
              <p>Cash: {fmtUsd(m.portfolio.cash)}</p>
              <p>Position value: {fmtUsd(posValue)}</p>
              <p>Realized PnL: {fmtUsd(m.portfolio.realizedPnl)}</p>
              <p>Unrealized PnL: {fmtUsd(unrealized)}</p>
              <p>Total PnL: {fmtUsd(m.portfolio.realizedPnl + unrealized)}</p>
              <p>Account NAV: {fmtUsd(accountNav)} ({((accountNav / m.portfolio.startNav - 1) * 100).toFixed(2)}%)</p>
            </div>
            <p className="mt-2 text-xs text-slate-500">Realized PnL = closed trades. Unrealized PnL = open positions marked to selected pricing mode.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold">Market controls</p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm"><button className="rounded bg-indigo-600 px-3 py-1 text-white" onClick={() => m.sync()}>Sync</button><button className="rounded bg-cyan-700 px-3 py-1 text-white" onClick={() => m.injectLp(25000)}>Inject LP capital</button><button className="rounded bg-slate-200 px-3 py-1" onClick={() => m.sell(target, m.portfolio.holdings[target] ?? 0)}>Close selected position</button></div>
            <p className="mt-2 text-xs text-slate-500">LP principal {fmtUsd(m.lp.principal)} · Fee pool {fmtUsd(m.lp.feePool)} · Earn-out estimate {fmtUsd(m.lpEarned)}</p>
          </div>

          {m.change && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="font-semibold">What changed?</p><p className="mt-1 text-sm">{m.change.summary}</p><ul className="mt-2 list-disc pl-5 text-sm">{m.change.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div>}
        </div>
      </div>
    </Section>
  );
}
