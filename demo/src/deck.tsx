import type { DeckModel } from "slideflow";
import { Drawer } from "./stages/Drawer";
import { Interactive } from "./stages/Interactive";
import { Reveals } from "./stages/Reveals";
import { Title } from "./stages/Title";
import { Tokens } from "./stages/Tokens";

export const deck: DeckModel = {
  id: "slideflow-demo",
  title: "SlideFlow demo",
  subtitle: "every engine feature on five slides",
  slides: [
    {
      id: "title",
      title: "Title",
      Stage: Title,
      narration: "A static slide. The cross fade into the next slide is the engine, not the deck.",
    },
    {
      id: "reveals",
      act: "Act 1: mechanics",
      title: "Progressive reveals",
      steps: 3,
      Stage: Reveals,
      narration: [
        "The slide opens with only the heading.",
        "Each press of the right arrow reveals one line.",
        "Hidden lines are aria-hidden and click transparent.",
        "Learn mode pins the step so readers see everything at once.",
      ],
      takeaway: "One idea per step keeps the audience with you.",
    },
    {
      id: "drawer",
      act: "Act 1: mechanics",
      title: "The explain drawer",
      Stage: Drawer,
      explain: (
        <>
          <p>
            This drawer holds the <b>public learning layer</b>: prose, small visuals, real
            artifacts. Press E to toggle it; navigation keeps working while it is open.
          </p>
          <div className="sf-artifact">{`explain?: ReactNode\nnarration?: string | string[]\ntakeaway?: ReactNode`}</div>
        </>
      ),
      takeaway: "Rich explain content wins over narration when both exist.",
    },
    {
      id: "tokens",
      act: "Act 2: skin",
      title: "Theme tokens",
      steps: 2,
      Stage: Tokens,
      narration: [
        "Everything you see is styled by sf tokens.",
        "Decks override tokens in one CSS file.",
        "The engine never ships a styling dependency.",
      ],
    },
    {
      id: "interactive",
      act: "Act 2: skin",
      title: "Interactive widgets",
      steps: 1,
      Stage: Interactive,
      narration: [
        "Clicking the stage advances the deck.",
        "Clicking a button inside a stage does not: interactive elements are exempt.",
      ],
      takeaway: "Mark custom widgets with data-interactive to opt out of click to advance.",
    },
  ],
};
