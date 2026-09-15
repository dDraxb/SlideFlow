# SlideFlow

SlideFlow is a small, router-agnostic presentation engine for React, built so slide decks stop being copy-pasted between projects. It gives you progressive reveals, present and learn modes, an explain drawer for narration, and URL-addressable slides — as a self-contained styled component with only `react` and `react-dom` as peer dependencies. The monorepo publishes two npm packages: `slideflow`, the engine, and `create-slideflow`, a scaffolder that generates a ready-to-run deck app in one command.

## Repo structure

```
SlideFlow/
├── packages/
│   ├── slideflow/              # engine package → npm
│   │   ├── src/
│   │   │   ├── index.ts        # exports: Deck, Reveal, useDeck, DeckProvider, useStageContext, createHashAdapter, types
│   │   │   ├── types.ts        # Slide, DeckModel, StageContext, Mode, Narration
│   │   │   ├── DeckContext.tsx # nav state, URL sync, learn-mode pin
│   │   │   ├── Deck.tsx        # chrome, keyboard, explain drawer, cross-fade
│   │   │   ├── Reveal.tsx      # CSS-only reveal primitive
│   │   │   ├── NavHelp.tsx     # help modal (focus mgmt, key swallowing)
│   │   │   └── inert.ts        # React 18 inert polyfill
│   │   ├── styles.css          # chrome + reveal/cross-fade animations, token-driven
│   │   ├── theme.css           # default dark palette (optional import)
│   │   └── package.json        # peers: react, react-dom
│   └── create-slideflow/       # scaffolder → npm
│       ├── index.mjs           # bin: prompts → copy template + string replace
│       └── template/           # full deck app skeleton
├── demo/                       # workspace app: demo deck, dev playground
├── docs/authoring/             # canonical deck-standard, writing-rules, tone-of-voice
├── scripts/check-text.mjs      # canonical text lint
└── pnpm-workspace.yaml
```

## Developing

```bash
pnpm install                        # install the whole workspace
pnpm test                           # run every package's test suite
pnpm --filter slideflow-demo dev    # run the demo deck locally
```

The `demo/` app consumes `slideflow` via `workspace:*` and exercises every engine feature — multi-step reveals, the explain drawer, learn mode, cross-fade, act labels, the help modal. It's the fastest way to see a change working and doubles as the manual regression check before a release: run it after any engine change.

`docs/authoring/` and `scripts/check-text.mjs` are the canonical source for authoring standards and the text lint. The demo references them directly (same workspace); `create-slideflow`'s template — which ships standalone to consumers — gets its own copy via `pnpm sync:authoring`, also run automatically on `prepack` before that package is published.

## Releasing

Publishing is manual and simple for v1 — no changesets, no CI:

1. Bump the version in `packages/slideflow/package.json` and `packages/create-slideflow/package.json`.
2. Run `pnpm sync:authoring` so the scaffolder's template ships the current authoring docs and text lint.
3. Run `pnpm -r publish` from the repo root to publish both packages.

## Integrating with a host app that has its own router

The built-in hash sync (`#/<index>/<step>` + `?mode=learn`) works with zero configuration, but a host app that already owns the address bar — a host app, say, with `react-router` — can hand `Deck` a `urlAdapter` to read and write its own routes instead, and an `onExit` callback for what happens when the last Escape press leaves the deck:

```tsx
<Deck
  deck={myDeck}
  urlAdapter={{ read: readFromRoute, write: writeToRoute, subscribe: onRouteChange }}
  onExit={() => navigate("/presentation")} />
```

See `packages/slideflow/README.md` for the full `urlAdapter`/`onExit` contract and the rest of the engine's public API.

## License

MIT
