import { motion } from 'framer-motion';
import { CANONICAL_STEPS, canonicalNotes, type CanonicalState } from '../../data/canonicalJourney';
import { useGuidedJourney } from '../../hooks/useGuidedJourney';
import { Section } from '../ui/Section';

const f = (n: number) => n.toFixed(2);

function changed(a: number, b: number) {
  return Math.abs(a - b) > 0.001;
}

function ReserveTable({ before, after }: { before: CanonicalState; after: CanonicalState }) {
  const rows = [
    ['Shared reserve (USDC)', before.reserveUsdc, after.reserveUsdc],
    ['Basket units outstanding', before.basketUnits, after.basketUnits],
    ['NAV Token A', before.nav.a, after.nav.a],
    ['NAV Token B', before.nav.b, after.nav.b],
    ['NAV Token C', before.nav.c, after.nav.c],
  ];
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map(([label, b, a]) => (
          <tr key={label as string} className="border-t border-slate-100">
            <td className="py-1 text-slate-600">{label as string}</td>
            <td className="py-1 font-mono">{f(b as number)}</td>
            <td className={`py-1 font-mono ${changed(b as number, a as number) ? 'bg-cyan-50 text-cyan-800' : ''}`}>{f(a as number)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LaneTable({ before, after }: { before: CanonicalState; after: CanonicalState }) {
  const lanes = ['a', 'b', 'c'] as const;
  return (
    <table className="w-full text-sm">
      <thead><tr className="text-left text-slate-500"><th>Lane</th><th>Before (x,y,spot)</th><th>After (x,y,spot)</th></tr></thead>
      <tbody>
        {lanes.map((k) => {
          const b = before.lanes[k];
          const a = after.lanes[k];
          const isChanged = changed(b.x, a.x) || changed(b.y, a.y) || changed(b.spot, a.spot);
          return (
            <tr key={k} className="border-t border-slate-100">
              <td className="py-1 font-medium">Token {k.toUpperCase()}</td>
              <td className="py-1 font-mono">x {f(b.x)} · y {f(b.y)} · {f(b.spot)}</td>
              <td className={`py-1 font-mono ${isChanged ? 'bg-amber-50 text-amber-800' : ''}`}>x {f(a.x)} · y {f(a.y)} · {f(a.spot)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function PositionTable({ before, after }: { before: CanonicalState; after: CanonicalState }) {
  const entities = [
    ['LP', before.positions.lp, after.positions.lp],
    ['User 1', before.positions.user1, after.positions.user1],
    ['User 2', before.positions.user2, after.positions.user2],
  ] as const;
  return (
    <table className="w-full text-sm">
      <thead><tr className="text-left text-slate-500"><th>Participant</th><th>Before (USDC,A,B,C)</th><th>After (USDC,A,B,C)</th></tr></thead>
      <tbody>
        {entities.map(([name, b, a]) => {
          const isChanged = ['usdc', 'a', 'b', 'c'].some((k) => changed((b as any)[k], (a as any)[k]));
          return (
            <tr key={name} className="border-t border-slate-100">
              <td className="py-1 font-medium">{name}</td>
              <td className="py-1 font-mono">{f(b.usdc)} · {f(b.a)} · {f(b.b)} · {f(b.c)}</td>
              <td className={`py-1 font-mono ${isChanged ? 'bg-emerald-50 text-emerald-800' : ''}`}>{f(a.usdc)} · {f(a.a)} · {f(a.b)} · {f(a.c)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function JourneySection() {
  const g = useGuidedJourney(CANONICAL_STEPS.length);
  const visible = g.showAll ? CANONICAL_STEPS : [CANONICAL_STEPS[g.index]];

  return (
    <Section id="journey" title="Guided user journey" kicker="One canonical 3-token walkthrough">
      <p className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">{canonicalNotes.feeAssumption}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={g.prev} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">Previous step</button>
        <button onClick={g.next} className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Next step</button>
        <button onClick={() => g.setShowAll(!g.showAll)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">{g.showAll ? 'Show one step' : 'Show all steps'}</button>
      </div>

      <div className="grid gap-4">
        {visible.map((step, idx) => (
          <motion.article key={step.id + idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{step.title}</p>
            <p className="mt-2 text-slate-700"><strong>Story:</strong> {step.story}</p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Before</p>
                <ReserveTable before={step.before} after={step.before} />
                <div className="mt-3"><LaneTable before={step.before} after={step.before} /></div>
                <div className="mt-3"><PositionTable before={step.before} after={step.before} /></div>
              </div>

              <div className="rounded-xl bg-cyan-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">Action math</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {step.actionMath.map((line) => <li key={line}>{line}</li>)}
                </ul>
                <p className="mt-3 text-xs text-cyan-900">{canonicalNotes.pricingLane}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">After</p>
              <ReserveTable before={step.before} after={step.after} />
              <div className="mt-3"><LaneTable before={step.before} after={step.after} /></div>
              <div className="mt-3"><PositionTable before={step.before} after={step.after} /></div>
            </div>

            <p className="mt-3 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900"><strong>Why this matters:</strong> {step.whyItMatters}</p>
            <p className="mt-2 text-sm font-medium text-slate-700">Takeaway: {step.takeaway}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
