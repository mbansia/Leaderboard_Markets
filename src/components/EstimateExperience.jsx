import { useMemo, useState } from 'react'

const fmtUsd = (n) =>
  n.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

export function EstimateExperience() {
  const [tvl, setTvl] = useState(100000000)
  const [dailyVolume, setDailyVolume] = useState(10000000)
  const [fee, setFee] = useState(0.003)
  const [yieldRate, setYieldRate] = useState(0.04)
  const [protocolSplit, setProtocolSplit] = useState(0.4)

  const lpSplit = 1 - protocolSplit

  const { treasuryAnnualRevenue, lpApy } = useMemo(() => {
    const grossAnnual = dailyVolume * fee * 365 + tvl * yieldRate
    return {
      treasuryAnnualRevenue: grossAnnual * protocolSplit,
      lpApy: ((grossAnnual * lpSplit) / tvl) * 100,
    }
  }, [dailyVolume, fee, lpSplit, protocolSplit, tvl, yieldRate])

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
      <h2 className="text-2xl font-semibold text-slate-50">Protocol Economics Estimator</h2>
      <p className="mt-2 text-slate-400">Project annual treasury revenue and LP duration yield under different market regimes.</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {[
          ['TVL', tvl, setTvl, 1000000, 1000000000, 1000000, (v) => fmtUsd(v)],
          ['Daily Volume', dailyVolume, setDailyVolume, 100000, 100000000, 100000, (v) => fmtUsd(v)],
          ['Zap Fee', fee, setFee, 0.001, 0.01, 0.0005, (v) => `${(v * 100).toFixed(2)}%`],
          ['Reserve Yield', yieldRate, setYieldRate, 0, 0.1, 0.0025, (v) => `${(v * 100).toFixed(2)}%`],
          ['Protocol Fee Split', protocolSplit, setProtocolSplit, 0, 1, 0.01, (v) => `${(v * 100).toFixed(0)}%`],
        ].map(([label, value, setter, min, max, step, format]) => (
          <label key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
            <div className="flex justify-between gap-3">
              <span>{label}</span>
              <span className="font-mono text-cyan-300">{format(value)}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => setter(Number(e.target.value))}
              className="mt-3 w-full accent-cyan-400"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5">
          <p className="text-xs uppercase tracking-wide text-cyan-300">Protocol Treasury Annual Revenue</p>
          <p className="mt-2 font-mono text-3xl text-slate-50">{fmtUsd(treasuryAnnualRevenue)}</p>
          <p className="mt-2 text-sm text-slate-400">((Volume × Fee × 365) + (TVL × Yield)) × Protocol Split</p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <p className="text-xs uppercase tracking-wide text-amber-300">LP Annual APY</p>
          <p className="mt-2 font-mono text-3xl text-slate-50">{lpApy.toFixed(2)}%</p>
          <p className="mt-2 text-sm text-slate-400">(((Volume × Fee × 365) + (TVL × Yield)) × LP Split) / TVL</p>
          <p className="mt-1 text-xs text-slate-500">LP split currently {Math.round(lpSplit * 100)}%.</p>
        </div>
      </div>
    </section>
  )
}
