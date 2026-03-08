import { useMemo, useState } from 'react'

export const LEAGUES = {
  ai: {
    name: 'AI Models',
    contenders: [
      { name: 'GPT-4.5', weight: 0.45 },
      { name: 'Claude 3.5', weight: 0.35 },
      { name: 'Gemini 1.5', weight: 0.2 },
    ],
  },
  epl: {
    name: 'Premier League',
    contenders: [
      { name: 'Arsenal', weight: 0.4 },
      { name: 'Man City', weight: 0.35 },
      { name: 'Chelsea', weight: 0.25 },
    ],
  },
  defi: {
    name: 'Crypto Protocols',
    contenders: [
      { name: 'Uniswap', weight: 0.5 },
      { name: 'Raydium', weight: 0.3 },
      { name: 'Aerodrome', weight: 0.2 },
    ],
  },
}

const INITIAL_Y = 100000

const buildInitialState = (leagueKey) => {
  const contenders = LEAGUES[leagueKey].contenders
  const protocol = contenders.map((c) => ({
    ...c,
    X: c.weight * INITIAL_Y,
    Y: INITIAL_Y,
  }))

  const portfolioTokens = Object.fromEntries(contenders.map((c) => [c.name, 0]))

  return {
    protocol,
    portfolio: {
      usdc: 50000,
      tokens: portfolioTokens,
    },
  }
}

export function useLeaderboardMarket(initialLeague = 'ai') {
  const [leagueKey, setLeagueKey] = useState(initialLeague)
  const [state, setState] = useState(buildInitialState(initialLeague))

  const selectLeague = (key) => {
    setLeagueKey(key)
    setState(buildInitialState(key))
  }

  const injectLiquidity = (factor = 1.2) => {
    setState((prev) => ({
      ...prev,
      protocol: prev.protocol.map((pool) => ({ ...pool, X: pool.X * factor, Y: pool.Y * factor })),
    }))
  }

  const triggerOracleSync = (weights) => {
    const sameLength = weights.length === state.protocol.length
    const validNumbers = weights.every((w) => Number.isFinite(w) && w >= 0)
    const sum = weights.reduce((acc, w) => acc + w, 0)
    if (!sameLength || !validNumbers || Math.abs(sum - 1) > 0.00001) return false

    setState((prev) => ({
      ...prev,
      protocol: prev.protocol.map((pool, idx) => ({
        ...pool,
        weight: weights[idx],
        X: weights[idx] * pool.Y,
      })),
    }))
    return true
  }

  const zapBuy = (targetIndex, D) => {
    if (D <= 0) return false

    let success = false
    setState((prev) => {
      if (prev.portfolio.usdc < D) return prev

      const protocol = prev.protocol.map((p) => ({ ...p }))
      let recoveredUSDC = 0

      protocol.forEach((pool, idx) => {
        if (idx === targetIndex) return
        const output = (pool.X * D) / (pool.Y + D)
        pool.X -= output
        pool.Y += D
        recoveredUSDC += output
      })

      const target = protocol[targetIndex]
      const tokenOutput = (target.Y * recoveredUSDC) / (target.X + recoveredUSDC)
      target.X += recoveredUSDC
      target.Y -= tokenOutput

      success = true
      return {
        protocol,
        portfolio: {
          usdc: prev.portfolio.usdc - D,
          tokens: {
            ...prev.portfolio.tokens,
            [target.name]: prev.portfolio.tokens[target.name] + D + tokenOutput,
          },
        },
      }
    })

    return success
  }

  const zapSell = (targetIndex, Q) => {
    if (Q <= 0) return false

    let success = false
    setState((prev) => {
      const protocol = prev.protocol.map((p) => ({ ...p }))
      const target = protocol[targetIndex]
      if (prev.portfolio.tokens[target.name] < Q) return prev

      let low = 0
      let high = Math.min(Q, ...protocol.filter((_, i) => i !== targetIndex).map((p) => p.Y * 0.9))

      for (let i = 0; i < 50; i += 1) {
        const z = (low + high) / 2
        const sellAmount = Q - z
        const usdcRaised = (target.X * sellAmount) / (target.Y + sellAmount)

        let usdcCost = 0
        for (let j = 0; j < protocol.length; j += 1) {
          if (j === targetIndex) continue
          usdcCost += (protocol[j].X * z) / (protocol[j].Y - z)
        }

        if (usdcCost <= usdcRaised) low = z
        else high = z
      }

      const z = low
      const sellAmount = Q - z
      const usdcRaised = (target.X * sellAmount) / (target.Y + sellAmount)

      target.X -= usdcRaised
      target.Y += sellAmount

      for (let j = 0; j < protocol.length; j += 1) {
        if (j === targetIndex) continue
        const pool = protocol[j]
        const usdcCost = (pool.X * z) / (pool.Y - z)
        pool.X += usdcCost
        pool.Y -= z
      }

      success = true
      return {
        protocol,
        portfolio: {
          usdc: prev.portfolio.usdc + z,
          tokens: {
            ...prev.portfolio.tokens,
            [target.name]: prev.portfolio.tokens[target.name] - Q,
          },
        },
      }
    })

    return success
  }

  const rows = useMemo(
    () =>
      state.protocol
        .map((pool) => {
          const spot = pool.X / pool.Y
          const premiumDiscount = ((spot - pool.weight) / pool.weight) * 100
          return {
            ...pool,
            spot,
            premiumDiscount,
          }
        })
        .sort((a, b) => b.weight - a.weight)
        .map((item, idx) => ({ ...item, rank: idx + 1 })),
    [state.protocol],
  )

  return {
    leagueKey,
    leagueName: LEAGUES[leagueKey].name,
    availableLeagues: LEAGUES,
    protocol: state.protocol,
    rows,
    portfolio: state.portfolio,
    selectLeague,
    injectLiquidity,
    triggerOracleSync,
    zapBuy,
    zapSell,
  }
}
