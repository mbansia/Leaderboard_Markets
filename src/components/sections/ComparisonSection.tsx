import { Section } from '../ui/Section';

const rows = [
  ['Object being priced', 'Answer to a question', 'Share of the standings'],
  ['Market life', 'Usually terminal', 'Continuous with optional seasonal close'],
  ['Relative performance', 'Indirect', 'Core primitive'],
  ['Liquidity shape', 'Fragments across many questions', 'Concentrates around one leaderboard'],
  ['Recurring moments', 'Question-specific', 'Scheduled sync cadence'],
  ['Emotional attachment', 'Event-centric', 'Trajectory-centric'],
];

export function ComparisonSection() {
  return (
    <Section id="compare" title="Prediction markets vs leaderboard markets" kicker="Fair comparison">
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
