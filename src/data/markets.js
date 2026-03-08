export const MARKET_OPTIONS = [
  {
    id: 'ai',
    name: 'AI Models',
    contenders: [
      { name: 'GPT-4.5', weight: 0.45 },
      { name: 'Claude 3.5', weight: 0.35 },
      { name: 'Gemini 1.5', weight: 0.2 },
    ],
  },
  {
    id: 'epl',
    name: 'Premier League',
    contenders: [
      { name: 'Arsenal', weight: 0.4 },
      { name: 'Man City', weight: 0.35 },
      { name: 'Chelsea', weight: 0.25 },
    ],
  },
  {
    id: 'dex',
    name: 'Crypto Protocols',
    contenders: [
      { name: 'Uniswap', weight: 0.5 },
      { name: 'Raydium', weight: 0.3 },
      { name: 'Aerodrome', weight: 0.2 },
    ],
  },
];

export const LEARN_STEPS = [
  {
    title: 'What is a Leaderboard Market? & Why is it Needed?',
    mechanic:
      'A new DeFi primitive that turns any objective ranking (AI models, sports standings, creator growth, protocol revenues) into a continuous, tradable market.',
    rationale:
      'Traditional prediction markets ask “Will X happen?” and then die, fracturing liquidity across thousands of binary, expiring contracts where users can lose 100% of principal. Leaderboard markets ask “How much of the shared pool does each contender deserve right now?” This creates a continuous, non-terminal market where users can hold long-term, trade in and out freely, and invest purely in relative performance.',
  },
  {
    title: 'Shared Yield Reserve & Full-Basket Minting',
    mechanic:
      'All collateral sits in one shared reserve. The protocol never mints single names; 1 USDC mints exactly one full basket of every contender token.',
    rationale:
      'Balanced issuance guarantees solvency. Fundamental NAV is locked to oracle weight (NAV_i = w_i), so one contender cannot inflate and dilute another.',
  },
  {
    title: 'Single-Name Trading via the Zap Router',
    mechanic:
      'Users submit one-click BUY/SELL intents for a single contender. The router mints or compiles baskets behind the scenes, then routes residual legs through isolated vAMMs.',
    rationale:
      'Traders get familiar spot execution while the core reserve remains perfectly balanced and solvent.',
  },
  {
    title: 'Oracle Sync at Epoch Boundaries',
    mechanic:
      'At each scheduled sync, leaderboard weights update. vAMM quote reserves are deterministically reset so each spot price equals the new oracle NAV at the open.',
    rationale:
      'Continuous free-market discovery exists between syncs, but objective ranking data prevents permanent speculative drift.',
  },
  {
    title: 'LP Fee Shares & Duration-Based Earn-Out',
    mechanic:
      'LPs provide full baskets to the shared reserve and accrue Fee Shares over time. Shares are burned later to claim accrued trading fees and reserve yield.',
    rationale:
      'LPs earn for time-in-market rather than picking winners, avoiding adverse selection and preventing new capital from diluting historical earnings.',
  },
  {
    title: 'Adding a New Contender',
    mechanic:
      'New contenders are introduced at sync boundaries. Existing weights scale down proportionally, and new tokens are distributed to current holders by portfolio value.',
    rationale:
      'Leaderboard expansion becomes economically neutral; participation is preserved as the universe grows.',
  },
  {
    title: 'Seasonal Resolution',
    mechanic:
      'For finite leagues, a final sync locks terminal weights and halts trading. Holders redeem directly against terminal NAV without needing terminal AMM liquidity.',
    rationale:
      'Season-end unwind is deterministic and guaranteed, giving institutions a clean settlement path.',
  },
  {
    title: 'Ecosystem Value Proposition',
    mechanic:
      'A breakdown of why each participant uses the protocol.',
    rationale:
      'Traders & Hedgers: clean single-name relative exposure. Fans & Communities: measurable, tradable skin-in-the-game. LPs: time-based fee shares on parked principal without winner-picking. Market Makers & Arbitrageurs: repeatable spread capture and predictable sync-boundary arb. League Creators & Contenders: objective public price signal powering engagement and monetization.',
  },
];
