export function Logo({ className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="1" y="1" width="26" height="26" rx="8" className="fill-cyan-500/15 stroke-cyan-500" />
        <path d="M7 18V10h2.4c1.8 0 2.9.9 2.9 2.4 0 1.6-1.2 2.5-3 2.5H9v3H7Zm2-4.7h.9c.8 0 1.3-.3 1.3-.9s-.4-.8-1.2-.8H9v1.7ZM14.5 18V10h2.9c2.6 0 4.3 1.5 4.3 4s-1.7 4-4.3 4h-2.9Zm2-1.7h.8c1.5 0 2.4-.8 2.4-2.3s-.9-2.3-2.4-2.3h-.8v4.6Z" className="fill-cyan-600"/>
      </svg>
      <span className="text-sm font-semibold tracking-wide text-slate-900">PODIUM</span>
    </div>
  );
}
