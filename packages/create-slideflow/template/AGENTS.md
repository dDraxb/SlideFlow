# AGENTS.md — authoring "__DECK_TITLE__"

Guidance for AI coding agents (and humans) writing slides in this deck. It runs on [slideflow](https://www.npmjs.com/package/slideflow); the engine's full API is in that package's README.

## First: replace the examples

The two `Example*` slides are placeholders and render an on-screen "Example slide: replace me" ribbon. To replace them:

1. Write a stage component in `src/stages/` (shape: a component taking `{ ctx: StageContext }`).
2. Register it in `src/deck.tsx` with an `id`, `title`, `steps` count, your `Stage`, and `narration` or `explain`.
3. Delete `ExampleTitleCard.tsx`, `ExampleReveal.tsx`, and their entries in `deck.tsx`.

## The slide contract

```ts
{
  id: string;            // unique, stable (it appears in deep-link URLs)
  act?: string;          // act label shown in the chrome, e.g. "Act 1: the setup"
  title: string;         // for chrome + screen readers, not necessarily on-slide
  steps?: number;        // progressive reveals; 0 or absent = static slide
  Stage: ComponentType<{ ctx: StageContext }>;
  explain?: ReactNode;   // rich drawer content; wins over narration when both exist
  narration?: string | string[];  // string[] = one block per step, index 0 = opening
  takeaway?: ReactNode;  // one line the audience leaves the slide with
}
```

Inside a stage, pace content with the reveal primitive; `at` values run 1..steps:

```tsx
import { Reveal, type StageContext } from "slideflow";

export function MyStage({ ctx }: { ctx: StageContext }) {
  return (
    <div>
      <h2>Always visible</h2>
      <Reveal ctx={ctx} at={1}><p>Appears on the first arrow press.</p></Reveal>
      <Reveal ctx={ctx} at={2}><p>Appears on the second.</p></Reveal>
    </div>
  );
}
```

- The deck has two modes: **present** (keyboard-paced) and **learn** (`?mode=learn`, everything revealed, drawer open) for readers of a shared link. Write narration for that reader, not as private speaker notes.
- Every slide and step is deep-linkable: `#/<index>` plus `/<step>` once step > 0.
- Interactive widgets inside a stage: mark non-native click targets with `data-interactive` so clicking them does not advance the deck (native buttons, links, and inputs are already exempt).
- Style with the engine's `--sf-*` tokens (`--sf-fs-hero`, `--sf-text-strong`, `--sf-accent-1`, ...); override tokens in `src/theme.css`. In `explain` content, the `sf-artifact` class renders a mono artifact block.

## Hard gate: the writing lint

```bash
pnpm lint:text
```

It scans `src/` and **fails on any em-dash or en-dash in deck text, comments included**. Rewrite around them. Soft warnings (semicolons, "…, and", unknown ALL-CAPS) are review hints.

## Write copy by the house rules

Read these before writing any slide text, in this order:

1. `docs/authoring/deck-standard.md` — the seven deck rules and the per-slide checklist.
2. `docs/authoring/writing-rules.md` — the hard text rules the lint enforces.
3. `docs/authoring/tone-of-voice.md` — how the copy should sound; slide copy vs narration split.

The short version: sparse slide copy (the slide is a pointer, not a document), one idea per step, narration carries the why and stands alone, evidence before conclusion, no filler or hype.

## Run it

```bash
pnpm dev      # develop; ? shows the keyboard map, E the drawer
pnpm build    # static build in dist/
```
