import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { categories, demandGroups } from './data/categories';
import { comparisonRows } from './data/comparisons';
import { faqCategories } from './data/faq';
import { walkthroughSteps } from './data/walkthrough';
import { useReducedMotionPreference } from './hooks/useReducedMotion';
import { useSimulator } from './hooks/useSimulator';

const sectionIds = ['hero','what','value','demand','compare','diagram','walkthrough','simulator','faq','cta'];

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

function App() {
  const reduce = useReducedMotionPreference();
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeNode, setActiveNode] = useState('reserve');
  const [step, setStep] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [hoodMode, setHoodMode] = useState(false);
  const [faqOpen, setFaqOpen] = useState('A. Basics');
  const sim = useSimulator();

  const nodes = useMemo(() => ({
    reserve: 'Shared reserve: real collateral base that backs issuance.',
    mint: 'Full-basket minting creates A+B+C together from collateral input.',
    lanes: 'One virtual AMM lane per contender handles routed execution.',
    oracle: 'Oracle updates objective standings metrics and weights.',
    sync: 'Sync re-anchors next epoch around updated NAV fundamentals.',
    lp: 'LPs provide parked reserve capital and earn time-weighted fee share.',
    seasonal: 'Optional seasonal close can settle and reopen with refreshed roster.'
  }), []);

  const visibleSteps = showAll ? walkthroughSteps : [walkthroughSteps[step]];

  return (
    <div className="bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3 text-sm">
          {sectionIds.map((id) => <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 hover:border-sky-300 hover:text-sky-700">{id}</a>)}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl space-y-24 px-4 py-10 md:px-8">
        <section id="hero" className="grid gap-10 md:grid-cols-2">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: reduce ? 0 : 0.5 }}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">A new market primitive</p>
            <h1 className="text-5xl font-semibold">Own the standings.</h1>
            <p className="mt-5 text-lg text-slate-600">We rank everything. AI models. Crypto protocols. Football teams. Creators. But until now, you couldn’t really invest in relative performance. Leaderboard Markets turn objective rankings into continuous, tradable markets.</p>
            <div className="mt-7 flex gap-3">
              <a href="#walkthrough" className="rounded-xl bg-sky-600 px-5 py-3 font-medium text-white">See the walkthrough</a>
              <a href="#simulator" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium">Try the simulator</a>
            </div>
          </motion.div>
          <HeroVisual reduce={reduce} />
        </section>

        <section id="what" className="space-y-6">
          <h2 className="text-3xl font-semibold">What is a Leaderboard Market?</h2>
          <p className="max-w-4xl text-slate-600">A leaderboard market is a market where each contender represents a share of the standings, and users can trade views on who is gaining or losing relative position over time.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard title="Simple example" body="In a 3-team league market, buying Team A means taking exposure to Team A gaining share of the table, not only winning one match." />
            <InfoCard title="Why this form is new" body="Most markets are built around binary questions or direct token ownership. This design directly prices standing trajectories." />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="font-semibold">Event markets</p><p className="text-slate-600">Price one question.</p></div>
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5"><p className="font-semibold">Leaderboard Markets</p><p className="text-slate-700">Price relative standing over time.</p></div>
          </div>
        </section>

        <section id="value" className="space-y-6">
          <h2 className="text-3xl font-semibold">Why it matters</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <InfoCard title="For users" body="Express trajectory views, join with single-name actions, and maintain long-duration attachment to contenders." />
            <InfoCard title="For operators" body="Turn existing leaderboards into recurring products with each sync cycle creating new participation moments." />
            <InfoCard title="For LPs" body="Provide shared reserve capital and earn from time-based participation in market activity." />
          </div>
        </section>

        <section id="demand" className="space-y-6">
          <h2 className="text-3xl font-semibold">Potential markets and real demand</h2>
          <div className="flex flex-wrap gap-2">{categories.map((c)=><button key={c.id} onClick={()=>setActiveCategory(c)} className={`rounded-full px-3 py-1.5 text-sm ${activeCategory.id===c.id?'bg-slate-900 text-white':'border border-slate-300 bg-white'}`}>{c.name}</button>)}</div>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard title={`What gets ranked: ${activeCategory.name}`} body={activeCategory.rankedObject} />
            <InfoCard title="Why recurring demand exists" body={`${activeCategory.obsession} ${activeCategory.fit}`} />
            <InfoCard title="Natural users" body={activeCategory.users.join(', ')} />
            <InfoCard title="Oracle + sync cadence" body={`${activeCategory.metric}. Sync cadence: ${activeCategory.cadence}.`} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="font-semibold">Demand groups</p><p className="mt-2 text-slate-600">{demandGroups.join(' · ')}</p></div>
        </section>

        <section id="compare" className="space-y-5">
          <h2 className="text-3xl font-semibold">How this differs from other markets</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm"><thead className="bg-slate-100 text-slate-700"><tr>{['Market','What is traded','Terminal/continuous','Relative performance','Attachment','Liquidity','Binary?','Ownership','Leaderboard process'].map(h=><th key={h} className="px-3 py-2">{h}</th>)}</tr></thead><tbody>{comparisonRows.map((r)=><tr key={r.category} className={r.category==='Leaderboard Markets'?'bg-sky-50':''}><td className="px-3 py-2 font-medium">{r.category}</td><td className="px-3 py-2">{r.traded}</td><td className="px-3 py-2">{r.cadence}</td><td className="px-3 py-2">{r.relativePerformance}</td><td className="px-3 py-2">{r.attachment}</td><td className="px-3 py-2">{r.liquidity}</td><td className="px-3 py-2">{r.binaryDependence}</td><td className="px-3 py-2">{r.ownership}</td><td className="px-3 py-2">{r.leaderboardDependency}</td></tr>)}</tbody></table>
          </div>
          <p className="text-xl font-semibold text-sky-700">Prediction markets price answers. Leaderboard Markets price trajectories.</p>
        </section>

        <section id="diagram" className="space-y-6">
          <h2 className="text-3xl font-semibold">One system view</h2>
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
              <SystemDiagram activeNode={activeNode} setActiveNode={setActiveNode} reduce={reduce} />
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-600">Node explainer</p>
              <h3 className="mt-2 text-xl font-semibold capitalize">{activeNode}</h3>
              <p className="mt-2 text-slate-700">{nodes[activeNode as keyof typeof nodes]}</p>
            </div>
          </div>
        </section>

        <section id="walkthrough" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-3xl font-semibold">Canonical walkthrough (Token A / B / C)</h2><div className="flex gap-2"><button onClick={()=>setHoodMode((v)=>!v)} className="rounded-lg border px-3 py-1.5">{hoodMode ? 'Beginner mode' : 'Under the hood'}</button><button onClick={()=>setShowAll((v)=>!v)} className="rounded-lg border px-3 py-1.5">{showAll ? 'Step mode' : 'Show all steps'}</button></div></div>
          <p className="text-slate-600">Assumptions: beginner math ignores fees, 2-decimal rounding, 1000 USDC mints one full basket, initial NAV 333.33 each, virtual lanes x=1000 and y=3 each.</p>
          {!showAll && <div className="h-2 w-full rounded-full bg-slate-200"><div className="h-full rounded-full bg-sky-600" style={{ width: `${((step+1)/walkthroughSteps.length)*100}%` }} /></div>}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {visibleSteps.map((s)=> <motion.div key={s.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-sky-700">Step {s.id}</p><h3 className="text-2xl font-semibold">{s.title}</h3><p className="mt-2 text-slate-600">{s.story}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">{[['Before',s.before],['Action math',s.action],['After',s.after]].map(([title,arr])=><div key={title as string} className="rounded-xl border bg-slate-50 p-3"><p className="font-medium">{title as string}</p><ul className="mt-2 space-y-1 text-sm text-slate-600">{(arr as string[]).map((l)=> <li key={l}>• {l}</li>)}</ul></div>)}</div>
                <p className="mt-3 text-sm font-medium text-slate-700">Why it matters: {s.matters}</p>
                {hoodMode && <p className="mt-2 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">Under the hood: {s.hood}</p>}
              </motion.div>) }
            </AnimatePresence>
          </div>
          {!showAll && <div className="flex gap-3"><button onClick={()=>setStep((v)=>Math.max(0,v-1))} className="rounded-lg border px-3 py-1.5">Previous</button><button onClick={()=>setStep((v)=>Math.min(walkthroughSteps.length-1,v+1))} className="rounded-lg bg-sky-600 px-3 py-1.5 text-white">Next</button></div>}
        </section>

        <section id="simulator" className="space-y-5">
          <h2 className="text-3xl font-semibold">Guided simulator <span className="text-base text-slate-500">(Interactive intuition model)</span></h2>
          <div className="flex gap-2">{(['ai','crypto','football'] as const).map((v)=><button key={v} onClick={()=>sim.setVertical(v)} className={`rounded-lg px-3 py-1.5 ${sim.vertical===v?'bg-slate-900 text-white':'border bg-white'}`}>{v.toUpperCase()}</button>)}</div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <p className="font-semibold">Explore mode</p>
              <table className="w-full text-sm"><thead><tr className="text-slate-500"><th>Contender</th><th>Metric</th><th>Weight</th><th>NAV</th><th>Spot</th><th>Holdings</th></tr></thead><tbody>{sim.tokens.map((t,i)=><tr key={t.name}><td>{sim.presets[sim.vertical][i]}</td><td>{t.metric}</td><td>{t.weight}%</td><td>{t.nav.toFixed(2)}</td><td>{t.spot.toFixed(2)}</td><td>{t.holdings.toFixed(2)}</td></tr>)}</tbody></table>
              <div className="flex flex-wrap gap-2">{sim.tokens.map((t,i)=><button key={t.name} onClick={()=>sim.buy(i,100)} className="rounded border px-2 py-1">Buy {t.name} 100</button>)}</div>
              <div className="flex flex-wrap gap-2">{sim.tokens.map((t,i)=><button key={`${t.name}s`} onClick={()=>sim.sell(i,0.1)} className="rounded border px-2 py-1">Sell {t.name} 0.1</button>)}</div>
              <div className="flex gap-2"><button onClick={sim.sync} className="rounded bg-indigo-600 px-3 py-1.5 text-white">Trigger sync</button><button onClick={sim.injectLP} className="rounded border px-3 py-1.5">Inject LP depth</button><button onClick={sim.reset} className="rounded border px-3 py-1.5">Reset</button></div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-semibold">Portfolio</p>
              <p className="text-slate-600">Cash: {sim.cash.toFixed(2)} USDC</p>
              <p className="text-slate-600">Portfolio value: {sim.portfolioValue.toFixed(2)} USDC</p>
              <p className="mt-3 text-sm text-slate-500">Guided mode narrative: LP seeds reserve → user buys one contender → second user buys another → oracle shifts ranking metric ({sim.vertical === 'ai' ? 'benchmark score' : sim.vertical === 'crypto' ? 'TVL' : 'points'}) → sync re-anchors.</p>
            </div>
          </div>
        </section>

        <section id="faq" className="space-y-5">
          <h2 className="text-3xl font-semibold">Exhaustive FAQ</h2>
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <div className="space-y-2">{faqCategories.map((c)=><button key={c.title} onClick={()=>setFaqOpen(c.title)} className={`w-full rounded-lg px-3 py-2 text-left ${faqOpen===c.title?'bg-slate-900 text-white':'border bg-white'}`}>{c.title}</button>)}</div>
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">{faqCategories.find((f)=>f.title===faqOpen)?.items.map((i)=><details key={i.q} className="rounded-lg border p-3"><summary className="cursor-pointer font-medium">{i.q}</summary><p className="mt-2 text-slate-600">{i.a}</p></details>)}</div>
          </div>
        </section>

        <section id="cta" className="rounded-3xl border border-slate-200 bg-gradient-to-r from-sky-50 to-white p-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-700">Closing</p>
          <h2 className="mt-2 text-4xl font-semibold">Markets can price events. Leaderboard Markets price the standings.</h2>
          <p className="mx-auto mt-3 max-w-3xl text-slate-600">If rankings matter, this design turns ranking dynamics into a continuous market surface. Clear to users, extensible for operators, and coherent under the hood.</p>
        </section>
      </main>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-slate-600">{body}</p></div>;
}

function HeroVisual({ reduce }: { reduce: boolean }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <svg viewBox="0 0 640 380" className="w-full">
        <rect x="20" y="20" width="600" height="340" rx="24" fill="#f8fafc" stroke="#cbd5e1" />
        <text x="40" y="54" fill="#0f172a" fontSize="14" fontWeight="600">What you are looking at: leaderboard stacks + routed single-name flow + sync re-anchor.</text>
        {['Token A','Token B','Token C'].map((t,i)=><g key={t} transform={`translate(50 ${90+i*70})`}><rect width="180" height="44" rx="12" fill={i===0?'#cffafe':'#fff'} stroke="#94a3b8" /><text x="16" y="28" fill="#0f172a" fontSize="16">{t}</text></g>)}
        <rect x="280" y="90" width="140" height="180" rx="18" fill="#ecfeff" stroke="#06b6d4"/><text x="300" y="140" fontSize="14" fill="#0f172a">Shared reserve</text><text x="304" y="170" fontSize="20" fill="#0f172a">1500 USDC</text>
        <motion.circle cx="470" cy="120" r="42" fill="#fef3c7" stroke="#f59e0b" animate={reduce ? {} : { cy: [120, 110, 120] }} transition={{ repeat: Infinity, duration: 3 }} /><text x="445" y="126" fontSize="12">Route buy A</text>
        <motion.circle cx="540" cy="220" r="42" fill="#ede9fe" stroke="#6366f1" animate={reduce ? {} : { scale: [1,1.05,1] }} transition={{ repeat: Infinity, duration: 2.4 }} /><text x="520" y="226" fontSize="12">Sync</text>
      </svg>
    </div>
  );
}

function SystemDiagram({ activeNode, setActiveNode, reduce }: { activeNode: string; setActiveNode: (v: string)=>void; reduce: boolean }) {
  const btn = (id: string, x: number, y: number, label: string, color: string) => (
    <g onMouseEnter={()=>setActiveNode(id)} onClick={()=>setActiveNode(id)} className="cursor-pointer">
      <rect x={x} y={y} rx={12} width={150} height={48} fill={activeNode===id?color:'#fff'} stroke="#94a3b8" />
      <text x={x+12} y={y+29} fontSize="13">{label}</text>
    </g>
  );
  return <svg viewBox="0 0 760 360" className="w-full">
    {btn('reserve',20,150,'Shared reserve','#cffafe')}
    {btn('mint',210,60,'Full-basket mint','#e0f2fe')}
    {btn('lanes',210,240,'Virtual AMM lanes','#fef3c7')}
    {btn('oracle',430,60,'Oracle metric input','#ccfbf1')}
    {btn('sync',430,240,'Sync / re-anchor','#ede9fe')}
    {btn('lp',620,60,'LP fee-share','#dbeafe')}
    {btn('seasonal',620,240,'Optional seasonal close','#f1f5f9')}
    {['M100 175 L210 86','M100 175 L210 264','M360 84 L430 84','M360 264 L430 264','M580 84 L620 84','M580 264 L620 264','M505 109 L505 240'].map((d,i)=><motion.path key={i} d={d} stroke="#64748b" strokeWidth="2" fill="none" strokeDasharray="6 5" animate={reduce?{}:{strokeDashoffset:[0,-20]}} transition={{repeat:Infinity,duration:2, ease:'linear'}} />)}
  </svg>;
}

export default App;
