# Deck standard

The bar every slide must clear. Distilled from building the deck. Read this
before authoring or polishing any slide. Sits alongside `tone-of-voice.md` and `writing-rules.md`.

## The seven rules

1. **AI-first, metaphor-second.** Name the real AI thing and show a concrete artifact (a real
   prompt, a retrieved file, the actual part names) BEFORE any metaphor. Never open a concept in
   metaphor language. The metaphor is the memory aid, not the lesson.

2. **On-screen = statements. Explain = narrative.** What's projected is short statements and
   visuals; the presenter speaks the glue. The full prose lives in the explain panel, written as
   the story told TO the reader (never as notes to the presenter). Every slide has explain content
   — it is the standalone, no-presenter version of the talk.

3. **Every slide has a focal animation (the brain bar).** A living centrepiece, not static text:
   a pulse, a reveal, a build-up, a morph. Make the premise literal (a curtain parts, a brain
   pulses, a box opens). If a slide is just text appearing, it is below bar.

4. **One thing at a time.** Reveal or replace; do not pile up. A wall of materialised lines is a
   failure even if each line animated in. Pace one idea per beat.

5. **The twin is prominent and uniform.** The AI↔metaphor↔work mapping (`the real thing = the
   metaphor = your work`) is a strong, equal-celled, fixed-width element. It looks identical on
   every slide. It must never read as background.

6. **Strict consistency.** Shared components (twin, content cards, kickers, statements, reveals)
   render the same everywhere. Same sizes, same spacing, same colours by role
   (agent/intent/judge). No bespoke one-off styling per slide.

7. **Earn the throughline.** Keep the refrain ("which part is responsible?") and the
   bookend alive; relate ideas back to the audience's own work where natural.

## Mechanics (always)

- Writing rules apply to all text: no dashes, no emphasis quotes, no colons/semicolons in prose,
  no comma before "and", no caps for emphasis, plain and human. Gate: `pnpm lint:text`.
- Interactive widgets carry `data-interactive`; inputs never trigger slide nav (engine handles it).
- After any change: `pnpm typecheck`, `pnpm build`, `pnpm lint:text`, and a headless browser pass
  (console must be clean) before committing.

## Per-slide checklist

- [ ] Opens with the real AI thing + a concrete artifact, then the metaphor.
- [ ] On-screen is statements, not sentences.
- [ ] Has a focal animation at the brain bar.
- [ ] Reveals one idea at a time, no pile-up.
- [ ] Twin (if present) is the prominent, uniform triptych.
- [ ] Explain panel carries the full narrative, told to the reader.
- [ ] Shared components match every other slide.
- [ ] Passes lint:text + typecheck + build + clean console.
