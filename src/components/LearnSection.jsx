import { useState } from 'react';
import { motion } from 'framer-motion';
import { LEARN_STEPS } from '../data/markets';

const participantValue = [
  ['Traders & Hedgers', 'Clean single-name exposure to relative performance without requiring absolute market beta.'],
  ['Fans & Communities', 'Turns support into tradable skin-in-the-game around creators, teams, and protocols.'],
  ['Liquidity Providers (LPs)', 'Earn time-based fee shares on duration in reserve without picking winners.'],
  ['Market Makers & Arbitrageurs', 'Capture repeatable spread flow plus structured sync-boundary arbitrage opportunities.'],
  ['League Creators & Contenders', 'Objective public pricing layer that compounds attention, engagement, and monetization.'],
];

const categoryMap = {
  phase1: {
    title: 'Phase 1 (High Demand / Proven Behavior)',
    demand: 'Extremely High initial PMF',
    bars: 92,
    items: [
      'AI / LLM Leagues (Chatbot Arena, Coding Benchmarks)',
      'Crypto-Native Leagues (DEX Volume, L2 Activity, Protocol Revenue)',
      'Creator Leagues (YouTube / TikTok subscriber velocity)',
    ],
    note: 'Millions of users already check these rankings daily; Podium adds the financial expression layer.',
  },
  phase2: {
    title: 'Phase 2 (Mainstream Expansion)',
    demand: 'Large follow-on expansion demand',
    bars: 74,
    items: [
      'Sports Leagues (EPL Table, F1 Constructors)',
      'Music & Culture (Streaming Top 50, Box Office Holdover)',
      'ESG & Macro leaderboards',
      'Private Company Performance (Revenue Growth, AI Adoption)',
    ],
    note: 'Expands the primitive into mainstream behavior once oracle feeds and distribution are in place.',
  },
};

export function LearnSection() {
  const [step, setStep] = useState(0);
  const progress = ((step + 1) / LEARN_STEPS.length) * 100;
  const isFirst = step === 0;
  const isLast = step === LEARN_STEPS.length - 1;
  const isCategoryMap = LEARN_STEPS[step].title === 'The Category Map & Estimated Demand';

  return (
    <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Lifecycle Walkthrough</h2>
        <p className="mono text-xs text-slate-500">Step {step + 1} / {LEARN_STEPS.length}</p>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-200">
        <motion.div className="h-2 rounded-full bg-cyan-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      </div>

      <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-5">
        {LEARN_STEPS.map((item, idx) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setStep(idx)}
            className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
              step === idx ? 'border-cyan-500 bg-cyan-50 text-cyan-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <p className="mono text-[10px] text-slate-400">{String(idx + 1).padStart(2, '0')}</p>
            <p className="mt-1">{item.title}</p>
          </button>
        ))}
      </div>

      <motion.div
        key={LEARN_STEPS[step].title}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <p className="mb-3 text-sm uppercase tracking-[0.16em] text-cyan-600">Step {step + 1}</p>
        <h3 className="text-xl font-semibold text-slate-900">{LEARN_STEPS[step].title}</h3>
        <p className="mt-3 text-slate-700">{LEARN_STEPS[step].mechanic}</p>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-600">Design Rationale</p>
          <p className="mt-2 text-slate-700">{LEARN_STEPS[step].rationale}</p>
        </div>

        {isCategoryMap && (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {[categoryMap.phase1, categoryMap.phase2].map((phase) => (
              <div key={phase.title} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{phase.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-cyan-700">Estimated Demand: {phase.demand}</p>
                <div className="mt-2 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: `${phase.bars}%` }} />
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-slate-500">{phase.note}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {isFirst && (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-slate-700">
          <p className="font-medium text-cyan-700">Key reframing:</p>
          <p className="mt-1">Not “Will X happen?” but “What share of the pool does each contender deserve right now?”</p>
        </div>
      )}

      {isLast && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {participantValue.map(([title, body]) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-sm text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
