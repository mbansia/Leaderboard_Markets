import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hero } from './components/Hero';
import { PathwayTabs } from './components/PathwayTabs';
import { LearnSection } from './components/LearnSection';
import { SimulateSection } from './components/SimulateSection';
import { EstimateSection } from './components/EstimateSection';

const subtitles = {
  Learn: 'Understand lifecycle mechanics and why each design choice preserves solvency and objective price anchors.',
  Simulate: 'Drive a contract-like state machine: run zaps, perturb liquidity, edit oracle weights, then trigger deterministic sync.',
  Estimate: 'Model Podium as a cash-flowing protocol business across different growth and monetization assumptions.',
};

export default function App() {
  const [active, setActive] = useState('Learn');

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <Hero />
        <PathwayTabs active={active} onChange={setActive} />
        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{active} Mode</p>
          <p className="mt-1 text-slate-300">{subtitles[active]}</p>
        </section>
        <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {active === 'Learn' && <LearnSection />}
          {active === 'Simulate' && <SimulateSection />}
          {active === 'Estimate' && <EstimateSection />}
        </motion.div>
        <footer className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4 text-xs text-slate-500">
          Stateless demonstration UI only. No wallet, no custody, no backend, and no live market execution.
        </footer>
      </div>
    </main>
  );
}
