import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hero } from './components/Hero';
import { PathwayTabs } from './components/PathwayTabs';
import { LearnSection } from './components/LearnSection';
import { SimulateSection } from './components/SimulateSection';
import { EstimateSection } from './components/EstimateSection';
import { MathSection } from './components/MathSection';


const journeyTips = {
  Learn: ['🧠 Read each lifecycle step in order.', '📌 Focus on the design rationale callouts.', '✅ Finish with participant value map.'],
  Simulate: ['🎬 Pick a role and use Run Step.', '🧮 Watch PnL cards after each action.', '🔄 Edit oracle weights before sync.'],
  Estimate: ['🎚️ Move one slider at a time.', '📈 Observe treasury vs LP trade-offs.', '🧭 Use this for scenario planning only.'],
  Math: ['🧩 Move sliders and inspect formulas.', '🔍 Compare spot vs NAV explicitly.', '🚀 Use SYNC and Run Math buttons to animate flow.'],
};

const subtitles = {
  Learn: 'Understand the full lifecycle and why leaderboard markets create continuous, non-terminal liquidity.',
  Simulate: 'Step through role-based stories for traders and LPs with live PnL, routing, and oracle sync behavior.',
  Estimate: 'Model protocol economics and split outcomes between treasury and LP supply-side capital.',
  Math: 'Interact with solvency, vAMM, router, and sync formulas to build intuition from first principles.',
};

export default function App() {
  const [active, setActive] = useState('Learn');

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <Hero />
        <PathwayTabs active={active} onChange={setActive} />
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{active} Mode</p>
          <p className="mt-1 text-slate-700">{subtitles[active]}</p>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {journeyTips[active].map((tip) => (
              <p key={tip} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{tip}</p>
            ))}
          </div>
        </section>
        <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {active === 'Learn' && <LearnSection />}
          {active === 'Simulate' && <SimulateSection />}
          {active === 'Estimate' && <EstimateSection />}
          {active === 'Math' && <MathSection />}
        </motion.div>
      </div>
    </main>
  );
}
