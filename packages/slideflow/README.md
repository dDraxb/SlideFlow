# slideflow

A presentation engine for React: progressive reveals, present and learn modes, an explain drawer, URL-addressable slides. Self-contained styling — no Tailwind or other styling dependency — and router-agnostic by default. Peer deps: `react` and `react-dom`, `^18.2.0` or `^19.0.0`.

## Install

```bash
pnpm add slideflow
```

## Imports

```tsx
import { Deck, Reveal, useDeck } from "slideflow";
import type { DeckModel, Slide, StageContext } from "slideflow";
import "slideflow/styles.css";
import "slideflow/theme.css"; // optional — or define your own --sf-* tokens
```

`styles.css` is the chrome, reveal, and cross-fade animations and is required. `theme.css` is only the default dark token palette; skip it and supply your own tokens if you want a different look.

## The deck model

```ts
Slide        { id, act?, title, steps?, Stage, explain?, narration?, takeaway? }
DeckModel    { id, title, subtitle?, slides: Slide[] }
Mode         = "present" | "learn"
StageContext { mode, step, steps, isPresent, isLearn }
```

`Stage` renders the same visual in both modes; `ctx.step` drives what a `Reveal` shows. `steps` on a slide is how many progressive reveals it declares (0 or omitted = static). `narration` is the written voice-over shown in the explain drawer — a string for one block, or a string array for one block per step; if a slide sets both `explain` and `narration`, `explain` wins.

A minimal complete deck — one title slide, one two-step reveal:

```tsx
import { Deck, Reveal, type DeckModel, type StageContext } from "slideflow";
import "slideflow/styles.css";
import "slideflow/theme.css";

function Title() {
  return <h1>My Talk</h1>;
}

function Points({ ctx }: { ctx: StageContext }) {
  return (
    <>
      <Reveal ctx={ctx} at={1}>First point</Reveal>
      <Reveal ctx={ctx} at={2}>Second point</Reveal>
    </>
  );
}

const deck: DeckModel = {
  id: "my-talk",
  title: "My Talk",
  slides: [
    { id: "title", title: "Title", Stage: Title },
    { id: "points", title: "Points", steps: 2, Stage: Points },
  ],
};

export default function App() {
  return <Deck deck={deck} />;
}
```

## Keyboard

| Keys | Does |
|---|---|
| `→` `Space` `PageDown` | Next step, then next slide |
| `←` `PageUp` | Previous step, then previous slide |
| `↓` `↑` | Skip a whole slide |
| `Home` `End` | First / last slide |
| `E` | Toggle this slide's explanation |
| `?` | Keyboard help |
| `Esc` | Close help, then the drawer, then leave the deck |
| `F11` | Fullscreen (browser-native) |

Clicking the slide also advances, except on interactive elements (`button`, `a`, `input`, `select`, `textarea`, `[role="switch"]`, `[data-interactive]`).

## Present vs. learn mode

Present mode reveals a slide's steps one at a time as the presenter navigates — the normal talk flow. Learn mode pins every slide fully revealed and opens the explain drawer automatically, for someone reading the deck on their own rather than watching it presented. Toggle with the chrome's Learn/Present button, or by adding `?mode=learn` to the URL.

## URL contract

By default the deck syncs itself to the URL with zero configuration: hash `#/<index>`, with `/<step>` appended only once step > 0 (step 0 is omitted; both forms parse), plus `?mode=learn` when in learn mode. Writes use `history.replaceState`, so one deck session is one history entry and Back leaves the deck rather than stepping back through slides. An out-of-range or garbage index/step clamps to the nearest valid slide/step.

## Theming

All visual tokens are CSS custom properties prefixed `--sf-*` — surface and text colors, accents, fonts, radii, and a fluid type scale (`--sf-fs-hero`, `--sf-fs-h1`, …). `theme.css` defines the default dark palette; override individual tokens in your own stylesheet, or skip `theme.css` entirely and define the full set yourself. The engine never forces dark mode or otherwise imposes a theming context — that's entirely up to the host.

## Escape hatches: `urlAdapter` and `onExit`

For a host app that already owns the address bar (a router-driven site embedding a deck), pass a `urlAdapter` to replace the built-in hash sync:

```tsx
interface UrlAdapter {
  read(): { index: number; step: number; mode: "present" | "learn" };
  write(state: { index: number; step: number; mode: "present" | "learn" }): void;
  subscribe?(onChange: () => void): () => void; // external changes, e.g. back/forward
}

<Deck deck={deck} urlAdapter={myRouterAdapter} />
```

`onExit?: () => void` is called when Escape is pressed with nothing left to close (help and the drawer are already shut). Leave it out and that final Escape is a no-op; pass it to route away, e.g. `onExit={() => navigate("/presentation")}`.

## License

MIT
