import { useState } from 'react';
import { LEARN_STEPS } from '../../data/content';
import { CANONICAL_STEPS } from '../../data/canonicalJourney';
import type { DetailMode } from '../../types/market';
import { Section } from '../ui/Section';

const canonicalHint: Record<string, string> = {
  basket: CANONICAL_STEPS[0].title,
  reserve: CANONICAL_STEPS[1].title,
  zap: CANONICAL_STEPS[2].title,
  sync: CANONICAL_STEPS[5].title,
  lp: CANONICAL_STEPS[7].title,
  add: 'Extends the same A/B/C logic at sync boundaries',
  season: 'Uses the same A/B/C settlement logic at terminal sync',
  perp: 'Repeats the same A/B/C cycle across epochs',
  why: 'All eight canonical steps together',
};

export function LearnSection({ mode }: { mode: DetailMode }) {
  const [idx, setIdx] = useState(0);
  const step = LEARN_STEPS[idx];

  return (
    <Section id="learn" title="Learn the mechanism" kicker="Deeper explanation, same 3-token example">
      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {LEARN_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setIdx(i)} className={`w-full rounded-lg p-3 text-left text-sm ${i === idx ? 'bg-cyan-100' : 'border border-slate-200 bg-white'}`}>
              {i + 1}. {s.title}
            </button>
          ))}
        </div>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-2xl font-semibold">{step.title}</h3>
          <p className="mt-2 text-slate-600">{step.plainEnglish}</p>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm"><strong>Canonical reference:</strong> {canonicalHint[step.id]}</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Function in system</p>
              <p className="mt-1 text-sm">{step.whyItMatters}</p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3">
              <p className="text-xs uppercase text-indigo-700">Design rationale</p>
              <p className="mt-1 text-sm">{step.designRationale}</p>
            </div>
          </div>

          {mode === 'advanced' && (
            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
              <strong>Under the hood:</strong> {step.underTheHood}
            </p>
          )}

          <p className="mt-3 font-mono text-sm">Worked example: {step.workedExample}</p>
        </article>
      </div>
    </Section>
  );
}
