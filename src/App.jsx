import { useState } from 'react'
import { motion } from 'framer-motion'
import { Hero } from './components/Hero'
import { LearnExperience } from './components/LearnExperience'
import { SimulateExperience } from './components/SimulateExperience'
import { EstimateExperience } from './components/EstimateExperience'

const PATHS = ['Learn', 'Simulate', 'Estimate']

function PathButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
        active
          ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
          : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:text-slate-100'
      }`}
    >
      {children}
    </button>
  )
}

export default function App() {
  const [activePath, setActivePath] = useState('Learn')

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-8 font-sans md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <Hero />

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Explore the primitive</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {PATHS.map((path) => (
              <PathButton key={path} active={activePath === path} onClick={() => setActivePath(path)}>
                {path}
              </PathButton>
            ))}
          </div>
        </section>

        <motion.div key={activePath} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {activePath === 'Learn' && <LearnExperience />}
          {activePath === 'Simulate' && <SimulateExperience />}
          {activePath === 'Estimate' && <EstimateExperience />}
        </motion.div>
      </div>
    </main>
  )
}
