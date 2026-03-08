import { useMemo, useState } from 'react';

const fmt = (v) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(v);

export function EstimateSection() {
  const [tvl, setTvl] = useState(100000000);
  const [volume, setVolume] = useState(10000000);
  const [fee, setFee] = useState(0.003);
  const [yieldRate, setYieldRate] = useState(0.04);
  const [protocolSplit, setProtocolSplit] = useState(0.4);

  const outputs = useMemo(() => {
    const gross = volume * fee * 365 + tvl * yieldRate;
    const lpSplit = 1 - protocolSplit;
    return {
      treasury: gross * protocolSplit,
      lpApy: ((gross * lpSplit) / tvl) * 100,
      gross,
    };
  }, [fee, protocolSplit, tvl, volume, yieldRate]);

  const Slider = ({ label, value, min, max, step, onChange, format }) => (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span className="mono text-amber-600">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200"/>
    </label>
  );

  return (
    <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2">
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold text-slate-900">Protocol Economics Estimator</h2>
        <Slider label="TVL" value={tvl} min={1000000} max={1000000000} step={1000000} onChange={setTvl} format={fmt} />
        <Slider label="Daily Volume" value={volume} min={100000} max={100000000} step={100000} onChange={setVolume} format={fmt} />
        <Slider label="Zap Fee" value={fee} min={0.001} max={0.01} step={0.0005} onChange={setFee} format={(v) => `${(v * 100).toFixed(2)}%`} />
        <Slider label="Reserve Yield" value={yieldRate} min={0} max={0.1} step={0.0025} onChange={setYieldRate} format={(v) => `${(v * 100).toFixed(2)}%`} />
        <Slider label="Protocol Split" value={protocolSplit} min={0.1} max={0.9} step={0.01} onChange={setProtocolSplit} format={(v) => `${(v * 100).toFixed(0)}%`} />
      </div>
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-700">Annualized Outputs</p>
        <div>
          <p className="text-sm text-slate-500">Protocol Treasury Annual Revenue</p>
          <p className="mono text-3xl font-semibold text-slate-900">{fmt(outputs.treasury)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">LP Annual APY</p>
          <p className="mono text-3xl font-semibold text-amber-600">{outputs.lpApy.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Gross Annual Cash Flow</p>
          <p className="mono text-2xl text-cyan-700">{fmt(outputs.gross)}</p>
        </div>
      </div>
    </section>
  );
}
