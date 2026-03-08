import { useMemo, useState } from 'react';
import { LEAGUES } from '../../data/leagues';
import { PERSONA_CALLOUTS } from '../../data/content';
import { fmtNum, fmtPct, fmtUsd } from '../../lib/formatting';
import { useLeaderboardMarket } from '../../hooks/useLeaderboardMarket';
import type { DetailMode, Persona } from '../../types/market';
import { Section } from '../ui/Section';

const SCENARIO = [
  'LP seeds initial depth',
  'Alice buys Atlas',
  'Bob sells rival',
  'Oracle sync re-anchors',
  'LP adds more depth',
  'Alice realizes partial PnL',
];

export function SimulatorSection({ mode, persona }: { mode: DetailMode; persona: Persona }) {
  const m = useLeaderboardMarket();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [target, setTarget] = useState(m.league.contenders[0].id);
  const [amount, setAmount] = useState(500);
  const [markToNav, setMarkToNav] = useState(false);
  const [guided, setGuided] = useState(true);
  const [step, setStep] = useState(0);

  const posValue = m.contenders.reduce((sum, c) => sum + (m.portfolio.holdings[c.id] ?? 0) * (markToNav ? c.nav : c.spot), 0);
  const accountNav = m.portfolio.cash + posValue;
  const unrealized = m.contenders.reduce((sum, c) => {
    const q = m.portfolio.holdings[c.id] ?? 0;
    const cb = m.portfolio.costBasis[c.id] ?? 0;
    return sum + q * (markToNav ? c.nav : c.spot) - cb;
  }, 0);

  const runAction = () => {
    if (side === 'buy') m.buy(target, amount);
    else m.sell(target, amount);
  };

  const playStep = () => {
    const t1 = m.contenders[0]?.id;
    const t2 = m.contenders[1]?.id;
    if (step === 0) m.injectLp(50000);
    if (step === 1 && t1) m.buy(t1, 900);
    if (step === 2 && t2) m.sell(t2, Math.min(300, m.portfolio.holdings[t2] ?? 0));
    if (step === 3) m.sync();
    if (step === 4) m.injectLp(80000);
    if (step === 5 && t1) m.sell(t1, Math.min(450, m.portfolio.holdings[t1] ?? 0));
    setStep((s) => Math.min(SCENARIO.length - 1, s + 1));
  };

  const route = useMemo(() => ['Basket mint', 'Non-target unwind', 'Target acquisition', 'New spot + portfolio update'], []);

  return (
    <Section id="simulate" title="Simulate" kicker="Flagship interactive intuition model">
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {LEAGUES.map((l) => <button key={l.id} onClick={() => { m.setLeague(l.id); setTarget(l.contenders[0].id); }} className={`rounded-full px-3 py-1 ${m.league.id === l.id ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{l.name}</button>)}
        <button onClick={() => setGuided(!guided)} className="rounded-full border border-slate-300 px-3 py-1">{guided ? 'Guided mode' : 'Free mode'}</button>
        <button onClick={() => m.undo()} className="rounded-full border border-slate-300 px-3 py-1">Undo</button>
        <button onClick={() => { m.reset(); setStep(0); }} className="rounded-full border border-slate-300 px-3 py-1">Reset</button>
      </div>
      <p className="mb-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Persona lens: <strong>{persona}</strong> — {PERSONA_CALLOUTS[persona]}</p>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="overflow-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
          <table className="min-w-[1200px] w-full text-sm">
            <thead className="text-slate-500"><tr><th className="sticky left-0 bg-white p-2 text-left">Rank</th><th className="sticky left-12 bg-white p-2 text-left">Contender</th><th>Metric</th><th>Δ</th><th>Weight</th><th>NAV</th><th>Spot</th><th>Prem/Disc</th><th>Depth</th><th>Holdings</th><th>Buy</th><th>Sell</th></tr></thead>
            <tbody>{m.contenders.map((c) => {
              const pd = (c.spot - c.nav) / c.nav;
              return <tr key={c.id} className="border-t border-slate-100"><td className="sticky left-0 bg-white p-2">{c.rank}</td><td className="sticky left-12 bg-white p-2"><button onClick={() => setTarget(c.id)} className="flex items-center gap-2"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white" style={{ background: c.color }}>{c.badge}</span><span>{c.name} <span className="font-mono text-xs text-slate-500">{c.ticker}</span></span></button></td><td>{fmtNum(c.metricValue)} <span title="Oracle metric used to compute weights">ⓘ</span></td><td className={c.metricDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{c.metricDelta.toFixed(2)}%</td><td className="font-mono">{fmtPct(c.weight)}</td><td className="font-mono">{c.nav.toFixed(4)}</td><td className="font-mono">{c.spot.toFixed(4)}</td><td className={`font-mono ${pd >= 0 ? 'text-amber-700' : 'text-cyan-700'}`}>{(pd * 100).toFixed(2)}%</td><td>{(c.x / 100000).toFixed(2)}x</td><td className="font-mono">{(m.portfolio.holdings[c.id] ?? 0).toFixed(2)}</td><td><button onClick={() => m.buy(c.id, 250)} className="rounded bg-cyan-600 px-2 py-1 text-white">Buy</button></td><td><button onClick={() => m.sell(c.id, Math.min(100, m.portfolio.holdings[c.id] ?? 0))} className="rounded bg-amber-500 px-2 py-1 text-white">Sell</button></td></tr>;
            })}</tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <p className="font-semibold">Trade ticket</p>
            <div className="mt-2 flex gap-2"><button onClick={() => setSide('buy')} className={`rounded px-3 py-1 ${side === 'buy' ? 'bg-cyan-600 text-white' : 'bg-slate-100'}`}>Buy</button><button onClick={() => setSide('sell')} className={`rounded px-3 py-1 ${side === 'sell' ? 'bg-amber-500 text-white' : 'bg-slate-100'}`}>Sell</button></div>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className="mt-2 w-full rounded border border-slate-200 p-2">{m.contenders.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-2 w-full rounded border border-slate-200 p-2 font-mono" />
            <p className="mt-2 text-xs text-slate-500">Route preview: {route.join(' → ')}</p>
            <button onClick={runAction} className="mt-2 w-full rounded bg-slate-900 p-2 text-white">Submit</button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold">Portfolio & PnL</p>
            <label className="mt-1 flex items-center gap-2 text-xs"><input type="checkbox" checked={markToNav} onChange={(e) => setMarkToNav(e.target.checked)} /> Mark positions to NAV</label>
            <div className="mt-2 space-y-1 font-mono text-sm">
              <p>Cash: {fmtUsd(m.portfolio.cash)}</p>
              <p>Position value: {fmtUsd(posValue)}</p>
              <p>Realized PnL: {fmtUsd(m.portfolio.realizedPnl)}</p>
              <p>Unrealized PnL: {fmtUsd(unrealized)}</p>
              <p>Total PnL: {fmtUsd(m.portfolio.realizedPnl + unrealized)}</p>
              <p>Account NAV: {fmtUsd(accountNav)} ({((accountNav / m.portfolio.startNav - 1) * 100).toFixed(2)}%)</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold">Controls</p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm"><button className="rounded bg-indigo-600 px-3 py-1 text-white" onClick={() => m.sync()}>Sync</button><button className="rounded bg-cyan-700 px-3 py-1 text-white" onClick={() => m.injectLp(25000)}>Inject LP capital</button><button className="rounded bg-slate-200 px-3 py-1" onClick={() => m.sell(target, m.portfolio.holdings[target] ?? 0)}>Full-basket redeem helper</button></div>
            <p className="mt-2 text-xs text-slate-500">LP principal {fmtUsd(m.lp.principal)} · Fee pool {fmtUsd(m.lp.feePool)} · Earn-out estimate {fmtUsd(m.lpEarned)}</p>
          </div>

          {guided && <div className="rounded-2xl border border-slate-200 bg-indigo-50 p-4"><p className="font-semibold">Guided scenario</p><p className="mt-1 text-sm">Step {step + 1}: {SCENARIO[step]}</p><div className="mt-2 flex gap-2"><button className="rounded bg-indigo-600 px-3 py-1 text-white" onClick={playStep}>Play step</button><button className="rounded bg-slate-200 px-3 py-1" onClick={() => { m.reset(); setStep(0); }}>Replay</button></div></div>}

          {m.change && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="font-semibold">What changed?</p><p className="mt-1 text-sm">{m.change.summary}</p><ul className="mt-2 list-disc pl-5 text-sm">{m.change.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div>}

          {mode === 'advanced' && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs font-mono">{m.contenders.slice(0, 2).map((c) => <p key={c.id}>{c.ticker}: x={c.x.toFixed(1)} y={c.y.toFixed(1)} spot={(c.x / c.y).toFixed(4)}</p>)}</div>}
        </div>
      </div>
    </Section>
  );
}
