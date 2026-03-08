import { useState } from 'react';
import { CANONICAL_STEPS } from '../../data/canonicalJourney';
import type { DetailMode } from '../../types/market';
import { Section } from '../ui/Section';

const modules = [
  {
    title: 'Full-basket solvency',
    beginner: '1,000 USDC mints exactly 1 basket = 1 A + 1 B + 1 C.',
    worked: 'Genesis: reserve 1,000, basket units 1.00, token NAV 333.33 each.',
    formula: 'Basket = A + B + C; NAV_i = weight_i × 1,000',
  },
  {
    title: 'Oracle weight → NAV',
    beginner: 'Equal weights start at 333.33 each. Oracle later moves to 40/30/30.',
    worked: 'With reserve 1,500 and baskets 1.50, next NAV is A 400, B 300, C 300.',
    formula: 'NAV_i,next = w_i,next × (reserve / basketUnits)',
  },
  {
    title: 'Spot and slippage in lanes',
    beginner: 'Each lane has x (quote) and y (token); spot is x/y.',
    worked: 'After User 1 buys A, A lane moves to x 1181.82, y 2.54, spot 465.28.',
    formula: 'spot_i = x_i / y_i',
  },
  {
    title: 'Zap routing for single-name buy',
    beginner: 'Buy A means basket mint first, then non-target unwinds, then extra A buy.',
    worked: '300 USDC → 0.30 baskets; sell 0.30 B + 0.30 C; recover 181.82; buy ~0.46 extra A; total ~0.76 A.',
    formula: 'targetReceived = basketTargetLeg + routedTargetOut',
  },
  {
    title: 'Deterministic sync',
    beginner: 'Spots drift during trading. Sync re-opens from new NAV anchors.',
    worked: 'Pre-sync B spot ~244.90; post-sync B anchor 300.00.',
    formula: 'spot_open,next := NAV_next',
  },
  {
    title: 'LP earn-out intuition',
    beginner: 'LP rewards scale with principal parked over time.',
    worked: 'LP1: 1,000 for full period beats LP2: 500 from midpoint.',
    formula: 'earnWeight ∝ principal × time',
  },
  {
    title: 'Adding contenders safely',
    beginner: 'Additions happen at sync boundaries, not mid-epoch.',
    worked: 'A/B/C example remains coherent; new token would be introduced at a sync rebalance.',
    formula: 'Σ weights = 1.0 at each sync',
  },
  {
    title: 'Seasonal settlement',
    beginner: 'Final sync locks terminal weights and enables clean redemption.',
    worked: 'If terminal weights are 40/30/30, redemption uses those locked NAVs.',
    formula: 'redeemValue = qty × terminalNAV',
  },
];

export function MathSection({ mode }: { mode: DetailMode }) {
  const [i, setI] = useState(0);
  const m = modules[i];

  return (
    <Section id="math" title="The math" kicker="Same 3-token story, from plain to advanced">
      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        Canonical walkthrough reference: {CANONICAL_STEPS[0].title} → {CANONICAL_STEPS[7].title}
      </div>
      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {modules.map((x, idx) => (
            <button key={x.title} onClick={() => setI(idx)} className={`w-full rounded-lg p-3 text-left text-sm ${idx === i ? 'bg-indigo-100' : 'border border-slate-200 bg-white'}`}>
              {idx + 1}. {x.title}
            </button>
          ))}
        </div>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-2xl font-semibold">{m.title}</h3>
          <p className="mt-2 text-slate-700"><strong>Beginner view:</strong> {m.beginner}</p>
          <p className="mt-2 text-sm text-slate-600"><strong>Worked with A/B/C:</strong> {m.worked}</p>
          {mode === 'advanced' && <p className="mt-3 rounded-lg bg-slate-50 p-3 font-mono text-sm">{m.formula}</p>}
        </article>
      </div>
    </Section>
  );
}
