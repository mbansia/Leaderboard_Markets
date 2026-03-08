export type LearnStep = {
  id: string;
  title: string;
  plainEnglish: string;
  underTheHood: string;
  whyItMatters: string;
  designRationale: string;
  workedExample: string;
  diagramVariant: 'basket' | 'zap' | 'sync' | 'lp' | 'season';
};

export type JourneySlide = {
  title: string;
  happening: string;
  why: string;
  function: string;
  rationale: string;
  example: string;
  plain: string;
  underTheHood?: string;
  diagram?: 'system' | 'zap';
};
