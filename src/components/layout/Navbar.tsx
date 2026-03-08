import type { DetailMode, Persona } from '../../types/market';

const links = ['what', 'journey', 'compare', 'learn', 'simulate', 'categories', 'ecosystem', 'math', 'faq'];

export function Navbar({ mode, setMode, persona, setPersona }: { mode: DetailMode; setMode: (m: DetailMode) => void; persona: Persona; setPersona: (p: Persona) => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <a href="#top" className="font-semibold">Podium · Leaderboard Markets</a>
        <nav className="hidden gap-3 text-xs md:flex">{links.map((l) => <a key={l} href={`#${l}`} className="rounded px-2 py-1 hover:bg-slate-100">{l.toUpperCase()}</a>)}</nav>
        <div className="flex items-center gap-2">
          <select aria-label="Persona lens" value={persona} onChange={(e) => setPersona(e.target.value as Persona)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs">
            {(['Trader', 'Fan', 'LP', 'League Creator'] as Persona[]).map((p) => <option key={p}>{p}</option>)}
          </select>
          <button className="rounded-lg border border-slate-200 px-2 py-1 text-xs" onClick={() => setMode(mode === 'beginner' ? 'advanced' : 'beginner')}>{mode === 'beginner' ? 'Beginner' : 'Advanced'}</button>
        </div>
      </div>
    </header>
  );
}
