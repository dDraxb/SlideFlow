import type { DeckModel } from "slideflow";
import { ExampleReveal } from "./stages/ExampleReveal";
import { ExampleTitleCard } from "./stages/ExampleTitleCard";

export const deck: DeckModel = {
  id: "__DECK_ID__",
  title: "__DECK_TITLE__",
  slides: [
    // ═══ EXAMPLE SLIDE: delete this entry and write your own ═══
    {
      id: "title",
      title: "Title",
      Stage: ExampleTitleCard,
      narration: "Open with why this talk matters, in one breath.",
    },
    // ═══ EXAMPLE SLIDE: delete this entry and write your own ═══
    {
      id: "example-reveal",
      act: "Act 1",
      title: "Progressive reveal",
      steps: 3,
      Stage: ExampleReveal,
      narration: [
        "The slide opens with only its heading.",
        "Each press of the right arrow reveals one item.",
        "Hidden items are invisible to screen readers too.",
        "Keep one idea per step.",
      ],
      takeaway: "One idea per step keeps the audience with you.",
    },
  ],
};
