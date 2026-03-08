import { GLOSSARY } from '../../data/content';
import { Section } from '../ui/Section';

export function FaqSection() {
  return (
    <Section id="faq" title="FAQ, glossary, and final CTA" kicker="Close with clarity">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p className="font-semibold">Why not X?</p>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li>Not a prediction market: object is trajectory, not one terminal answer.</li>
            <li>Not a sportsbook: no bookmaker framing.</li>
            <li>Not a fan token: economics are standings exposure.</li>
            <li>Not an ETF clone: single-name routing + sync dynamics are unique.</li>
            <li>Not standard AMM LPing: LP earn-out is duration-focused.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p className="font-semibold">Mini build-a-league configurator</p>
          <p className="mt-2 text-slate-600">Category: AI · Oracle: benchmark composite · Sync: weekly · Contenders: 8</p>
          <p className="mt-2 rounded bg-cyan-50 p-2">Generated concept: “Frontier AI league” with weekly sync and single-name routing.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(GLOSSARY).map(([k, v]) => <article key={k} className="rounded-xl border border-slate-200 bg-white p-3"><p className="font-medium">{k}</p><p className="mt-1 text-sm text-slate-600">{v}</p></article>)}
      </div>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-50 to-indigo-50 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Back the winner. Fade the loser.</p>
        <p className="mt-2 text-4xl font-semibold">Own the standings.</p>
      </div>
    </Section>
  );
}
