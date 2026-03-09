import { MarketCategory } from '../types/content';

export const demandGroups = ['Traders', 'Fans', 'Analysts', 'Allocators', 'Hedgers', 'Community members', 'League creators / brands', 'LPs / reserve capital providers'];

export const categories: MarketCategory[] = [
  {
    id: 'ai',
    name: 'AI models',
    rankedObject: 'Frontier models by benchmark score and usage momentum',
    obsession: 'People track model rankings weekly and debate every release cycle.',
    users: ['Model users', 'AI investors', 'Research analysts', 'Builders'],
    metric: 'Composite benchmark score oracle',
    cadence: 'Weekly',
    fit: 'Lets users express conviction on model trajectories between major launches.'
  },
  {
    id: 'crypto',
    name: 'Crypto protocols',
    rankedObject: 'Protocols ranked by TVL, fees, or active addresses',
    obsession: 'Crypto communities already watch leaderboard dashboards daily.',
    users: ['Token holders', 'DeFi traders', 'DAO treasuries', 'Researchers'],
    metric: 'TVL-based oracle with smoothing',
    cadence: 'Daily / weekly',
    fit: 'Converts “which protocol is climbing?” into an always-on market.'
  },
  {
    id: 'football',
    name: 'Football leagues',
    rankedObject: 'Teams ranked by league points and tie-break rules',
    obsession: 'Standings are core fan behavior across every matchday.',
    users: ['Fans', 'Media', 'Clubs', 'Analysts'],
    metric: 'Official league points table oracle',
    cadence: 'Matchday',
    fit: 'Creates long-season participation, not one-off match picks.'
  },
  {
    id: 'creators',
    name: 'Creators & streamers',
    rankedObject: 'Creators ranked by watch time, engagement, and growth',
    obsession: 'Audience communities constantly compare rank movement.',
    users: ['Fans', 'Talent managers', 'Brands', 'Creator funds'],
    metric: 'Platform analytics oracle',
    cadence: 'Daily',
    fit: 'Turns audience momentum into a tradable, social-native market.'
  },
  {
    id: 'music',
    name: 'Music charts',
    rankedObject: 'Artists/tracks ranked by streams, chart points, and sales',
    obsession: 'Chart races drive constant fan engagement and media coverage.',
    users: ['Fans', 'Labels', 'Analysts', 'Media operators'],
    metric: 'Chart index oracle',
    cadence: 'Weekly',
    fit: 'Captures trajectory exposure throughout chart cycles.'
  },
  {
    id: 'companies',
    name: 'Companies, sectors, ESG',
    rankedObject: 'Relative ranking of companies or sector baskets',
    obsession: 'Allocators and analysts benchmark leadership constantly.',
    users: ['Allocators', 'Hedgers', 'Advisors', 'Institutions'],
    metric: 'Index-weight and factor-score oracle',
    cadence: 'Monthly / quarterly',
    fit: 'Useful when users care about position shifts, not only absolute returns.'
  }
];
