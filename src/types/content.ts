export type MarketCategory = {
  id: string;
  name: string;
  rankedObject: string;
  obsession: string;
  users: string[];
  metric: string;
  cadence: string;
  fit: string;
};

export type ComparisonRow = {
  category: string;
  traded: string;
  cadence: string;
  relativePerformance: string;
  attachment: string;
  liquidity: string;
  binaryDependence: string;
  ownership: string;
  leaderboardDependency: string;
};

export type WalkthroughStep = {
  id: number;
  title: string;
  story: string;
  before: string[];
  action: string[];
  after: string[];
  matters: string;
  hood: string;
};

export type FAQItem = { q: string; a: string };
export type FAQCategory = { title: string; items: FAQItem[] };
