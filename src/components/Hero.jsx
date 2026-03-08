import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-glow backdrop-blur-xl lg:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_40%)]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <p className="mb-4 text-sm uppercase tracking-[0.22em] text-cyan-400">Podium Protocol</p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-50 lg:text-6xl">
          Back the winner. Fade the loser. <span className="text-cyan-400">Own the standings.</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          We rank everything—AI models, creators, sports teams, protocols. But until now, you couldn't invest in
          relative performance. Leaderboard Markets turn objective standings into continuous, tradable infrastructure.
        </p>
        <div className="mt-6 inline-flex rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-xs text-slate-300">
          Not a binary prediction market. A new market primitive for pricing relative performance.
        </div>
      </motion.div>
    </section>
  )
}
