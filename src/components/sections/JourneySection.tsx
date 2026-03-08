import { motion } from 'framer-motion';
import { JOURNEY_SLIDES } from '../../data/content';
import { useGuidedJourney } from '../../hooks/useGuidedJourney';
import { Section } from '../ui/Section';

export function JourneySection() {
  const g = useGuidedJourney(JOURNEY_SLIDES.length);
  const list = g.showAll ? JOURNEY_SLIDES : [JOURNEY_SLIDES[g.index]];

  return (
    <Section id="journey" title="Guided user journey" kicker="From zero to intuition in 9 slides">
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
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <p><strong>What happens:</strong> {slide.happening}</p>
              <p><strong>Why it matters:</strong> {slide.why}</p>
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
