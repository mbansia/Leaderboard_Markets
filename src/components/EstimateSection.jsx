import { useMemo, useState } from 'react';

const fmt = (v) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(v);

const presets = {
  conservative: { tvl: 15000000, volume: 400000, fee: 0.0015, yieldRate: 0.03, protocolSplit: 0.35 },
  base: { tvl: 100000000, volume: 10000000, fee: 0.003, yieldRate: 0.04, protocolSplit: 0.4 },
  aggressive: { tvl: 700000000, volume: 70000000, fee: 0.0065, yieldRate: 0.055, protocolSplit: 0.5 },
};

export function EstimateSection() {
  const [tvl, setTvl] = useState(presets.base.tvl);
  const [volume, setVolume] = useState(presets.base.volume);
  const [fee, setFee] = useState(presets.base.fee);
  const [yieldRate, setYieldRate] = useState(presets.base.yieldRate);
  const [protocolSplit, setProtocolSplit] = useState(presets.base.protocolSplit);

  const outputs = useMemo(() => {
    const gross = volume * fee * 365 + tvl * yieldRate;
    const lpSplit = 1 - protocolSplit;
    return {
      treasury: gross * protocolSplit,
      lpApy: ((gross * lpSplit) / tvl) * 100,
      gross,
      lpCashflow: gross * lpSplit,
      protocolCashflow: gross * protocolSplit,
    };
  }, [fee, protocolSplit, tvl, volume, yieldRate]);

  const applyPreset = (name) => {
    const p = presets[name];
    setTvl(p.tvl);
    setVolume(p.volume);
    setFee(p.fee);
    setYieldRate(p.yieldRate);
    setProtocolSplit(p.protocolSplit);
  };

  const Slider = ({ label, value, min, max, step, onChange, format }) => (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span className="mono text-amber-400">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700"
      />
    </label>
  );

  return (
    <section className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur lg:grid-cols-2">
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold">Protocol Economics Estimator</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <button onClick={() => applyPreset('conservative')} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">
            Conservative
          </button>
          <button onClick={() => applyPreset('base')} className="rounded-lg border border-cyan-500 px-3 py-2 text-xs text-cyan-300">
            Base
          </button>
          <button onClick={() => applyPreset('aggressive')} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">
            Aggressive
          </button>
        </div>

        <Slider label="TVL" value={tvl} min={1000000} max={1000000000} step={1000000} onChange={setTvl} format={fmt} />
        <Slider label="Daily Volume" value={volume} min={100000} max={100000000} step={100000} onChange={setVolume} format={fmt} />
        <Slider
          label="Zap Fee"
          value={fee}
          min={0.001}
          max={0.01}
          step={0.0005}
          onChange={setFee}
          format={(v) => `${(v * 100).toFixed(2)}%`}
        />
        <Slider
          label="Reserve Yield"
          value={yieldRate}
          min={0}
          max={0.1}
          step={0.0025}
          onChange={setYieldRate}
          format={(v) => `${(v * 100).toFixed(2)}%`}
        />
        <Slider
          label="Protocol Split"
          value={protocolSplit}
          min={0.1}
          max={0.9}
          step={0.01}
          onChange={setProtocolSplit}
          format={(v) => `${(v * 100).toFixed(0)}% protocol / ${((1 - v) * 100).toFixed(0)}% LP`}
        />
      </div>
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Annualized Outputs</p>
        <div>
          <p className="text-sm text-slate-400">Protocol Treasury Annual Revenue</p>
          <p className="mono text-3xl font-semibold text-slate-50">{fmt(outputs.treasury)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">LP Annual APY</p>
          <p className="mono text-3xl font-semibold text-amber-400">{outputs.lpApy.toFixed(2)}%</p>
        </div>
        <div className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">Protocol cash flow</p>
            <p className="mono text-cyan-300">{fmt(outputs.protocolCashflow)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">LP cash flow</p>
            <p className="mono text-amber-300">{fmt(outputs.lpCashflow)}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-400">Gross Annual Cash Flow</p>
          <p className="mono text-2xl text-cyan-300">{fmt(outputs.gross)}</p>
        </div>
      </div>
    </section>
  );
}
