# policing-simulation (ex-PredPol)

A Next.js + React + Tailwind project for a policing simulation UI and tools. This repository contains a playable simulation interface, UI components, and helper libraries for running and visualizing simulation rounds.

NOTE: This README was generated from the repository contents. If any details below are inaccurate, please update accordingly.

## Quick start

Prerequisites
- Node.js 18+ (recommended)
- pnpm (preferred, a `pnpm-lock.yaml` is present) — you can use npm or yarn, but commands below use pnpm

Install

```powershell
pnpm install
```

Run in development

```powershell
# start the development server (shorthand)
pnpm dev

# or the npm-style script form (identical)
pnpm run dev
```

Build for production

```powershell
pnpm build
pnpm start
```

Lint

```powershell
pnpm lint
```

The app defaults to http://localhost:3000 when running locally.

## Scripts (from `package.json`)
- `dev` — start Next.js in development mode
- `build` — build the Next.js production bundle
- `start` — start the Next.js production server
- `lint` — run Next.js lint

## Tech stack
- Next.js (v15)
- React (v19)
- TypeScript
- Tailwind CSS
- PostCSS
- Various Radix UI primitives and utility libraries (see `package.json` for full list)

## Project layout (high level)
- `app/` — Next.js app directory with pages and global layout
  - `game/` — in-app game pages (map, history, performance)
- `components/` — reusable UI components and game UI pieces
  - `ui/` — small primitives (buttons, inputs, modals, etc.)
  - `charts/`, `analytics-tabs/` — visualization components
  - `game/` — game-specific components
- `lib/` — simulation logic and helpers
  - `game-simulation.js`, `game-state.js`, `game-state.ts` — core simulation/state logic
  - `utils.ts` — utilities
- `hooks/` — React hooks used across the app
- `styles/` — global styles (Tailwind config lives at project root)
- `public/` — static assets
- `types/` — shared TypeScript types

## Notes & developer tips
- The repo mixes TypeScript and JavaScript files in `lib/` (`.js` + `.ts`). Type-checking will only apply to `.ts` files; ensure any JS that is critical is covered or migrated if strict typing is desired.
- Tailwind configuration is present (`tailwind.config.ts`) and PostCSS is configured. Ensure your editor recognizes the Tailwind setup for class name completion.
- The UI uses many Radix UI components and some 3rd-party charting libs (`recharts`) — check `package.json` for the full dependency list.

## Testing
There are no automated tests detected in the repository. If you want tests, consider adding a minimal test setup (Vitest/Jest + React Testing Library) focused on the main simulation functions in `lib/` and a few simple component render tests.

## Troubleshooting
- "Missing engine" or Node errors: upgrade/downgrade Node to a compatible version (Node 18+ recommended).
- If you prefer npm or yarn, run the equivalent commands (`npm install` / `npm run dev`).

## Contributing
- Fork the repo and open a branch for your feature or fix.
- Keep changes small and focused; add TypeScript types and tests when touching simulation logic.
- Run `pnpm lint` before creating a PR.

## License
No license file detected in the repository. Add a `LICENSE` file to clarify usage terms.

## Contact / More info
Check repository `components.json`, `docs/` and the `docs/*.md` files for design notes and game-balance details.

---
Generated README (automatically) — update as needed to match your project goals.
