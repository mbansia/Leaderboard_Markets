import { motion } from 'framer-motion';
import { JOURNEY_SLIDES } from '../../data/content';
import { useGuidedJourney } from '../../hooks/useGuidedJourney';
import { Section } from '../ui/Section';

function SystemDiagram() {
  return (
    <svg viewBox="0 0 620 150" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2">
      <rect x="20" y="34" width="170" height="80" rx="12" fill="#ecfeff" stroke="#67e8f9" />
      <rect x="230" y="20" width="170" height="50" rx="12" fill="#eef2ff" stroke="#a5b4fc" />
      <rect x="230" y="82" width="170" height="50" rx="12" fill="#eef2ff" stroke="#a5b4fc" />
      <rect x="440" y="34" width="160" height="80" rx="12" fill="#fffbeb" stroke="#fcd34d" />
      <text x="38" y="68" fontSize="13" fill="#0f172a">Shared Reserve</text>
      <text x="38" y="88" fontSize="11" fill="#475569">principal + accounting base</text>
      <text x="250" y="49" fontSize="12" fill="#1e1b4b">vAMM lanes</text>
      <text x="250" y="112" fontSize="11" fill="#3730a3">per-contender spot discovery</text>
      <text x="460" y="68" fontSize="13" fill="#7c2d12">Fee Shares</text>
      <text x="460" y="88" fontSize="11" fill="#92400e">LP earn-out ledger</text>
      <path d="M190 74 L230 45" stroke="#0ea5e9" strokeWidth="2" />
      <path d="M190 74 L230 108" stroke="#0ea5e9" strokeWidth="2" />
      <path d="M400 74 L440 74" stroke="#f59e0b" strokeWidth="2" />
    </svg>
  );
}

function ZapDiagram() {
  return (
    <svg viewBox="0 0 620 120" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2">
      <text x="20" y="36" fontSize="12" fill="#0f172a">USDC</text>
      <text x="130" y="36" fontSize="12" fill="#0f172a">Full Basket Mint</text>
      <text x="300" y="36" fontSize="12" fill="#0f172a">Sell non-target legs</text>
      <text x="480" y="36" fontSize="12" fill="#0f172a">Buy target</text>
      <path d="M52 32 L118 32" stroke="#0ea5e9" strokeWidth="3" markerEnd="url(#arr)" />
      <path d="M250 32 L288 32" stroke="#0ea5e9" strokeWidth="3" markerEnd="url(#arr)" />
      <path d="M450 32 L470 32" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arr)" />
      <text x="486" y="86" fontSize="12" fill="#92400e">Target units + new spot</text>
      <defs><marker id="arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" /></marker></defs>
    </svg>
  );
}

export function JourneySection() {
  const g = useGuidedJourney(JOURNEY_SLIDES.length);
  const list = g.showAll ? JOURNEY_SLIDES : [JOURNEY_SLIDES[g.index]];

  return (
    <Section id="journey" title="Guided user journey" kicker={`From zero to intuition in ${JOURNEY_SLIDES.length} slides`}>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={g.prev} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">Previous</button>
        <button onClick={g.next} className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Next</button>
        <button onClick={() => g.setShowAll(!g.showAll)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">{g.showAll ? 'Focus mode' : 'Show all steps'}</button>
      </div>
      <div className="grid gap-4">
        {list.map((slide, idx) => (
          <motion.article key={`${slide.title}-${idx}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Step {g.showAll ? idx + 1 : g.index + 1}</p>
            <h3 className="mt-2 text-2xl font-semibold">{slide.title}</h3>
            {slide.diagram === 'system' && <div className="mt-3"><SystemDiagram /></div>}
            {slide.diagram === 'zap' && <div className="mt-3"><ZapDiagram /></div>}
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <p><strong>What happens:</strong> {slide.happening}</p>
              <p><strong>Why it matters:</strong> {slide.why}</p>
              <p><strong>Function:</strong> {slide.function}</p>
              <p><strong>Rationale:</strong> {slide.rationale}</p>
              <p><strong>Tiny example:</strong> {slide.example}</p>
              <p><strong>Plain English:</strong> {slide.plain}</p>
            </div>
            {slide.underTheHood && <details className="mt-3 rounded-lg bg-slate-50 p-3"><summary>Under the hood</summary><p className="mt-2 text-sm text-slate-600">{slide.underTheHood}</p></details>}
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
