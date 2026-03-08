import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLeaderboardMarket } from '../hooks/useLeaderboardMarket'

const fmt = (n, d = 4) => n.toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: d })

export function SimulateExperience() {
  const market = useLeaderboardMarket('ai')
  const [tradeSize, setTradeSize] = useState(100)
  const [weightDraft, setWeightDraft] = useState('0.45,0.35,0.20')
  const [toast, setToast] = useState(null)

  const protocolIndexByName = useMemo(
    () => Object.fromEntries(market.protocol.map((pool, idx) => [pool.name, idx])),
    [market.protocol],
  )

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">Live Leaderboard Terminal</h2>
          <p className="text-slate-400">Custom state machine simulation of Podium routing and oracle sync.</p>
        </div>
        <div className="flex gap-2">
          {Object.entries(market.availableLeagues).map(([key, league]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                market.selectLeague(key)
                setWeightDraft(league.contenders.map((c) => c.weight.toFixed(2)).join(','))
              }}
              className={`rounded-lg border px-3 py-2 text-xs ${
                market.leagueKey === key
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-slate-700 text-slate-300 hover:text-slate-100'
              }`}
            >
              {league.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 lg:grid-cols-4">
        <label className="text-xs text-slate-300">
          Trade size
          <input
            value={tradeSize}
            onChange={(e) => setTradeSize(Number(e.target.value))}
            type="number"
            className="mt-1 w-full rounded bg-slate-900 p-2 font-mono text-amber-400"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            market.injectLiquidity(1.2)
            showToast('LP deposit injected: reserves x1.2, slippage reduced.')
          }}
          className="rounded bg-cyan-500/20 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/30"
        >
          Inject LP Capital
        </button>
        <label className="text-xs text-slate-300 lg:col-span-2">
          Manually Edit Weights (comma separated)
          <div className="mt-1 flex gap-2">
            <input
              value={weightDraft}
              onChange={(e) => setWeightDraft(e.target.value)}
              className="w-full rounded bg-slate-900 p-2 font-mono text-cyan-300"
            />
            <button
              type="button"
              onClick={() => {
                const weights = weightDraft.split(',').map((v) => Number(v.trim()))
                const ok = market.triggerOracleSync(weights)
                showToast(
                  ok
                    ? 'Oracle sync complete: quote reserves reset, spot prices snapped to NAV.'
                    : 'Invalid weight vector: use non-negative values summing to 1.0',
                )
              }}
              className="rounded bg-amber-500/20 px-3 text-amber-300 hover:bg-amber-500/30"
            >
              TRIGGER ORACLE SYNC
            </button>
          </div>
        </label>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-slate-950/90 text-slate-400">
            <tr>
              {['Rank', 'Contender', 'Oracle Weight (%)', 'Fundamental NAV ($)', 'Live Spot Price ($)', 'Premium/Discount (%)', 'Action'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {market.rows.map((row) => {
              const poolIndex = protocolIndexByName[row.name]
              const holding = market.portfolio.tokens[row.name] ?? 0
              const insufficientBalance = market.portfolio.usdc < tradeSize
              const insufficientToken = holding < tradeSize
              return (
                <tr key={row.name} className="border-t border-slate-800 text-slate-200">
                  <td className="px-4 py-3 font-mono">#{row.rank}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3 font-mono text-cyan-400">{fmt(row.weight * 100, 2)}</td>
                  <td className="px-4 py-3 font-mono text-cyan-400">{fmt(row.weight, 4)}</td>
                  <td className="px-4 py-3 font-mono text-amber-500">{fmt(row.spot, 4)}</td>
                  <td className={`px-4 py-3 font-mono ${row.premiumDiscount >= 0 ? 'text-amber-400' : 'text-cyan-300'}`}>
                    {fmt(row.premiumDiscount, 2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const ok = market.zapBuy(poolIndex, tradeSize)
                          showToast(
                            ok
                              ? `Zap BUY routed: mint basket → dump non-target legs → accumulate ${row.name}.`
                              : 'Buy failed: check trade size and available USDC.',
                          )
                        }}
                        disabled={insufficientBalance || tradeSize <= 0}
                        className="rounded bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        BUY
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const ok = market.zapSell(poolIndex, tradeSize)
                          showToast(
                            ok
                              ? `Zap SELL routed: binary search solved max basket compile for ${row.name}.`
                              : 'Sell failed: insufficient token balance for selected size.',
                          )
                        }}
                        disabled={insufficientToken || tradeSize <= 0}
                        className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        SELL
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Portfolio</p>
          <p className="font-mono text-cyan-300">USDC: {fmt(market.portfolio.usdc, 2)}</p>
          <div className="mt-2 space-y-1 text-sm text-slate-300">
            {Object.entries(market.portfolio.tokens).map(([k, v]) => (
              <p key={k} className="font-mono">
                {k}: {fmt(v, 4)}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Market State</p>
          <p className="text-slate-200">League: {market.leagueName}</p>
          <p className="text-slate-400">
            Oracle NAV equals weight at sync boundaries, while spot drifts by order flow between syncs.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 right-6 rounded-xl border border-cyan-500/30 bg-slate-950/95 px-4 py-3 text-sm text-cyan-200 shadow-glow"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
