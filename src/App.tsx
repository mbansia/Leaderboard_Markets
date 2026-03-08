import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { glossary, learnSteps, pathways } from './data/content';
import { leaguePresets } from './data/leagues';
import { useLeagueSimulator, type TradeSide } from './hooks/useLeagueSimulator';

const sections = [
  { id: 'learn', label: 'LEARN' },
  { id: 'simulate', label: 'SIMULATE' },
  { id: 'estimate', label: 'ESTIMATE' },
  { id: 'math', label: 'THE MATH' },
];

export default function App() {
  const reduceMotion = useReducedMotion();
  const [activePath, setActivePath] = useState('learn');
  const [step, setStep] = useState(0);
  const [tradeSide, setTradeSide] = useState<TradeSide>('buy');
  const [selected, setSelected] = useState(leaguePresets[0].contenders[0].id);
  const [amount, setAmount] = useState(500);
  const [toast, setToast] = useState('');
  const sim = useLeagueSimulator();
  const [calc, setCalc] = useState({ tvl: 15000000, vol: 1800000, fee: 0.35, yld: 4.5, split: 35, lp: 65, mult: 16 });

  const outputs = useMemo(() => {
    const gross = calc.vol * 365 * (calc.fee / 100);
    const reserve = calc.tvl * (calc.yld / 100);
    const combined = gross + reserve;
    const treasury = combined * (calc.split / 100);
    const lpRev = combined * (calc.lp / 100);
    return { gross, reserve, combined, treasury, lpApy: (lpRev / calc.tvl) * 100, fdv: treasury * calc.mult };
  }, [calc]);

  const submitTrade = () => {
    const result = sim.executeTrade(selected, amount, tradeSide);
    if (!result) return;
    setToast(`${tradeSide.toUpperCase()} executed · ${result.qty.toFixed(2)} units @ ${result.avgPrice.toFixed(4)} NAV`);
    setTimeout(() => setToast(''), 2200);
  };

  return (
    <div className="text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="font-semibold tracking-tight">Podium · Leaderboard Markets</div>
          <div className="hidden gap-5 text-sm md:flex">{sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.label}</a>)}</div>
        </nav>
      </header>

      <main className="bg-noise">
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">A new market primitive</p>
            <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Own the standings.</h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">We rank everything—AI models, creators, sports teams, protocols. Podium turns any objective leaderboard into a continuous market for relative performance.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#simulate" className="rounded-full bg-slate-900 px-5 py-3 text-white">Explore the market</a>
              <a href="#learn" className="rounded-full border border-slate-300 bg-white px-5 py-3">See how it works</a>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.8 }} className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-soft">
            <svg viewBox="0 0 520 300" className="w-full">
              <rect x="24" y="40" width="472" height="220" rx="24" fill="url(#bg)" />
              {[0, 1, 2].map((i) => <motion.rect key={i} x={80 + i * 120} y={170 - i * 24} width="90" height={80 + i * 24} rx="14" fill={['#fbbf24', '#38bdf8', '#6366f1'][i]} animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3 + i }} />)}
              <motion.circle cx="450" cy="90" r="12" fill="#06b6d4" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2.4 }} />
              <path d="M50 250 C150 150, 280 220, 470 95" stroke="#f59e0b" strokeWidth="3" fill="none" strokeDasharray="6 6" />
              <defs><linearGradient id="bg" x1="0" x2="1"><stop stopColor="#f8fafc" /><stop offset="1" stopColor="#ecfeff" /></linearGradient></defs>
            </svg>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-8">
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 md:grid-cols-3">
            {[
              ['Binary prediction markets', 'discrete outcomes'],
              ['Fan tokens', 'engagement utility'],
              ['ETFs', 'pooled ownership'],
            ].map((row) => (
              <div key={row[0]} className="rounded-xl bg-slate-50 p-4 text-sm"><p className="font-medium">{row[0]} → <span className="text-slate-500">{row[1]}</span></p><p className="mt-2 font-semibold text-cyan-700">Leaderboard Markets → tradable standings</p></div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <h2 className="text-3xl font-semibold">Markets can price events. Podium prices trajectories.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {['Prediction markets', 'Sportsbooks', 'Fan tokens', 'Leaderboard Markets'].map((c, idx) => (
              <div key={c} className={`rounded-2xl border p-4 ${idx === 3 ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 bg-white'}`}>
                <p className="font-semibold">{c}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>{idx === 3 ? 'Continuous ranking-share exposure' : 'Discrete or utility exposure'}</li>
                  <li>{idx === 3 ? 'Recurring sync moments' : 'Mostly terminal moments'}</li>
                  <li>{idx === 3 ? 'Single-name routing preserved' : 'Single-name optional'}</li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="sticky top-[68px] z-30 mx-auto max-w-7xl px-6 py-4">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 md:grid-cols-4">
            {sections.map((s) => <button key={s.id} className={`rounded-xl px-4 py-2 text-sm ${activePath === s.id ? 'bg-slate-900 text-white' : 'bg-slate-100'}`} onClick={() => { setActivePath(s.id); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }}>{s.label}</button>)}
          </div>
        </section>

        <section id="learn" className="mx-auto max-w-7xl px-6 py-14">
          <h3 className="text-3xl font-semibold">LEARN</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-[210px_1fr]">
            <div className="space-y-2">{learnSteps.map((s, i) => <button key={s[0]} onClick={() => setStep(i)} className={`block w-full rounded-xl p-3 text-left text-sm ${step === i ? 'bg-cyan-100' : 'bg-white border border-slate-200'}`}>{i + 1}. {s[0]}</button>)}</div>
            <motion.article key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Step {step + 1}</p>
              <h4 className="mt-2 text-2xl font-semibold">{learnSteps[step][0]}</h4>
              <p className="mt-3 text-slate-600">{learnSteps[step][1]}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Why it matters</p><p className="mt-2 text-sm">Tradable rankings create ongoing conviction expression rather than one-off event closure.</p></div>
                <div className="rounded-xl bg-cyan-50 p-4"><p className="text-xs uppercase tracking-wide text-cyan-700">Design rationale</p><p className="mt-2 text-sm">Full-basket solvency, deterministic syncs, and single-name zap routing keep mechanics coherent and intuitive.</p></div>
              </div>
            </motion.article>
          </div>
        </section>

        <section id="simulate" className="mx-auto max-w-7xl px-6 py-14">
          <h3 className="text-3xl font-semibold">SIMULATE <span className="text-sm text-slate-500">(interactive intuition model)</span></h3>
          <div className="mt-4 flex gap-2">{leaguePresets.map((l) => <button key={l.id} onClick={() => sim.switchPreset(l.id)} className={`rounded-full px-4 py-2 text-sm ${sim.preset.id === l.id ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{l.name}</button>)}</div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft overflow-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead><tr className="text-left text-slate-500"><th>Rank</th><th>Contender</th><th>Oracle</th><th>NAV</th><th>Spot</th><th>Prem/Disc</th><th>Depth</th></tr></thead>
                <tbody>{[...sim.contenders].sort((a, b) => b.weight - a.weight).map((c, i) => {
                  const pd = ((c.spot - c.weight) / c.weight) * 100;
                  return <tr key={c.id} className="border-t border-slate-100"><td>{i + 1}</td><td className="py-2"><button onClick={() => setSelected(c.id)} className="rounded-lg px-2 py-1 hover:bg-slate-100">{c.name} <span className="text-xs text-slate-500">{c.ticker}</span></button></td><td className="font-mono">{(c.weight * 100).toFixed(2)}%</td><td className="font-mono">{c.weight.toFixed(4)}</td><td className="font-mono">{c.spot.toFixed(4)}</td><td className={`font-mono ${pd > 0 ? 'text-amber-600' : 'text-cyan-700'}`}>{pd.toFixed(2)}%</td><td>{(c.depth * sim.reserveDepth).toFixed(2)}x</td></tr>;
                })}</tbody>
              </table>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                <p className="font-semibold">Trade Ticket</p>
                <div className="mt-3 flex gap-2"><button onClick={() => setTradeSide('buy')} className={`rounded-full px-3 py-1 ${tradeSide === 'buy' ? 'bg-cyan-600 text-white' : 'bg-slate-100'}`}>Buy</button><button onClick={() => setTradeSide('sell')} className={`rounded-full px-3 py-1 ${tradeSide === 'sell' ? 'bg-amber-500 text-white' : 'bg-slate-100'}`}>Sell</button></div>
                <select value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 p-2">{sim.contenders.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <input className="mt-3 w-full rounded-xl border border-slate-200 p-2 font-mono" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                <button onClick={submitTrade} className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2 text-white">Submit</button>
                <p className="mt-2 text-xs text-slate-500">Route: Basket Mint → Non-target unwind → Target acquisition → New spot</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-semibold">Controls</p>
                <div className="mt-3 flex gap-2"><button onClick={sim.syncOracle} className="rounded-lg bg-indigo-600 px-3 py-2 text-white">Trigger Oracle Sync</button><button onClick={() => sim.injectLiquidity(0.25)} className="rounded-lg bg-cyan-600 px-3 py-2 text-white">Inject LP Capital</button><button onClick={() => sim.resetToPreset()} className="rounded-lg bg-slate-200 px-3 py-2">Reset</button></div>
                <p className="mt-3 text-sm text-slate-600">Portfolio cash <span className="font-mono">${sim.portfolioUsd.toFixed(0)}</span> · Reserve depth <span className="font-mono">{sim.reserveDepth.toFixed(2)}x</span></p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-semibold">Transaction Log</p>
                <div className="mt-3 space-y-2">{sim.txs.map((t) => <p key={t.id} className="rounded-lg bg-slate-50 p-2 text-xs font-mono">{t.detail} · ${t.amount.toFixed(0)}</p>)}</div>
              </div>
            </div>
          </div>
        </section>

        <section id="estimate" className="mx-auto max-w-7xl px-6 py-14">
          <h3 className="text-3xl font-semibold">ESTIMATE</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              {Object.entries(calc).map(([k, v]) => <label key={k} className="mb-3 block text-sm"><span className="capitalize">{k}</span><input className="mt-1 w-full" type="range" min={k === 'mult' ? 4 : 1} max={k === 'tvl' ? 50000000 : k === 'vol' ? 5000000 : k === 'mult' ? 30 : 100} value={v} onChange={(e) => setCalc((c) => ({ ...c, [k]: Number(e.target.value) }))} /><span className="font-mono">{v}</span></label>)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Annual Protocol Treasury Revenue', outputs.treasury],
                ['Annual LP APY', outputs.lpApy],
                ['Annual Gross Fee Revenue', outputs.gross],
                ['Annual Reserve Yield', outputs.reserve],
                ['Combined Revenue', outputs.combined],
                ['Implied FDV', outputs.fdv],
              ].map((m) => <div key={m[0]} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{m[0]}</p><p className="mt-2 font-mono text-xl">{m[0].includes('APY') ? `${(m[1] as number).toFixed(2)}%` : `$${(m[1] as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}</p></div>)}
            </div>
          </div>
        </section>

        <section id="math" className="mx-auto max-w-7xl px-6 py-14">
          <h3 className="text-3xl font-semibold">THE MATH</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {['Solvency', 'Spot price & vAMM', 'Zap routing', 'Deterministic re-anchor'].map((m, i) => (
              <div key={m} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="font-semibold">Module {i + 1} — {m}</p>
                <p className="mt-2 text-sm text-slate-600">{i === 0 && '1 full basket = 1 collateral unit. Balanced issuance keeps base-layer accounting coherent.'}{i === 1 && 'Spot responds to reserve ratio; deeper reserve dampens slippage.'}{i === 2 && 'Single-name intent is routed through basket mint and non-target unwind.'}{i === 3 && 'Sync snaps executable prices to updated fundamental NAV for next epoch.'}</p>
                <details className="mt-3 rounded-lg bg-slate-50 p-3 text-sm"><summary className="cursor-pointer font-medium">Show derivation</summary><p className="mt-2 font-mono">{i === 0 && 'NAV_i = w_i × Reserve/Baskets'}{i === 1 && 'P_i ≈ qUSDC_i / qToken_i'}{i === 2 && 'Δtarget = MintBasket + RouteNonTargets'}{i === 3 && 'Spot_{t+1,0} := NAV_{t+1,0}'}</p></details>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <h3 className="text-3xl font-semibold">Participant Ecosystem</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['Traders', 'Momentum, mean-reversion, event-driven, pairs, cross-league arb, market makers.'],
              ['Fans & communities', 'Loyalists, rivals, fantasy participants, collectors, micro-participants.'],
              ['Long-term allocators', 'Benchmark believers, index+tilt users, seasonal conviction holders.'],
              ['Hedgers', 'Competitor hedgers, KPI hedgers, seasonal risk managers.'],
              ['Liquidity providers', 'Passive seekers, strategic LPs, community LPs, professional LPs.'],
              ['League creators', 'Media brands, DAOs, communities, platforms.'],
            ].map((c) => <div key={c[0]} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="font-semibold">{c[0]}</p><p className="mt-2 text-sm text-slate-600">{c[1]}</p><p className="mt-3 text-xs text-slate-500">Podium gives continuous ranking-share exposure with sync-based market moments.</p></div>)}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <h3 className="text-2xl font-semibold">FAQ & Glossary</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">{glossary.map((g) => <div key={g[0]} className="rounded-xl border border-slate-200 bg-white p-4"><p className="font-medium">{g[0]}</p><p className="mt-2 text-sm text-slate-600">{g[1]}</p></div>)}</div>
          <div className="mt-10 rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-50 to-indigo-50 p-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Back the winner. Fade the loser.</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight">Own the standings.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} Podium · Tradable rankings, not terminal bets.</footer>

      <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-4 right-4 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white">{toast}</motion.div>}</AnimatePresence>
    </div>
  );
}
