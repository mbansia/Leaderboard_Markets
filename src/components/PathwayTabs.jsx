import { motion } from 'framer-motion';

const options = ['Learn', 'Simulate', 'Estimate'];

export function PathwayTabs({ active, onChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {options.map((option) => {
        const selected = active === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`relative rounded-2xl border p-5 text-left transition ${
              selected ? 'border-cyan-500 bg-cyan-50 text-slate-900' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Experience</p>
            <p className="mt-2 text-2xl font-semibold">{option}</p>
            {selected && <motion.div layoutId="tab" className="absolute inset-0 rounded-2xl ring-1 ring-cyan-400/70" />}
          </button>
        );
      })}
    </div>
  );
}
