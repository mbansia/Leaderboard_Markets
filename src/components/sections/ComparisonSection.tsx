import { Section } from '../ui/Section';

const rows = [
  ['What is being traded', 'Answer to a specific question', 'Share of a live leaderboard'],
  ['Market lifecycle', 'Usually ends at resolution', 'Continuous, with optional seasonal close'],
  ['Relative-performance expression', 'Limited', 'Core use case'],
  ['Liquidity pattern', 'Scatters across many separate questions', 'Concentrates around one standings object'],
  ['Recurring update moments', 'Depends on each question', 'Built-in sync cadence'],
  ['Primary user mindset', 'Will this happen or not?', 'Who gains or loses standing share over time?'],
];

export function ComparisonSection() {
  return (
    <Section id="compare" title="Prediction markets vs leaderboard markets" kicker="Both are useful, for different jobs">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3 text-left">Dimension</th><th className="p-3 text-left">Prediction markets</th><th className="p-3 text-left">Leaderboard markets</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]} className="border-t border-slate-100"><td className="p-3 font-medium">{r[0]}</td><td className="p-3">{r[1]}</td><td className="p-3">{r[2]}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="mt-4 rounded-xl bg-indigo-50 p-4 text-indigo-900">Prediction markets price answers. Leaderboard markets price trajectories.</p>
    </Section>
  );
}
