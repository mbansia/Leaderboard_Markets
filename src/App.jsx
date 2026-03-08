import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hero } from './components/Hero';
import { PathwayTabs } from './components/PathwayTabs';
import { LearnSection } from './components/LearnSection';
import { SimulateSection } from './components/SimulateSection';
import { EstimateSection } from './components/EstimateSection';

const subtitles = {
  Learn: 'Understand the full lifecycle and why leaderboard markets create continuous, non-terminal liquidity.',
  Simulate: 'Step through role-based stories for traders and LPs with live PnL, routing, and oracle sync behavior.',
  Estimate: 'Model protocol economics and split outcomes between treasury and LP supply-side capital.',
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
        </section>
        <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {active === 'Learn' && <LearnSection />}
          {active === 'Simulate' && <SimulateSection />}
          {active === 'Estimate' && <EstimateSection />}
        </motion.div>
      </div>
    </main>
  );
}
