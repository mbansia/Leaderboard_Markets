import { useState } from 'react';
import { motion } from 'framer-motion';
import { LEARN_STEPS } from '../data/markets';

export function LearnSection() {
  const [step, setStep] = useState(0);
  const progress = ((step + 1) / LEARN_STEPS.length) * 100;

  return (
    <section className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Lifecycle Walkthrough</h2>
        <p className="mono text-xs text-slate-400">Step {step + 1} / {LEARN_STEPS.length}</p>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-800">
        <motion.div className="h-2 rounded-full bg-cyan-400" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      </div>

      <div className="grid gap-2 md:grid-cols-6">
        {LEARN_STEPS.map((item, idx) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setStep(idx)}
            className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
              step === idx ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300' : 'border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            <p className="mono text-[10px] text-slate-500">{String(idx + 1).padStart(2, '0')}</p>
            <p className="mt-1">{item.title}</p>
          </button>
        ))}
      </div>

      <motion.div
        key={LEARN_STEPS[step].title}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5"
      >
        <p className="mb-3 text-sm uppercase tracking-[0.16em] text-cyan-400">Step {step + 1}</p>
        <h3 className="text-xl font-semibold">{LEARN_STEPS[step].title}</h3>
        <p className="mt-3 text-slate-300">{LEARN_STEPS[step].mechanic}</p>
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-400">Design Rationale</p>
          <p className="mt-2 text-slate-300">{LEARN_STEPS[step].rationale}</p>
        </div>
      </motion.div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Invariant</p>
          <p className="mono mt-2 text-cyan-300">NAV_i = w_i</p>
          <p className="mt-1 text-sm text-slate-400">Oracle weights anchor fundamental value at every sync boundary.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Router Principle</p>
          <p className="mono mt-2 text-amber-400">mint basket → route legs</p>
          <p className="mt-1 text-sm text-slate-400">Single-name UX with balanced primary issuance underneath.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">LP Economics</p>
          <p className="mono mt-2 text-cyan-300">fees + reserve yield</p>
          <p className="mt-1 text-sm text-slate-400">Duration-based fee shares align long-term liquidity providers.</p>
        </div>
      </div>
    </section>
  );
}
