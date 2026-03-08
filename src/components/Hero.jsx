import { Logo } from './Logo';

export function Hero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <Logo />
      <h1 className="mt-3 max-w-5xl text-4xl font-semibold leading-tight text-slate-900 md:text-6xl">A market primitive for relative performance.</h1>
      <p className="mt-5 max-w-4xl text-lg text-slate-700 md:text-xl">
        We rank everything—AI models, creators, sports teams, protocols. But until now, you couldn&apos;t invest in relative performance.
        Podium turns objective leaderboards into continuous, tradable markets. Back the winner. Fade the loser. Own the standings.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Issuance Rule</p>
          <p className="mono mt-1 text-cyan-700">$1.00 → 1 full basket</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Fundamental Anchor</p>
          <p className="mono mt-1 text-cyan-700">NAV_i = Oracle Weight_i</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Trading UX</p>
          <p className="mono mt-1 text-amber-600">Single-name ZAP execution</p>
        </div>
      </div>
    </section>
  );
}
