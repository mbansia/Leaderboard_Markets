import { ComparisonRow } from '../types/content';

export const comparisonRows: ComparisonRow[] = [
  {
    category: 'Prediction markets',
    traded: 'Probability of a discrete answer',
    cadence: 'Terminal',
    relativePerformance: 'Limited',
    attachment: 'Medium',
    liquidity: 'Often fragmented by many questions',
    binaryDependence: 'High',
    ownership: 'No',
    leaderboardDependency: 'Optional'
  },
  {
    category: 'Sportsbooks / betting',
    traded: 'Bets on event outcomes',
    cadence: 'Mostly event-based',
    relativePerformance: 'Low',
    attachment: 'Short burst',
    liquidity: 'Split by fixtures/markets',
    binaryDependence: 'High',
    ownership: 'No',
    leaderboardDependency: 'No'
  },
  {
    category: 'Fan tokens',
    traded: 'Project/token exposure',
    cadence: 'Continuous',
    relativePerformance: 'Indirect',
    attachment: 'High',
    liquidity: 'Per-token pools',
    binaryDependence: 'None',
    ownership: 'Token ownership',
    leaderboardDependency: 'No'
  },
  {
    category: 'ETFs / indexes',
    traded: 'Basket exposure',
    cadence: 'Continuous',
    relativePerformance: 'Partial',
    attachment: 'Lower at single-name level',
    liquidity: 'Concentrated at product level',
    binaryDependence: 'None',
    ownership: 'Fund units',
    leaderboardDependency: 'No'
  },
  {
    category: 'Standard AMM trading',
    traded: 'Pairwise token exchange',
    cadence: 'Continuous',
    relativePerformance: 'Not native',
    attachment: 'Varies',
    liquidity: 'Pool-by-pool',
    binaryDependence: 'None',
    ownership: 'Spot token ownership',
    leaderboardDependency: 'No'
  },
  {
    category: 'Social speculation / meme markets',
    traded: 'Narrative-driven tokens',
    cadence: 'Continuous',
    relativePerformance: 'Unstructured',
    attachment: 'High but volatile',
    liquidity: 'Highly fragmented',
    binaryDependence: 'None',
    ownership: 'Token ownership',
    leaderboardDependency: 'Rare'
  },
  {
    category: 'Leaderboard Markets',
    traded: 'Share of standings trajectory',
    cadence: 'Continuous with sync epochs',
    relativePerformance: 'Native',
    attachment: 'High and persistent',
    liquidity: 'Shared reserve + routed execution lanes',
    binaryDependence: 'Low',
    ownership: 'Contender token exposure',
    leaderboardDependency: 'Core mechanism'
  }
];
