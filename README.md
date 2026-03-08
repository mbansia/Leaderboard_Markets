# Podium Leaderboard Markets — Explainer + Simulator

A fully client-side, stateless Vite + React + TypeScript microsite that explains and demonstrates Podium's **Leaderboard Markets**.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```

## Static deploy (Render)

- Build command: `npm install && npm run build`
- Publish directory: `dist`

## Canonical Beginner Walkthrough

The site now uses one canonical beginner example across Journey, Learn, Math, and Guided Simulator mode:

- 3 contenders: **Token A**, **Token B**, **Token C**
- Initial weights: 33.33% / 33.33% / 33.33%
- 1 full basket = 1 A + 1 B + 1 C
- 1000 USDC mints 1 full basket
- Initial NAV per token = 333.33
- Virtual lanes initialize at x=1000, y=3 for A/B/C (spot 333.33)

Story arc:
1. Genesis LP seeds reserve.
2. Pricing lanes initialize.
3. User 1 buys A via Zap routing (basket mint + non-target unwind + target acquisition).
4. User 2 buys C via same flow.
5. Oracle updates weights to 40/30/30.
6. Sync re-anchors next epoch.
7. Participant positions are compared post-sync.
8. LP earn-out is explained with principal-time intuition.

Beginner mode intentionally ignores fees in walkthrough arithmetic for clarity.

## Architecture

- `src/data/canonicalJourney.ts` — single source of truth for the canonical beginner storyboard and step states.
- `src/components/sections/JourneySection.tsx` — before/action/after walkthrough UI using canonical data.
- `src/components/sections/LearnSection.tsx` — deeper mechanism section aligned to same canonical example.
- `src/components/sections/MathSection.tsx` — formula and worked numbers tied to same canonical example.
- `src/components/sections/SimulatorSection.tsx` — guided mode follows canonical story; free mode supports broader exploration.
- `src/hooks/useLeaderboardMarket.ts` — reserve-based intuition engine (`x`, `y`, `spot = x/y`).
- `src/data/leagues.ts` — includes default guided `demo` league (Token A/B/C) plus AI/EPL/DeFi presets.

## Legacy compatibility files

Legacy JS/JSX shim files remain only for compatibility and are explicitly marked `@deprecated` in-file. Source of truth is the typed TS/TSX modules under `src/components/sections`, `src/data`, and `src/hooks`.
