import { FAQCategory } from '../types/content';

export const faqCategories: FAQCategory[] = [
  { title: 'A. Basics', items: [
    { q: 'What is a leaderboard market?', a: 'A leaderboard market lets you trade exposure to changing rank share over time, not just answer one yes/no event.' },
    { q: 'What is being traded?', a: 'Contender tokens represent relative standing exposure inside a shared-reserve market design.' },
    { q: 'Is this a prediction market?', a: 'It overlaps conceptually, but framing is different: prediction markets price answers; leaderboard markets price trajectories.' },
    { q: 'Who would use this?', a: 'Traders, fans, analysts, allocators, hedgers, communities, operators, and LP capital providers.' }
  ]},
  { title: 'B. Mechanics', items: [
    { q: 'What is a full basket?', a: 'In the canonical demo, one basket is 1A+1B+1C created from reserve collateral.' },
    { q: 'Why is single-name minting not the base layer?', a: 'Base issuance is full-basket for coherent collateral accounting. Single-name UX is achieved by route execution.' },
    { q: 'What do the virtual AMMs do?', a: 'They are pricing lanes for execution and price discovery per contender.' },
    { q: 'Are the AMMs the collateral?', a: 'No. The reserve is the collateral. Lanes are virtual pricing surfaces.' },
    { q: 'What does the oracle do?', a: 'It updates objective ranking weights from external metrics.' },
    { q: 'What is sync?', a: 'Sync re-anchors the next epoch around updated NAV fundamentals after oracle updates.' },
    { q: 'Why can spot differ from NAV?', a: 'Active order flow moves lane spot prices around fundamentals between sync events.' }
  ]},
  { title: 'C. LP / reserve questions', items: [
    { q: 'What does the LP actually provide?', a: 'Reserve capital that makes issuance and routed execution possible.' },
    { q: 'How do LPs earn?', a: 'Through fee-share logic tied to parked capital and time in market in this model.' },
    { q: 'Is this the same as standard AMM LPing?', a: 'No. The educational framing is time-based reserve participation for leaderboard markets.' }
  ]},
  { title: 'D. Market design questions', items: [
    { q: 'What happens when leaderboard changes?', a: 'Oracle updates weights; sync sets the next epoch reference from the new fundamentals.' },
    { q: 'What happens when contenders are added?', a: 'A rebalance epoch can expand basket composition with transparent rule updates.' },
    { q: 'Can this be seasonal?', a: 'Yes. Operators can run open-ended or seasonal markets with close/reopen rules.' },
    { q: 'What is the role of fees?', a: 'Fees fund operation and LP earn-out; demo ignores fees in beginner arithmetic for clarity.' }
  ]},
  { title: 'E. Comparisons', items: [
    { q: 'Why not fan tokens?', a: 'Fan tokens are direct asset exposure; leaderboard markets isolate relative-standing dynamics.' },
    { q: 'Why not ETFs/indexes?', a: 'Indexes package baskets but do not natively express ranking trajectory micro-views.' },
    { q: 'Why not many binary markets?', a: 'Many binaries fragment attention and liquidity. This keeps one continuous standings surface.' },
    { q: 'Why better for relative performance?', a: 'Mechanics explicitly map trading flow to changing rank share.' }
  ]},
  { title: 'F. Risks / limitations', items: [
    { q: 'Main risks?', a: 'Oracle quality, parameterization, liquidity depth, volatility, and user misunderstanding.' },
    { q: 'What assumptions are simplified in the demo?', a: 'Fees, slippage microstructure, governance, and production-grade risk controls are simplified.' }
  ]},
  { title: 'G. Operator / business questions', items: [
    { q: 'Why could this become a real business?', a: 'Because many categories already have ranking obsession and recurring update cycles.' },
    { q: 'What categories work best?', a: 'Categories with objective metrics, high engagement, and repeatable sync cadence.' },
    { q: 'Why understandable for fans and traders?', a: 'The base concept is intuitive: own more of who is climbing the table.' }
  ]}
];
