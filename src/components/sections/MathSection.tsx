import { useState } from 'react';
import type { DetailMode } from '../../types/market';
import { Section } from '../ui/Section';

const modules = [
  ['Full-basket solvency', 'Balanced issuance keeps the reserve coherent.', '1 basket = 1 collateral unit'],
  ['Oracle weight → NAV', 'Weights translate directly into fundamental NAV.', 'NAV_i = w_i × reserve/baskets'],
  ['Spot price and slippage', 'Spot comes from reserves and changes with trade size.', 'spot_i = x_i / y_i'],
  ['Zap routing', 'Single-name intent routes through basket mechanics.', 'target_out = basket_leg + route_out'],
  ['Deterministic sync', 'Sync reopens market at updated fundamentals.', 'spot_open,next := NAV_next'],
  ['LP earn-out intuition', 'Fee-share tracks principal parked over time.', 'earn_share ∝ principal × time'],
  ['Adding new contender', 'Reweight at sync boundary with anti-dilution framing.', 'sum weights stays 1.0'],
  ['Seasonal settlement', 'Terminal sync gives deterministic redemption path.', 'redeem = terminal NAV × qty'],
];

export function MathSection({ mode }: { mode: DetailMode }) {
  const [i, setI] = useState(0);
  const m = modules[i];
  return (
    <Section id="math" title="The math" kicker="Layered comprehension">
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <div className="space-y-2">{modules.map((x, idx) => <button key={x[0]} onClick={() => setI(idx)} className={`w-full rounded-lg p-3 text-left text-sm ${idx === i ? 'bg-indigo-100' : 'border border-slate-200 bg-white'}`}>{idx + 1}. {x[0]}</button>)}</div>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-2xl font-semibold">{m[0]}</h3>
          <p className="mt-2 text-slate-600"><strong>Plain English:</strong> {m[1]}</p>
          <p className="mt-2 rounded-lg bg-slate-50 p-3 font-mono text-sm"><strong>Formula:</strong> {m[2]}</p>
          <p className="mt-2 text-sm text-slate-600"><strong>Worked example:</strong> With reserve 1,000,000 and weight 0.24, NAV is 0.24; if aggressive buys push spot to 0.27, sync can re-anchor next epoch to updated oracle NAV.</p>
          {mode === 'advanced' && <details className="mt-3 rounded-lg bg-slate-50 p-3 text-sm"><summary>Optional derivation</summary><p className="mt-2">Reserve adjustments are shown with constant-product intuition for each contender and deterministic re-anchoring at sync boundaries.</p></details>}
        </article>
      </div>
    </Section>
  );
}
