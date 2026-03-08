export const fmtPct = (v: number, d = 2) => `${(v * 100).toFixed(d)}%`;
export const fmtUsd = (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
export const fmtNum = (v: number, d = 2) => v.toLocaleString(undefined, { maximumFractionDigits: d });
