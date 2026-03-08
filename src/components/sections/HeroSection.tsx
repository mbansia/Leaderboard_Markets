import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section id="top" className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">A new market primitive</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight md:text-7xl">Own the standings.</h1>
        <p className="mt-6 text-lg text-slate-600">Podium turns objective leaderboards into continuous markets for relative performance. Back the winner. Fade the loser. Own the standings.</p>
        <div className="mt-8 flex gap-3">
          <a href="#journey" className="rounded-full bg-slate-900 px-5 py-3 text-white">Start guided journey</a>
          <a href="#simulate" className="rounded-full border border-slate-300 bg-white px-5 py-3">Open simulator</a>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-soft">
        <svg viewBox="0 0 560 320" className="w-full">
          <rect x="20" y="20" width="520" height="280" rx="24" fill="#f8fafc" stroke="#e2e8f0" />
          <path d="M60 240 C160 190,260 220,500 100" stroke="#f59e0b" strokeWidth="3" fill="none" strokeDasharray="5 7" />
          {[0, 1, 2].map((i) => <motion.rect key={i} x={85 + i * 140} y={185 - i * 24} width="100" height={75 + i * 24} rx="14" fill={['#cbd5e1', '#38bdf8', '#6366f1'][i]} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3 + i }} />)}
          <motion.circle cx="470" cy="88" r="12" fill="#06b6d4" animate={{ scale: [1, 1.35, 1] }} transition={{ repeat: Infinity, duration: 2.4 }} />
        </svg>
      </motion.div>
    </section>
  );
}
