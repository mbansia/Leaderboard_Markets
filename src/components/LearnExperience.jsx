import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  {
    title: 'The Shared Yield Reserve & Full-Basket Minting',
    mechanics:
      'All capital enters one central reserve. The protocol only mints full baskets: exactly 1 unit of every contender per $1 deposited.',
    rationale:
      'Balanced issuance guarantees solvency. Fundamental NAV is locked to oracle weight (NAVᵢ = wᵢ), so no contender can be diluted by one-sided token inflation.',
  },
  {
    title: 'Single-Name Trading via the Zap Router',
    mechanics:
      'To buy one name, the router mints a full basket, keeps the target token, and routes non-target legs through isolated secondary pools to accumulate more target exposure.',
    rationale:
      'Users get familiar swap UX while the protocol core remains mathematically balanced and solvent.',
  },
  {
    title: 'Oracle Sync and Deterministic Re-Anchor',
    mechanics:
      'At each scheduled boundary, oracle weights update and every vAMM quote reserve is reset so Spot Price equals new Oracle NAV before the next trading epoch.',
    rationale:
      'Markets can discover price between syncs, but regular deterministic re-anchors prevent runaway speculative drift from objective leaderboard reality.',
  },
  {
    title: 'LP Fee Shares and Duration-Based Earnings',
    mechanics:
      'LPs add full-basket liquidity and accrue Fee Shares over time. Shares are burned later to claim protocol fees and reserve yield.',
    rationale:
      'Duration—not winner picking—drives returns. Time-based accrual protects historical earnings from dilution by short-lived liquidity.',
  },
  {
    title: 'Adding a New Contender',
    mechanics:
      'At sync, incumbent weights are proportionally scaled down and the new contender enters with allocated weight. Existing holders receive an airdrop based on portfolio value.',
    rationale:
      'Universe expansion becomes economically neutral: no incumbent holder is penalized when the leaderboard evolves.',
  },
  {
    title: 'Seasonal Resolution',
    mechanics:
      'For finite leagues, final sync locks terminal weights, trading halts, and holders redeem each token directly at exact terminal NAV.',
    rationale:
      'A guaranteed clean exit avoids dependence on late-stage AMM depth and removes end-of-season liquidity risk.',
  },
]

export function LearnExperience() {
  const [idx, setIdx] = useState(0)
  const step = STEPS[idx]

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
      <h2 className="text-2xl font-semibold text-slate-50">Lifecycle Walkthrough</h2>
      <p className="mt-2 text-slate-400">Interactive protocol mechanics + design rationale.</p>

      <div className="mt-6 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {STEPS.map((item, i) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setIdx(i)}
            className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
              i === idx ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300' : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Step {i + 1}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6"
        >
          <h3 className="text-xl font-medium text-slate-50">{step.title}</h3>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-amber-400">Mechanics</p>
            <p className="text-slate-300">{step.mechanics}</p>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-cyan-400">Design Rationale</p>
            <p className="text-slate-300">{step.rationale}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
