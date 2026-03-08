import { useMemo, useState } from 'react';
import { LEAGUES } from '../data/leagues';
import type { ChangeCard, ContenderState, LPState, Portfolio, TradeResult } from '../types/market';

const INITIAL_RESERVE = 120000;
const FEE_RATE = 0.003;
const EPS = 1e-9;

type Snapshot = {
  contenders: ContenderState[];
  portfolio: Portfolio;
  lp: LPState;
  phase: number;
  change: ChangeCard | null;
};

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

const normalize = (vals: number[]) => {
  const s = vals.reduce((a, b) => a + b, 0);
  return vals.map((v) => v / Math.max(s, EPS));
};

const rankRows = (rows: ContenderState[]) => [...rows].sort((a, b) => b.weight - a.weight).map((r, i) => ({ ...r, rank: i + 1 }));

const bootLeague = (leagueId: string) => {
  const league = LEAGUES.find((l) => l.id === leagueId) ?? LEAGUES[0];
  return rankRows(
    league.contenders.map((c) => {
      const y = INITIAL_RESERVE * c.depth;
      const x = c.weight * y * (0.98 + c.depth * 0.02);
      return { ...c, nav: c.weight, spot: x / y, x, y, rank: 0 };
    }),
  );
};

export function useLeaderboardMarket() {
  const [leagueId, setLeagueId] = useState(LEAGUES[0].id);
  const [contenders, setContenders] = useState<ContenderState[]>(bootLeague(LEAGUES[0].id));
  const [portfolio, setPortfolio] = useState<Portfolio>({ cash: 15000, holdings: {}, costBasis: {}, realizedPnl: 0, startNav: 15000 });
  const [lp, setLp] = useState<LPState>({ principal: 200000, feePool: 0, parkedScore: 0, lastTs: Date.now() });
  const [change, setChange] = useState<ChangeCard | null>(null);
  const [phase, setPhase] = useState(0);
  const [history, setHistory] = useState<Snapshot[]>([]);

  const pushHistory = () => setHistory((h) => [...h.slice(-24), { contenders: clone(contenders), portfolio: clone(portfolio), lp: clone(lp), phase, change }]);

  const league = useMemo(() => LEAGUES.find((l) => l.id === leagueId) ?? LEAGUES[0], [leagueId]);

  const accrueParkedTime = () => {
    setLp((prev) => {
      const now = Date.now();
      const hours = (now - prev.lastTs) / 3_600_000;
      return { ...prev, parkedScore: prev.parkedScore + prev.principal * Math.max(hours, 0), lastTs: now };
    });
  };

  const totalValue = (markToNav = false) =>
    contenders.reduce((sum, c) => sum + (portfolio.holdings[c.id] ?? 0) * (markToNav ? c.nav : c.spot), portfolio.cash);

  const buy = (id: string, deposit: number): TradeResult => {
    if (deposit <= 0) return { ok: false, message: 'Enter a positive amount.' };
    const fee = deposit * FEE_RATE;
    const totalSpend = deposit + fee;
    if (portfolio.cash + EPS < totalSpend) return { ok: false, message: 'Insufficient cash.' };
    const t = contenders.findIndex((c) => c.id === id);
    if (t < 0) return { ok: false, message: 'Unknown contender.' };

    pushHistory();
    accrueParkedTime();
    const rows = clone(contenders);
    let recovered = 0;
    rows.forEach((row, i) => {
      if (i === t) return;
      const qBasket = deposit;
      const usdcOut = (row.x * qBasket) / (row.y + qBasket);
      row.x -= usdcOut;
      row.y += qBasket;
      recovered += usdcOut;
    });

    const target = rows[t];
    const routedOut = (target.y * recovered) / (target.x + recovered);
    target.x += recovered;
    target.y -= routedOut;

    const received = deposit + routedOut;
    rows.forEach((r) => {
      r.spot = r.x / r.y;
    });
    setContenders(rankRows(rows));

    const prevQty = portfolio.holdings[id] ?? 0;
    const prevCost = portfolio.costBasis[id] ?? 0;
    setPortfolio((p) => ({
      ...p,
      cash: p.cash - totalSpend,
      holdings: { ...p.holdings, [id]: prevQty + received },
      costBasis: { ...p.costBasis, [id]: prevCost + totalSpend },
    }));
    setLp((l) => ({ ...l, feePool: l.feePool + fee }));

    const card = {
      action: `Buy ${id.toUpperCase()}`,
      summary: `Executed ${deposit.toFixed(0)} USDC single-name buy through basket routing.`,
      bullets: [`Received ${received.toFixed(2)} units`, `Fee added to LP pool: ${fee.toFixed(2)} USDC`, `Target spot moved to ${(target.spot * 100).toFixed(2)}%`],
    };
    setChange(card);
    return { ok: true, message: 'Buy executed.', change: card };
  };

  const solveRedeem = (rows: ContenderState[], t: number, qty: number) => {
    let lo = 0;
    const cap = Math.min(...rows.filter((_, i) => i !== t).map((r) => r.y * 0.5));
    let hi = Math.min(qty, cap);
    for (let i = 0; i < 40; i += 1) {
      const z = (lo + hi) / 2;
      const sellA = qty - z;
      const raised = (rows[t].x * sellA) / (rows[t].y + sellA);
      const cost = rows.reduce((acc, r, idx) => {
        if (idx === t) return acc;
        return acc + (r.x * z) / Math.max(r.y - z, EPS);
      }, 0);
      if (cost <= raised) lo = z;
      else hi = z;
    }
    return lo;
  };

  const sell = (id: string, qty: number): TradeResult => {
    if (qty <= 0) return { ok: false, message: 'Enter positive quantity.' };
    const held = portfolio.holdings[id] ?? 0;
    if (qty - EPS > held) return { ok: false, message: 'Cannot sell more than holdings.' };
    const t = contenders.findIndex((c) => c.id === id);
    if (t < 0) return { ok: false, message: 'Unknown contender.' };

    pushHistory();
    accrueParkedTime();
    const rows = clone(contenders);
    const z = solveRedeem(rows, t, qty);
    const sellA = qty - z;
    const raised = (rows[t].x * sellA) / (rows[t].y + sellA);
    rows[t].x -= raised;
    rows[t].y += sellA;

    const cost = rows.reduce((acc, r, idx) => {
      if (idx === t) return acc;
      const c = (r.x * z) / Math.max(r.y - z, EPS);
      r.x += c;
      r.y -= z;
      return acc + c;
    }, 0);

    const basketRedeem = z;
    const grossPayout = Math.max(0, basketRedeem + (raised - cost));
    const fee = grossPayout * FEE_RATE;
    const netPayout = grossPayout - fee;

    rows.forEach((r) => {
      r.spot = r.x / r.y;
    });
    setContenders(rankRows(rows));

    const prevCost = portfolio.costBasis[id] ?? 0;
    const avgCost = prevCost / Math.max(held, EPS);
    const realized = netPayout - avgCost * qty;
    const nextQty = held - qty;
    setPortfolio((p) => ({
      ...p,
      cash: p.cash + netPayout,
      realizedPnl: p.realizedPnl + realized,
      holdings: { ...p.holdings, [id]: Math.max(0, nextQty) },
      costBasis: { ...p.costBasis, [id]: Math.max(0, prevCost - avgCost * qty) },
    }));
    setLp((l) => ({ ...l, feePool: l.feePool + fee }));

    const card = {
      action: `Sell ${id.toUpperCase()}`,
      summary: `Executed ${qty.toFixed(2)} unit sell via basket completion + redeem.`,
      bullets: [`Net payout ${netPayout.toFixed(2)} USDC`, `Realized PnL ${realized.toFixed(2)} USDC`, `Remaining holding ${Math.max(0, nextQty).toFixed(2)} units`],
    };
    setChange(card);
    return { ok: true, message: 'Sell executed.', change: card };
  };

  const sync = () => {
    pushHistory();
    accrueParkedTime();
    const metrics = contenders.map((c, i) => Math.max(0.1, c.metricValue * (1 + 0.05 * Math.sin(phase + i + 1))));
    const w = normalize(metrics);
    const rows = contenders.map((c, i) => {
      const y = c.y;
      const nav = w[i];
      const x = nav * y;
      return { ...c, metricDelta: ((metrics[i] - c.metricValue) / c.metricValue) * 100, metricValue: metrics[i], weight: nav, nav, x, spot: nav };
    });
    setContenders(rankRows(rows));
    setPhase((p) => p + 1);
    const card = { action: 'Oracle Sync', summary: 'Metrics updated and market re-anchored to new NAV.', bullets: ['Objective weights normalized to 100%', 'Spot reopened at fundamental NAV', 'Premium/discount reset for new epoch'] };
    setChange(card);
  };

  const injectLp = (amount: number) => {
    if (amount <= 0) return;
    pushHistory();
    accrueParkedTime();
    const totalX = contenders.reduce((a, b) => a + b.x, 0);
    const k = 1 + amount / Math.max(totalX, EPS);
    const rows = contenders.map((c) => ({ ...c, x: c.x * k, y: c.y * k, spot: c.x / c.y }));
    setContenders(rankRows(rows));
    setLp((l) => ({ ...l, principal: l.principal + amount }));
    setChange({ action: 'LP Injection', summary: `Added ${amount.toFixed(0)} USDC depth to shared reserve.`, bullets: ['Quote and token reserves scaled coherently', 'Slippage reduced for subsequent trades', 'LP principal base increased'] });
  };

  const reset = (nextLeagueId = leagueId) => {
    setLeagueId(nextLeagueId);
    setContenders(bootLeague(nextLeagueId));
    setPortfolio({ cash: 15000, holdings: {}, costBasis: {}, realizedPnl: 0, startNav: 15000 });
    setLp({ principal: 200000, feePool: 0, parkedScore: 0, lastTs: Date.now() });
    setChange(null);
    setHistory([]);
    setPhase(0);
  };

  const undo = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setContenders(prev.contenders);
    setPortfolio(prev.portfolio);
    setLp(prev.lp);
    setPhase(prev.phase);
    setChange(prev.change);
    setHistory((h) => h.slice(0, -1));
  };

  const lpEarned = lp.feePool * (lp.parkedScore / Math.max(lp.parkedScore + 1_000_000, EPS));

  return {
    league,
    contenders,
    portfolio,
    lp,
    lpEarned,
    change,
    totalValue,
    buy,
    sell,
    sync,
    injectLp,
    reset,
    undo,
    setLeague: (id: string) => reset(id),
  };
}
