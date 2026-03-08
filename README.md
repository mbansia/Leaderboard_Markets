# Podium Leaderboard Markets Microsite

Production-style single-page explainer for Podium's **Leaderboard Markets** built with Vite + React + TypeScript + Tailwind + Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Static deploy (Render)

- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`
- No backend or server required (fully client-side and stateless).

## Architecture summary

- `src/App.tsx`: full single-page storytelling experience and all major sections
- `src/data/leagues.ts`: typed mock league presets and contender data
- `src/data/content.ts`: typed structured narrative + glossary content
- `src/hooks/useLeagueSimulator.ts`: local simulation engine (zap-like trade routing intuition, sync, LP depth)
- `src/index.css`: light premium design system foundations

## Intentional simulator simplifications

This is an **interactive intuition model**, not smart-contract parity.

- Trade impact uses deterministic depth-weighted slippage approximations.
- Sync randomizes weights in bounded ranges and deterministically re-anchors spot to NAV.
- LP injection increases a depth multiplier used in slippage calculations.

These simplifications preserve mechanism narrative fidelity while keeping the demo transparent and fast.
