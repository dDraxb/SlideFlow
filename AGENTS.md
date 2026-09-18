# AGENTS.md — working on the SlideFlow framework

Guidance for AI coding agents (and new humans) contributing to this repo. This file covers the framework itself; every deck scaffolded by `create-slideflow` ships its own `AGENTS.md` for deck authoring.

## What this is

A pnpm workspace publishing two npm packages: `packages/slideflow` (a React presentation engine) and `packages/create-slideflow` (a scaffolder generating deck apps). `demo/` is a workspace app exercising every engine feature. See `README.md` for the full layout.

## Commands

```bash
pnpm install                        # whole workspace
pnpm test                           # every package's suite (vitest; engine tests are colocated *.test.tsx)
pnpm --filter slideflow build       # tsup → dist/ (ESM + d.ts)
pnpm --filter slideflow-demo dev    # run the demo deck
pnpm --filter slideflow-demo build  # tsc -b && vite build
pnpm sync:authoring                 # copy docs/authoring + check-text.mjs into the scaffolder template
```

## Hard constraints (not obvious from the code)

- **Engine has zero runtime dependencies.** Peers only: `react`, `react-dom` (`^18.2.0 || ^19.0.0`). Never add clsx, framer-motion, react-router, or any styling dependency. `src/cx.ts` exists precisely to avoid clsx.
- **All animation is CSS-only**, including the slide cross-fade in `Deck.tsx` (snapshot + `sf-stage-exit` layer + animationend/timeout). Respect `prefers-reduced-motion` in any new animation.
- **CSS naming:** every engine class is `sf-`-prefixed; every design token is a `--sf-*` custom property, and every `var(--sf-*)` in `styles.css` must carry a hardcoded fallback so the engine renders without `theme.css`.
- **Router-agnostic:** URL handling goes through the `UrlAdapter` contract in `src/url.ts`. The default hash adapter uses `history.replaceState` deliberately (one history entry, so Back leaves the deck). Never import a router.
- **Learn mode pins the step** to the slide's declared `steps` (`DeckContext.tsx`); `prev()` in learn mode jumps a whole slide. This is intentional, not a bug.
- **`inert.ts` is version-aware** (React 18 needs `inert=""`, React 19 needs `inert={true}`). Keep it that way while the peer range spans both majors.
- **TDD:** failing test first, real captured output, then implementation. Tests live next to sources.

## Editing rules

- `docs/authoring/` and `scripts/check-text.mjs` are canonical. The copies under `packages/create-slideflow/template/` are generated: edit the canonical files and run `pnpm sync:authoring`; never edit the template copies directly.
- Template and demo deck sources must stay free of em/en dashes; the shipped `check-text.mjs` hard-fails on them (`pnpm --filter slideflow-demo lint:text`).
- The demo is the manual regression surface. After any engine change, run it and walk the keyboard map: reveals, cross-fade, `E` drawer, `?` help, Escape sequencing, Learn mode, `?mode=learn#/1` deep link, the `data-interactive` widget.
- Commits are authored solely under the repo owner's name: never add AI co-author trailers (`Co-Authored-By: Claude ...`) or generated-by footers to commits or PRs.
- `docs/superpowers/` is local-only process material and is gitignored; never commit or publish it.

## Releasing

1. Bump versions in both package.json files.
2. `pnpm sync:authoring`.
3. `pnpm -r publish` from `main` with a clean tree (or pass `--no-git-checks`). Publishing is the repo owner's call; never publish autonomously.
