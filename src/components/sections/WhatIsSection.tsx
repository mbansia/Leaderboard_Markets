import { Section } from '../ui/Section';

export function WhatIsSection() {
  return (
    <Section id="what" title="What is a leaderboard market?" kicker="Plain-language overview">
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-600">A leaderboard market is a live market where each token represents a contender’s share of the standings. You are trading relative position over time, not a one-time yes/no event.</p>
          <p className="mt-4 text-sm text-slate-600">Why now: objective rankings already exist everywhere, and modern market rails can turn those standings into continuous price discovery.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-cyan-50 p-5">
          <p className="text-sm text-slate-700"><strong>What you are buying:</strong> exposure to standing share that updates as rankings and order flow evolve.</p>
          <p className="mt-4 text-sm text-slate-700"><strong>What this is not:</strong> not a sportsbook, not a fan token utility point, and not a binary event contract.</p>
        </article>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {[
          ['ETFs', 'Pooled ownership'],
          ['Fan tokens', 'Engagement utility'],
          ['Prediction markets', 'Discrete event answers'],
          ['Leaderboard markets', 'Tradable standing share'],
        ].map((x, i) => (
          <div key={x[0]} className={`rounded-xl border p-4 text-sm ${i === 3 ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 bg-white'}`}>
            <p className="font-medium">{x[0]}</p>
            <p className="text-slate-600">{x[1]}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
