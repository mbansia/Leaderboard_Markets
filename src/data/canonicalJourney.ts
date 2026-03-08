export type CanonicalLane = { x: number; y: number; spot: number };
export type CanonicalPosition = { usdc: number; basket: number; a: number; b: number; c: number };

export type CanonicalState = {
  reserveUsdc: number;
  basketUnits: number;
  nav: { a: number; b: number; c: number };
  lanes: { a: CanonicalLane; b: CanonicalLane; c: CanonicalLane };
  positions: { lp: CanonicalPosition; user1: CanonicalPosition; user2: CanonicalPosition };
};

export type CanonicalStep = {
  id: string;
  title: string;
  story: string;
  whyItMatters: string;
  before: CanonicalState;
  actionMath: string[];
  after: CanonicalState;
  takeaway: string;
};

const emptyPos: CanonicalPosition = { usdc: 0, basket: 0, a: 0, b: 0, c: 0 };

export const canonicalNotes = {
  feeAssumption: 'Beginner walkthrough ignores fees to keep arithmetic simple and transparent.',
  pricingLane: 'Virtual AMM lanes are execution/pricing lanes. They are not extra collateral vaults.',
};

export const CANONICAL_STEPS: CanonicalStep[] = [
  {
    id: 'genesis',
    title: 'Step 1 — Genesis LP starts the market',
    story: 'One LP deposits 1,000 USDC into the shared reserve. Economically this mints 1.00 full basket (1 A + 1 B + 1 C).',
    whyItMatters: 'The reserve is the real collateral base. LP starts with a full-basket position, not three separate single-name LP tokens.',
    before: {
      reserveUsdc: 0,
      basketUnits: 0,
      nav: { a: 0, b: 0, c: 0 },
      lanes: { a: { x: 0, y: 0, spot: 0 }, b: { x: 0, y: 0, spot: 0 }, c: { x: 0, y: 0, spot: 0 } },
      positions: { lp: emptyPos, user1: { usdc: 300, ...emptyPos }, user2: { usdc: 200, ...emptyPos } },
    },
    actionMath: ['LP deposits 1,000 USDC', '1 full basket = 1 A + 1 B + 1 C', 'Basket units outstanding = 1.00', 'NAV per token = 1,000 ÷ 3 = 333.33'],
    after: {
      reserveUsdc: 1000,
      basketUnits: 1,
      nav: { a: 333.33, b: 333.33, c: 333.33 },
      lanes: { a: { x: 0, y: 0, spot: 0 }, b: { x: 0, y: 0, spot: 0 }, c: { x: 0, y: 0, spot: 0 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 300, basket: 0, a: 0, b: 0, c: 0 }, user2: { usdc: 200, basket: 0, a: 0, b: 0, c: 0 } },
    },
    takeaway: 'LP has launched the market with one collateralized full-basket position.',
  },
  {
    id: 'lanes',
    title: 'Step 2 — Virtual AMM pricing lanes are created',
    story: 'Protocol initializes one lane each for A, B, and C to enable single-name execution and spot discovery.',
    whyItMatters: 'These lanes price trades; they do not introduce separate collateral vaults beyond the shared reserve.',
    before: {
      reserveUsdc: 1000,
      basketUnits: 1,
      nav: { a: 333.33, b: 333.33, c: 333.33 },
      lanes: { a: { x: 0, y: 0, spot: 0 }, b: { x: 0, y: 0, spot: 0 }, c: { x: 0, y: 0, spot: 0 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 300, basket: 0, a: 0, b: 0, c: 0 }, user2: { usdc: 200, basket: 0, a: 0, b: 0, c: 0 } },
    },
    actionMath: ['A lane: x=1,000, y=3, spot=333.33', 'B lane: x=1,000, y=3, spot=333.33', 'C lane: x=1,000, y=3, spot=333.33'],
    after: {
      reserveUsdc: 1000,
      basketUnits: 1,
      nav: { a: 333.33, b: 333.33, c: 333.33 },
      lanes: { a: { x: 1000, y: 3, spot: 333.33 }, b: { x: 1000, y: 3, spot: 333.33 }, c: { x: 1000, y: 3, spot: 333.33 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 300, basket: 0, a: 0, b: 0, c: 0 }, user2: { usdc: 200, basket: 0, a: 0, b: 0, c: 0 } },
    },
    takeaway: 'Single-name pricing lanes are now live, while reserve collateral remains the same 1,000 USDC.',
  },
  {
    id: 'u1-buy-a',
    title: 'Step 3 — User 1 buys Token A with 300 USDC',
    story: 'User 1 wants only A. Zap mints baskets first, then unwinds non-target legs and routes proceeds into A.',
    whyItMatters: 'Single-name UX is achieved without bypassing full-basket issuance discipline.',
    before: {
      reserveUsdc: 1000,
      basketUnits: 1,
      nav: { a: 333.33, b: 333.33, c: 333.33 },
      lanes: { a: { x: 1000, y: 3, spot: 333.33 }, b: { x: 1000, y: 3, spot: 333.33 }, c: { x: 1000, y: 3, spot: 333.33 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 300, basket: 0, a: 0, b: 0, c: 0 }, user2: { usdc: 200, basket: 0, a: 0, b: 0, c: 0 } },
    },
    actionMath: [
      '300 USDC mints 0.30 baskets => 0.30 A + 0.30 B + 0.30 C',
      'Sell 0.30 B into B lane => ~90.91 USDC recovered',
      'Sell 0.30 C into C lane => ~90.91 USDC recovered',
      'Recovered quote = 181.82 USDC',
      'Use 181.82 USDC in A lane => ~0.46 extra A',
      'Total User 1 receive = 0.30 + 0.46 = ~0.76 A',
    ],
    after: {
      reserveUsdc: 1300,
      basketUnits: 1.3,
      nav: { a: 333.33, b: 333.33, c: 333.33 },
      lanes: { a: { x: 1181.82, y: 2.54, spot: 465.28 }, b: { x: 909.09, y: 3.3, spot: 275.48 }, c: { x: 909.09, y: 3.3, spot: 275.48 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 0, basket: 0, a: 0.76, b: 0, c: 0 }, user2: { usdc: 200, basket: 0, a: 0, b: 0, c: 0 } },
    },
    takeaway: 'After one buy, A spot rises while B and C spots fall because order flow is directional.',
  },
  {
    id: 'u2-buy-c',
    title: 'Step 4 — User 2 buys Token C with 200 USDC',
    story: 'User 2 now expresses a different view and targets C, routing through the same basket-first flow.',
    whyItMatters: 'Later users can move relative prices independently; this is continuous market discovery.',
    before: {
      reserveUsdc: 1300,
      basketUnits: 1.3,
      nav: { a: 333.33, b: 333.33, c: 333.33 },
      lanes: { a: { x: 1181.82, y: 2.54, spot: 465.28 }, b: { x: 909.09, y: 3.3, spot: 275.48 }, c: { x: 909.09, y: 3.3, spot: 275.48 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 0, basket: 0, a: 0.76, b: 0, c: 0 }, user2: { usdc: 200, basket: 0, a: 0, b: 0, c: 0 } },
    },
    actionMath: [
      '200 USDC mints 0.20 baskets => 0.20 A + 0.20 B + 0.20 C',
      'Sell 0.20 A into A lane => ~86.31 USDC recovered',
      'Sell 0.20 B into B lane => ~51.95 USDC recovered',
      'Recovered quote = 138.26 USDC',
      'Use 138.26 USDC in C lane => ~0.44 extra C',
      'Total User 2 receive = 0.20 + 0.44 = ~0.64 C',
    ],
    after: {
      reserveUsdc: 1500,
      basketUnits: 1.5,
      nav: { a: 333.33, b: 333.33, c: 333.33 },
      lanes: { a: { x: 1095.51, y: 2.74, spot: 399.82 }, b: { x: 857.14, y: 3.5, spot: 244.90 }, c: { x: 1047.35, y: 2.86, spot: 366.21 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 0, basket: 0, a: 0.76, b: 0, c: 0 }, user2: { usdc: 0, basket: 0, a: 0, b: 0, c: 0.64 } },
    },
    takeaway: 'Now C is bid, B remains weak, and A stays above baseline after earlier demand.',
  },
  {
    id: 'oracle-update',
    title: 'Step 5 — Real-world leaderboard updates weights',
    story: 'Oracle moves from equal weights to A=40%, B=30%, C=30%.',
    whyItMatters: 'Fundamental value is tied to objective standings, not just recent trade flow.',
    before: {
      reserveUsdc: 1500,
      basketUnits: 1.5,
      nav: { a: 333.33, b: 333.33, c: 333.33 },
      lanes: { a: { x: 1095.51, y: 2.74, spot: 399.82 }, b: { x: 857.14, y: 3.5, spot: 244.90 }, c: { x: 1047.35, y: 2.86, spot: 366.21 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 0, basket: 0, a: 0.76, b: 0, c: 0 }, user2: { usdc: 0, basket: 0, a: 0, b: 0, c: 0.64 } },
    },
    actionMath: ['Reserve after trades = 1,500 USDC', 'Basket units outstanding = 1.50', 'New fundamental NAV: A=40%×1,000=400, B=300, C=300'],
    after: {
      reserveUsdc: 1500,
      basketUnits: 1.5,
      nav: { a: 400, b: 300, c: 300 },
      lanes: { a: { x: 1095.51, y: 2.74, spot: 399.82 }, b: { x: 857.14, y: 3.5, spot: 244.90 }, c: { x: 1047.35, y: 2.86, spot: 366.21 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 0, basket: 0, a: 0.76, b: 0, c: 0 }, user2: { usdc: 0, basket: 0, a: 0, b: 0, c: 0.64 } },
    },
    takeaway: 'Fundamentals moved: A strengthened, B and C reset lower than equal-weight baseline.',
  },
  {
    id: 'sync',
    title: 'Step 6 — Sync re-anchors next epoch',
    story: 'Before sync, spots reflect order flow. At sync, lanes re-open anchored to new NAV.',
    whyItMatters: 'You get both free-market drift between syncs and objective reset at boundaries.',
    before: {
      reserveUsdc: 1500,
      basketUnits: 1.5,
      nav: { a: 400, b: 300, c: 300 },
      lanes: { a: { x: 1095.51, y: 2.74, spot: 399.82 }, b: { x: 857.14, y: 3.5, spot: 244.90 }, c: { x: 1047.35, y: 2.86, spot: 366.21 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 0, basket: 0, a: 0.76, b: 0, c: 0 }, user2: { usdc: 0, basket: 0, a: 0, b: 0, c: 0.64 } },
    },
    actionMath: ['Pre-sync spots: A~399.82, B~244.90, C~366.21', 'Post-sync opening anchors: A=400, B=300, C=300'],
    after: {
      reserveUsdc: 1500,
      basketUnits: 1.5,
      nav: { a: 400, b: 300, c: 300 },
      lanes: { a: { x: 1096, y: 2.74, spot: 400 }, b: { x: 1050, y: 3.5, spot: 300 }, c: { x: 858, y: 2.86, spot: 300 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 0, basket: 0, a: 0.76, b: 0, c: 0 }, user2: { usdc: 0, basket: 0, a: 0, b: 0, c: 0.64 } },
    },
    takeaway: 'Sync resets the next epoch starting point to objective fundamentals.',
  },
  {
    id: 'positions',
    title: 'Step 7 — Participant positions after sync',
    story: 'Now compare what each participant owns and what those holdings are worth at post-sync NAV.',
    whyItMatters: 'PnL comes from how your held contender’s standing share changed relative to your entry.',
    before: {
      reserveUsdc: 1500,
      basketUnits: 1.5,
      nav: { a: 400, b: 300, c: 300 },
      lanes: { a: { x: 1096, y: 2.74, spot: 400 }, b: { x: 1050, y: 3.5, spot: 300 }, c: { x: 858, y: 2.86, spot: 300 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 0, basket: 0, a: 0.76, b: 0, c: 0 }, user2: { usdc: 0, basket: 0, a: 0, b: 0, c: 0.64 } },
    },
    actionMath: ['User 1 mark-to-NAV ≈ 0.76 × 400 = 304.62', 'User 2 mark-to-NAV ≈ 0.64 × 300 = 190.69', 'LP still holds full basket exposure (1 A + 1 B + 1 C)'],
    after: {
      reserveUsdc: 1500,
      basketUnits: 1.5,
      nav: { a: 400, b: 300, c: 300 },
      lanes: { a: { x: 1096, y: 2.74, spot: 400 }, b: { x: 1050, y: 3.5, spot: 300 }, c: { x: 858, y: 2.86, spot: 300 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 0, basket: 0, a: 0.76, b: 0, c: 0 }, user2: { usdc: 0, basket: 0, a: 0, b: 0, c: 0.64 } },
    },
    takeaway: 'User 1 benefited from A weight increase; User 2 is below cost if C reset lower than effective entry.',
  },
  {
    id: 'lp-earnout',
    title: 'Step 8 — LP earn-out in plain English',
    story: 'LP rewards are tied to how much capital is parked and for how long.',
    whyItMatters: 'Early and durable depth provision is rewarded more than late participation.',
    before: {
      reserveUsdc: 1500,
      basketUnits: 1.5,
      nav: { a: 400, b: 300, c: 300 },
      lanes: { a: { x: 1096, y: 2.74, spot: 400 }, b: { x: 1050, y: 3.5, spot: 300 }, c: { x: 858, y: 2.86, spot: 300 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 0, basket: 0, a: 0.76, b: 0, c: 0 }, user2: { usdc: 0, basket: 0, a: 0, b: 0, c: 0.64 } },
    },
    actionMath: ['Illustration: LP1 parks 1,000 for full period', 'LP2 parks 500 halfway through', 'LP1 principal-time = 1,000×1.0 = 1,000', 'LP2 principal-time = 500×0.5 = 250', 'LP1 earns more fee-share because capital was parked longer'],
    after: {
      reserveUsdc: 1500,
      basketUnits: 1.5,
      nav: { a: 400, b: 300, c: 300 },
      lanes: { a: { x: 1096, y: 2.74, spot: 400 }, b: { x: 1050, y: 3.5, spot: 300 }, c: { x: 858, y: 2.86, spot: 300 } },
      positions: { lp: { usdc: 0, basket: 1, a: 1, b: 1, c: 1 }, user1: { usdc: 0, basket: 0, a: 0.76, b: 0, c: 0 }, user2: { usdc: 0, basket: 0, a: 0, b: 0, c: 0.64 } },
    },
    takeaway: 'LP earn-out is time-weighted principal participation, not standard toxic-flow LP exposure.',
  },
];
