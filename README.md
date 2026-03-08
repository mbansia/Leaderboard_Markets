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

## Architecture (current)

- `src/App.tsx` — composed page shell and final section order
- `src/components/layout/Navbar.tsx` — sticky nav + Beginner/Advanced + persona lens
- `src/components/sections/*` — modular sections:
  - Hero, What Is It, Journey storyboard, Comparison deck, Learn, Simulator,
  - Categories demand thesis, Ecosystem value props, Math, FAQ/CTA
- `src/hooks/useLeaderboardMarket.ts` — main reserve-based simulator engine
- `src/hooks/useGuidedJourney.ts` — keyboard/storyboard controls
- `src/hooks/useBeginnerMode.ts` — detail mode + persona lens state
- `src/data/leagues.ts` — unified typed league presets and contender seeds
- `src/data/content.ts`, `src/data/categories.ts`, `src/data/participants.ts` — typed content model
- `src/types/*` — market/content interfaces
- `src/lib/*` — formatting and glossary helpers

## Simulator modeling notes (intentional simplifications)

This is an **interactive intuition model**, not smart-contract parity.

- Uses reserve intuition (`x`, `y`, `spot = x/y`) per contender.
- Single-name buy/sell routes through basket logic and reserve updates.
- Sync re-anchors NAV/spot from updated oracle metrics in deterministic cycles.
- LP injection scales reserves coherently and updates principal.
- LP earn-out is shown as a parked-capital-time intuition metric.

## Migration / consolidation notes

- Main app now uses one typed simulator engine (`useLeaderboardMarket.ts`).
- Data model consolidated into typed league/content/category/participant files.
- Legacy JS/JSX files are retained only as compatibility stubs/re-exports and are no longer the source of truth.
