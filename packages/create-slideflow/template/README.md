# __DECK_TITLE__

A slide deck built on [slideflow](https://www.npmjs.com/package/slideflow).

## Replace the examples (start here)

The two slides in this project are placeholders. They render an orange
"Example slide: replace me" ribbon so they can never sneak into a real talk.
To replace them:

1. Write your own stage component in `src/stages/` (copy the shape of
   `ExampleReveal.tsx`: a component taking `{ ctx: StageContext }`).
2. Register it in `src/deck.tsx`: add a slide entry with an `id`, `title`,
   `steps` count, your `Stage`, and `narration` or `explain` content.
3. Delete `ExampleTitleCard.tsx` and `ExampleReveal.tsx` and their entries
   in `deck.tsx`.

Authoring rules live in `docs/authoring/`: `deck-standard.md` (the seven
rules and the per-slide checklist), `tone-of-voice.md`, `writing-rules.md`.

## Run

    pnpm install
    pnpm dev      # develop
    pnpm build    # static build in dist/
    pnpm lint:text  # writing-rules gate (hard-fails on em-dashes)

## Presenting

- Arrow right / Space / PageDown: next step, then next slide
- Arrow left / PageUp: previous
- Arrow down / up: skip a slide
- E: explain drawer. ?: keyboard help. Esc: close things, then leave.
- Add `?mode=learn` to the URL (or press Learn) for the read-along version.
- Every slide is deep-linkable: the URL hash tracks slide and step.
