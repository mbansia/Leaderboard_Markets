import { useMemo, useState } from 'react';

const mono = 'mono text-sm text-slate-700';

const asPct = (v) => `${(v * 100).toFixed(2)}%`;
const asNum = (v, digits = 4) => Number(v).toFixed(digits);

export function MathSection() {
  const [wA, setWA] = useState(0.42);
  const [tradeSize, setTradeSize] = useState(120);
  const [zapRunCount, setZapRunCount] = useState(0);
  const [nav, setNav] = useState(0.36);
  const [tokenDepth, setTokenDepth] = useState(1200);
  const [drift, setDrift] = useState(1.28);
  const [synced, setSynced] = useState(false);

  const remainder = 1 - wA;
  const wB = remainder * 0.5;
  const wC = remainder * 0.5;

  const spotModule = useMemo(() => {
    const x0 = 1000;
    const y0 = 1000;
    const k = x0 * y0;
    const x1 = x0 + tradeSize;
    const y1 = k / x1;
    const bought = y0 - y1;
    const p0 = x0 / y0;
    const p1 = x1 / y1;
    return { x0, y0, x1, y1, p0, p1, k, bought };
  }, [tradeSize]);

  const zapModule = useMemo(() => {
    const reserve = {
      A: { x: 1000, y: 1000 },
      B: { x: 950, y: 1100 },
      C: { x: 1040, y: 900 },
    };
    const minted = 100;
    const usdcB = (reserve.B.x * minted) / (reserve.B.y + minted);
    const usdcC = (reserve.C.x * minted) / (reserve.C.y + minted);
    const totalRecovered = usdcB + usdcC;
    const extraA = (reserve.A.y * totalRecovered) / (reserve.A.x + totalRecovered);

    return { reserve, minted, usdcB, usdcC, totalRecovered, extraA };
  }, [zapRunCount]);

  const syncModule = useMemo(() => {
    const yOld = tokenDepth;
    const xOld = tokenDepth * nav * drift;
    const spotOld = xOld / yOld;
    const xNew = nav * yOld;
    const yNew = yOld;
    const spotNew = xNew / yNew;
    return { xOld, yOld, spotOld, xNew, yNew, spotNew };
  }, [drift, nav, tokenDepth]);

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Experience D: The Math (Interactive Sandbox)</h2>
        <p className="mt-2 text-slate-600">
          Drag sliders, run steps, and inspect formulas in real time to see how Podium keeps solvency, prices trades,
          routes zaps, and deterministically re-anchors at sync.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">1) Primary Invariant (Solvency Math)</p>
          <p className="mt-2 text-slate-700">1 full basket = 1 unit of collateral. Weights must always add to 1.00.</p>
          <label className="mt-4 block">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>wA slider</span>
              <span className="mono text-amber-600">{asPct(wA)}</span>
            </div>
            <input type="range" min={0.05} max={0.9} step={0.01} value={wA} onChange={(e) => setWA(Number(e.target.value))} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200" />
          </label>
          <div className="mt-4 space-y-1 rounded-xl border border-slate-200 bg-white p-4">
            <p className={mono}>wA + wB + wC = {asNum(wA, 2)} + {asNum(wB, 2)} + {asNum(wC, 2)} = 1.00</p>
            <p className={mono}>NAV_A = wA = <span className="font-semibold text-cyan-700">{asNum(wA, 4)}</span></p>
          </div>
          <p className="mt-3 text-sm text-slate-600">Takeaway: Supply expansion in B/C cannot dilute A&apos;s fundamental NAV because the base layer is always strictly balanced.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">2) vAMM Spot Price (X × Y = k)</p>
          <p className="mt-2 text-slate-700">Buying tokens pushes USDC reserve up and token reserve down along a constant-product curve.</p>
          <label className="mt-4 block">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Trade Size (USDC in)</span>
              <span className="mono text-amber-600">${tradeSize.toFixed(0)}</span>
            </div>
            <input type="range" min={10} max={400} step={5} value={tradeSize} onChange={(e) => setTradeSize(Number(e.target.value))} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200" />
          </label>
          <div className="mt-4 grid gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 sm:grid-cols-2">
            <p className={mono}>X₀={asNum(spotModule.x0, 0)}, Y₀={asNum(spotModule.y0, 0)}, k={asNum(spotModule.k, 0)}</p>
            <p className={mono}>p₀ = X₀ / Y₀ = {asNum(spotModule.p0, 4)}</p>
            <p className={mono}>X₁ = X₀ + trade = {asNum(spotModule.x1, 2)}</p>
            <p className={mono}>Y₁ = k / X₁ = {asNum(spotModule.y1, 2)}</p>
            <p className={mono}>tokens out = Y₀ - Y₁ = {asNum(spotModule.bought, 4)}</p>
            <p className={mono}>p₁ = X₁ / Y₁ = <span className="font-semibold text-cyan-700">{asNum(spotModule.p1, 4)}</span></p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">3) Zap Router (Math in Motion)</p>
            <button type="button" onClick={() => setZapRunCount((n) => n + 1)} className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white">Run Math</button>
          </div>
          <ol className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="rounded-lg border border-slate-200 bg-white p-3">Step 1: Mint $100 baskets → receive 100 A, 100 B, 100 C.</li>
            <li className="rounded-lg border border-slate-200 bg-white p-3">Step 2: Dump 100 B → ΔUSDC_B = (X_B × 100) / (Y_B + 100) = ({zapModule.reserve.B.x} × 100) / ({zapModule.reserve.B.y} + 100) = <span className="mono">${asNum(zapModule.usdcB, 4)}</span></li>
            <li className="rounded-lg border border-slate-200 bg-white p-3">Step 3: Dump 100 C → ΔUSDC_C = (X_C × 100) / (Y_C + 100) = ({zapModule.reserve.C.x} × 100) / ({zapModule.reserve.C.y} + 100) = <span className="mono">${asNum(zapModule.usdcC, 4)}</span></li>
            <li className="rounded-lg border border-slate-200 bg-white p-3">Step 4: Buy Extra A → output = (Y_A × Total_USDC_Recovered) / (X_A + Total_USDC_Recovered) = ({zapModule.reserve.A.y} × {asNum(zapModule.totalRecovered, 4)}) / ({zapModule.reserve.A.x} + {asNum(zapModule.totalRecovered, 4)}) = <span className="mono">{asNum(zapModule.extraA, 4)} A</span></li>
          </ol>
          <p className="mt-3 text-sm text-slate-600">Takeaway: Slippage appears only in the traded curves (B/C then A), not as hidden spread extraction.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">4) Deterministic Re-Anchor (Sync Math)</p>
            <button type="button" onClick={() => setSynced(true)} className="rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white">SYNC</button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>Fundamental NAV</span>
                <span className="mono text-amber-600">{asNum(nav, 4)}</span>
              </div>
              <input type="range" min={0.1} max={0.9} step={0.01} value={nav} onChange={(e) => { setNav(Number(e.target.value)); setSynced(false); }} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200" />
            </label>
            <label className="block">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>Drift Multiplier</span>
                <span className="mono text-amber-600">{asNum(drift, 2)}x</span>
              </div>
              <input type="range" min={0.6} max={1.6} step={0.01} value={drift} onChange={(e) => { setDrift(Number(e.target.value)); setSynced(false); }} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200" />
            </label>
          </div>

          <div className="mt-4 space-y-1 rounded-xl border border-slate-200 bg-white p-4">
            <p className={mono}>Y_new = Y_old = {asNum(syncModule.yOld, 2)}</p>
            <p className={mono}>X_new = NAV_new × Y_old = {asNum(nav, 4)} × {asNum(syncModule.yOld, 2)} = {asNum(syncModule.xNew, 4)}</p>
            <p className={mono}>Spot_new = X_new / Y_new = <span className="font-semibold text-cyan-700">{asNum(syncModule.spotNew, 4)}</span></p>
          </div>

          <p className="mt-3 text-sm text-slate-700">
            Current spot before sync: <span className="mono">{asNum(syncModule.spotOld, 4)}</span>.{' '}
            {synced ? (
              <span className="font-medium text-emerald-700">Synced: market is re-anchored exactly to NAV.</span>
            ) : (
              <span className="text-rose-600">Out of sync: click SYNC to snap spot back to oracle truth.</span>
            )}
          </p>
        </article>
      </div>
    </section>
  );
}
