import { useMemo, useState } from 'react';
import { GLOSSARY } from '../../data/content';
import { Section } from '../ui/Section';

export function FaqSection() {
  const [category, setCategory] = useState('AI Models');
  const [oracle, setOracle] = useState('Benchmark score');
  const [cadence, setCadence] = useState('Weekly');
  const [count, setCount] = useState(6);

  const card = useMemo(() => `${category} League · ${oracle} oracle · ${cadence} sync · ${count} contenders`, [category, oracle, cadence, count]);

  return (
    <Section id="faq" title="FAQ, glossary, and final CTA" kicker="Close with clarity">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p className="font-semibold">Why not X?</p>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li>Not a prediction market: object is trajectory, not one terminal answer.</li>
            <li>Not a sportsbook: no bookmaker framing.</li>
            <li>Not a fan token: economics are standings exposure.</li>
            <li>Not an ETF clone: single-name routing + sync dynamics are distinct.</li>
            <li>Not standard AMM LPing: LP earn-out is duration-focused.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p className="font-semibold">Build-a-league mini configurator</p>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded border border-slate-200 p-2"><option>AI Models</option><option>Sports</option><option>Creators</option><option>Crypto Protocols</option></select>
            <select value={oracle} onChange={(e) => setOracle(e.target.value)} className="rounded border border-slate-200 p-2"><option>Benchmark score</option><option>Points table</option><option>TVL share</option><option>Engagement index</option></select>
            <select value={cadence} onChange={(e) => setCadence(e.target.value)} className="rounded border border-slate-200 p-2"><option>Daily</option><option>Weekly</option><option>Matchweek</option><option>Monthly</option></select>
            <input type="number" min={3} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="rounded border border-slate-200 p-2" />
          </div>
          <p className="mt-3 rounded bg-cyan-50 p-2 font-medium text-cyan-900">Generated concept: {card}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(GLOSSARY).map(([k, v]) => <article key={k} className="rounded-xl border border-slate-200 bg-white p-3"><p className="font-medium">{k}</p><p className="mt-1 text-sm text-slate-600">{v}</p></article>)}
      </div>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-50 to-indigo-50 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Objective leaderboards become live markets</p>
        <p className="mt-2 text-4xl font-semibold">Own the standings.</p>
      </div>
    </Section>
  );
}
