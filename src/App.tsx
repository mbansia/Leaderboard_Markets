import { Navbar } from './components/layout/Navbar';
import { CategoriesSection } from './components/sections/CategoriesSection';
import { ComparisonSection } from './components/sections/ComparisonSection';
import { EcosystemSection } from './components/sections/EcosystemSection';
import { FaqSection } from './components/sections/FaqSection';
import { HeroSection } from './components/sections/HeroSection';
import { JourneySection } from './components/sections/JourneySection';
import { LearnSection } from './components/sections/LearnSection';
import { MathSection } from './components/sections/MathSection';
import { SimulatorSection } from './components/sections/SimulatorSection';
import { WhatIsSection } from './components/sections/WhatIsSection';
import { useBeginnerMode } from './hooks/useBeginnerMode';

export default function App() {
  const { mode, setMode, persona, setPersona } = useBeginnerMode();

  return (
    <div className="text-slate-900">
      <Navbar mode={mode} setMode={setMode} persona={persona} setPersona={setPersona} />
      <main className="bg-noise">
        <HeroSection />
        <WhatIsSection />
        <JourneySection />
        <ComparisonSection />
        <LearnSection mode={mode} />
        <SimulatorSection mode={mode} persona={persona} />
        <CategoriesSection />
        <EcosystemSection />
        <MathSection mode={mode} />
        <FaqSection />
      </main>
      <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} Podium · Tradable rankings, not terminal bets.</footer>
    </div>
  );
}
