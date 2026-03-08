import { useMemo, useState } from 'react';

const INITIAL_RESERVE = 100000;
const EPS = 1e-9;
const MAX_TOASTS = 5;
const ZAP_FEE = 0.003;

const cloneRows = (rows) => rows.map((row) => ({ ...row }));
const normalizeWeights = (weights) => {
  const total = weights.reduce((acc, weight) => acc + weight, 0);
  if (total <= EPS) return null;
  return weights.map((weight) => weight / total);
};

export function useLeaderboardMarket(selectedMarket) {
  const [portfolio, setPortfolio] = useState({ usdc: 10000, holdings: {}, invested: 0, realized: 0 });
  const [lpPosition, setLpPosition] = useState({ principal: 0, feeShares: 0, feesAccrued: 0 });
  const [toasts, setToasts] = useState([]);
  const [eventLog, setEventLog] = useState([]);

  const [protocol, setProtocol] = useState(() => {
    if (!selectedMarket) return [];
    return selectedMarket.contenders.map((contender) => ({
      ...contender,
      x: contender.weight * INITIAL_RESERVE,
      y: INITIAL_RESERVE,
      spot: contender.weight,
    }));
  });

  const appendEvent = (message) => {
    setEventLog((prev) => [{ id: crypto.randomUUID(), ts: new Date().toISOString(), message }, ...prev.slice(0, 24)]);
  };

  const addToast = (message) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev.slice(-MAX_TOASTS + 1), { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2800);
  };

  const resetMarket = (market) => {
    setProtocol(
      market.contenders.map((contender) => ({
        ...contender,
        x: contender.weight * INITIAL_RESERVE,
        y: INITIAL_RESERVE,
        spot: contender.weight,
      }))
    );
    setPortfolio({ usdc: 10000, holdings: {}, invested: 0, realized: 0 });
    setLpPosition({ principal: 0, feeShares: 0, feesAccrued: 0 });
    setToasts([]);
    setEventLog([]);
  };

  const accrueFee = (notional) => {
    const fee = notional * ZAP_FEE;
    setLpPosition((prev) => {
      const shareBase = prev.principal + fee;
      const newShares = prev.principal > 0 ? fee / Math.max(prev.principal, EPS) : 0;
      return {
        principal: prev.principal,
        feeShares: prev.feeShares + newShares,
        feesAccrued: prev.feesAccrued + fee,
        nav: shareBase,
      };
    });
  };

  const injectLiquidity = (factor = 1.2) => {
    if (factor <= 0) return;
    setProtocol((prev) =>
      prev.map((row) => {
        const x = row.x * factor;
        const y = row.y * factor;
        return { ...row, x, y, spot: x / y };
      })
    );
    setLpPosition((prev) => ({
      ...prev,
      principal: prev.principal * factor + 1000,
      feeShares: prev.feeShares + 1,
    }));
    const message = `LP INJECTION: reserves scaled by ${factor.toFixed(2)}x and LP baseline depth increased.`;
    addToast(message);
    appendEvent(message);
  };

  const previewBuy = (targetName, deposit) => {
    if (!deposit || deposit <= 0) return null;
    const rows = cloneRows(protocol);
    const targetIndex = rows.findIndex((row) => row.name === targetName);
    if (targetIndex === -1) return null;

    let recoveredUsdc = 0;
    rows.forEach((row, idx) => {
      if (idx === targetIndex) return;
      recoveredUsdc += (row.x * deposit) / (row.y + deposit);
    });

    const target = rows[targetIndex];
    const tokenOut = (target.y * recoveredUsdc) / (target.x + recoveredUsdc);
    const received = deposit + tokenOut;
    return { recoveredUsdc, tokenOut, received, impliedExecution: deposit / Math.max(received, EPS) };
  };

  const previewSell = (targetName, quantity) => {
    if (!quantity || quantity <= 0) return null;
    const rows = cloneRows(protocol);
    const t = rows.findIndex((row) => row.name === targetName);
    if (t === -1) return null;
    const target = rows[t];

    let lo = 0;
    const maxSafe = Math.min(quantity, ...rows.filter((_, i) => i !== t).map((row) => row.y * 0.999));
    let hi = Math.max(maxSafe, 0);

    for (let i = 0; i < 50; i += 1) {
      const z = (lo + hi) / 2;
      const sellA = Math.max(quantity - z, 0);
      const raised = (target.x * sellA) / (target.y + sellA);
      const cost = rows.reduce((acc, row, idx) => {
        if (idx === t) return acc;
        return acc + (row.x * z) / Math.max(row.y - z, EPS);
      }, 0);
      if (cost <= raised) lo = z;
      else hi = z;
    }

    return { z: lo, impliedExecution: lo / quantity };
  };

  const zapBuy = (targetName, deposit) => {
    if (!deposit || deposit <= 0 || portfolio.usdc < deposit) return false;

    setProtocol((prev) => {
      const rows = cloneRows(prev);
      const targetIndex = rows.findIndex((row) => row.name === targetName);
      if (targetIndex === -1) return prev;

      let recoveredUsdc = 0;
      rows.forEach((row, idx) => {
        if (idx === targetIndex) return;
        const usdcOut = (row.x * deposit) / (row.y + deposit);
        row.x -= usdcOut;
        row.y += deposit;
        recoveredUsdc += usdcOut;
      });

      const target = rows[targetIndex];
      const tokenOut = (target.y * recoveredUsdc) / (target.x + recoveredUsdc);
      target.x += recoveredUsdc;
      target.y -= tokenOut;
      rows.forEach((row) => {
        row.spot = row.x / row.y;
      });

      const fee = deposit * ZAP_FEE;
      const netDeposit = deposit + fee;
      setPortfolio((current) => ({
        usdc: current.usdc - netDeposit,
        invested: current.invested + netDeposit,
        realized: current.realized,
        holdings: {
          ...current.holdings,
          [targetName]: (current.holdings[targetName] || 0) + deposit + tokenOut,
        },
      }));

      accrueFee(deposit);
      const message = `ZAP BUY ${targetName}: ${(deposit + tokenOut).toFixed(3)} received, ${fee.toFixed(3)} fee accrued to LPs.`;
      addToast(message);
      appendEvent(message);
      return rows;
    });

    return true;
  };

  const zapSell = (targetName, quantity) => {
    if (!quantity || quantity <= 0 || (portfolio.holdings[targetName] || 0) < quantity) return false;

    setProtocol((prev) => {
      const rows = cloneRows(prev);
      const t = rows.findIndex((row) => row.name === targetName);
      if (t === -1) return prev;
      const target = rows[t];

      let lo = 0;
      const maxSafe = Math.min(quantity, ...rows.filter((_, i) => i !== t).map((row) => row.y * 0.999));
      let hi = Math.max(maxSafe, 0);

      for (let i = 0; i < 50; i += 1) {
        const z = (lo + hi) / 2;
        const sellA = Math.max(quantity - z, 0);
        const raised = (target.x * sellA) / (target.y + sellA);
        const cost = rows.reduce((acc, row, idx) => {
          if (idx === t) return acc;
          return acc + (row.x * z) / Math.max(row.y - z, EPS);
        }, 0);
        if (cost <= raised) lo = z;
        else hi = z;
      }

      const z = lo;
      const sellA = Math.max(quantity - z, 0);
      const raised = (target.x * sellA) / (target.y + sellA);
      target.x -= raised;
      target.y += sellA;

      rows.forEach((row, idx) => {
        if (idx === t) return;
        const usdcCost = (row.x * z) / Math.max(row.y - z, EPS);
        row.x += usdcCost;
        row.y -= z;
      });
      rows.forEach((row) => {
        row.spot = row.x / row.y;
      });

      const fee = z * ZAP_FEE;
      const received = z - fee;
      setPortfolio((current) => {
        const nextAmount = (current.holdings[targetName] || 0) - quantity;
        return {
          usdc: current.usdc + received,
          invested: current.invested,
          realized: current.realized + received,
          holdings: {
            ...current.holdings,
            [targetName]: nextAmount < EPS ? 0 : nextAmount,
          },
        };
      });

      accrueFee(z);
      const message = `ZAP SELL ${targetName}: ${z.toFixed(3)} gross USDC compiled, ${(fee).toFixed(3)} fee, ${(received).toFixed(3)} net.`;
      addToast(message);
      appendEvent(message);
      return rows;
    });

    return true;
  };

  const triggerOracleSync = (newWeights) => {
    const normalized = normalizeWeights(newWeights);
    if (!normalized) return false;

    setProtocol((prev) =>
      prev.map((row, idx) => {
        const weight = normalized[idx];
        const x = weight * row.y;
        return { ...row, weight, x, spot: x / row.y };
      })
    );

    const message = 'ORACLE SYNC: weights committed and vAMM reserves deterministically re-anchored to NAV.';
    addToast(message);
    appendEvent(message);
    return true;
  };

  const metrics = useMemo(() => {
    const totalDepth = protocol.reduce((acc, row) => acc + row.x, 0);
    const holdingsValue = Object.entries(portfolio.holdings).reduce((acc, [name, qty]) => {
      const row = protocol.find((entry) => entry.name === name);
      return acc + (row ? qty * row.spot : 0);
    }, 0);
    const nav = portfolio.usdc + holdingsValue;
    return {
      totalDepth,
      holdingsValue,
      net: nav,
      userPnl: {
        invested: portfolio.invested,
        realized: portfolio.realized,
        nav,
        unrealized: nav + portfolio.realized - portfolio.invested,
      },
      lpPnl: {
        principal: lpPosition.principal,
        fees: lpPosition.feesAccrued,
        feeShares: lpPosition.feeShares,
        nav: lpPosition.principal + lpPosition.feesAccrued,
      },
    };
  }, [portfolio, protocol, lpPosition]);

  return {
    portfolio,
    protocol,
    toasts,
    metrics,
    eventLog,
    resetMarket,
    previewBuy,
    previewSell,
    zapBuy,
    zapSell,
    triggerOracleSync,
    injectLiquidity,
  };
}
