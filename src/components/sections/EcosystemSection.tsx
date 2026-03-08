import { useState } from 'react';
import { PARTICIPANTS } from '../../data/participants';
import { Section } from '../ui/Section';

export function EcosystemSection() {
  const [idx, setIdx] = useState(0);
  const p = PARTICIPANTS[idx];
  return (
    <Section id="ecosystem" title="Ecosystem value props" kicker="Who gets value and why">
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <div className="space-y-2">{PARTICIPANTS.map((g, i) => <button key={g.group} className={`w-full rounded-lg p-3 text-left ${i === idx ? 'bg-cyan-100' : 'border border-slate-200 bg-white'}`} onClick={() => setIdx(i)}>{g.group}</button>)}</div>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-2xl font-semibold">{p.group}</h3>
          <p className="mt-2 text-sm"><strong>Archetypes:</strong> {p.archetypes.join(', ')}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2 text-sm">
            <p><strong>What they want:</strong> {p.want}</p>
            <p><strong>What Podium gives:</strong> {p.podium}</p>
            <p><strong>Upside:</strong> {p.upside}</p>
            <p><strong>Key risk:</strong> {p.risk}</p>
          </div>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm"><strong>Why different:</strong> {p.diff}</p>
        </article>
      </div>
    </Section>
  );
}
