export const pathways = ['LEARN', 'SIMULATE', 'ESTIMATE', 'THE MATH'] as const;

export const learnSteps = [
  ['What it is', 'Continuous markets for relative performance, not one-off event resolution.'],
  ['Full-basket issuance', 'Primary layer mints balanced baskets only to preserve solvency.'],
  ['Single-name zap UX', 'Users trade one contender while router handles basket + conversion.'],
  ['Oracle sync', 'Scheduled re-anchor aligns spot to objective fundamental NAVs.'],
  ['LP fee-share', 'Earn-out from time parked in principal instead of toxic-flow exposure.'],
  ['Safe inclusion', 'New contenders added at sync boundaries with anti-dilution logic.'],
  ['Seasonal close', 'Finite leagues settle at terminal sync; perpetual leagues keep running.'],
  ['Category expansion', 'AI, creators, sports, protocols, music, ESG and beyond.'],
  ['Ecosystem value', 'Different utility for traders, fans, allocators, hedgers, LPs, curators.'],
] as const;

export const glossary = [
  ['Fundamental NAV', 'Oracle-implied fair value of a contender share from current weights + reserve accounting.'],
  ['Zap Router', 'Execution layer that mints full baskets and routes into single-name exposure.'],
  ['Sync', 'Scheduled epoch boundary when oracle weights refresh and prices re-anchor.'],
  ['Principal Parked Time', 'Duration LP capital remains in reserve, driving fee-share earn-out.'],
] as const;
