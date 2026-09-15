import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Deck } from "./Deck";
import type { DeckModel, StageContext } from "./types";

function StageA({ ctx }: { ctx: StageContext }) {
  return (
    <div>
      <p>stage-a step {ctx.step}</p>
      <button type="button" data-interactive>widget</button>
    </div>
  );
}
const StageB = () => <p>stage-b</p>;

const deck: DeckModel = {
  id: "t",
  title: "Test deck",
  slides: [
    { id: "a", act: "Act 1", title: "Alpha", steps: 2, Stage: StageA, narration: "Alpha notes." },
    { id: "b", title: "Beta", Stage: StageB, narration: ["Open.", "More."], takeaway: "Beta take." },
  ],
};

const key = (k: string) => fireEvent.keyDown(window, { key: k });

describe("Deck", () => {
  test("arrow right advances a step; arrow left goes back", () => {
    render(<Deck deck={deck} />);
    expect(screen.getByText("stage-a step 0")).toBeInTheDocument();
    key("ArrowRight");
    expect(screen.getByText("stage-a step 1")).toBeInTheDocument();
    key("ArrowLeft");
    expect(screen.getByText("stage-a step 0")).toBeInTheDocument();
  });

  test("arrow down skips the whole slide", () => {
    render(<Deck deck={deck} />);
    key("ArrowDown");
    expect(screen.getByText("stage-b")).toBeInTheDocument();
  });

  test("clicking the stage advances, clicking an interactive element does not", () => {
    const { container } = render(<Deck deck={deck} />);
    fireEvent.click(screen.getByText("widget"));
    expect(screen.getByText("stage-a step 0")).toBeInTheDocument();
    fireEvent.click(container.querySelector(".sf-stage")!);
    expect(screen.getByText("stage-a step 1")).toBeInTheDocument();
  });

  test("E toggles the explain drawer without advancing", () => {
    const { container } = render(<Deck deck={deck} />);
    const drawer = container.querySelector(".sf-explain")!;
    expect(drawer).toHaveAttribute("aria-hidden", "true");
    key("E");
    expect(drawer).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByText("stage-a step 0")).toBeInTheDocument();
  });

  test("open help swallows navigation keys", () => {
    render(<Deck deck={deck} />);
    key("?");
    key(" ");
    key("ArrowRight");
    expect(screen.getByText("stage-a step 0")).toBeInTheDocument();
    key("Escape"); // closes help only
    key("ArrowRight");
    expect(screen.getByText("stage-a step 1")).toBeInTheDocument();
  });

  test("Escape closes help, then the drawer, then calls onExit", () => {
    const onExit = vi.fn();
    const { container } = render(<Deck deck={deck} onExit={onExit} />);
    key("?");
    key("E"); // swallowed by the modal guard while help is open
    key("Escape"); // close help
    key("E"); // open drawer
    expect(container.querySelector(".sf-explain")).toHaveAttribute("aria-hidden", "false");
    key("Escape"); // close drawer
    expect(container.querySelector(".sf-explain")).toHaveAttribute("aria-hidden", "true");
    expect(onExit).not.toHaveBeenCalled();
    key("Escape"); // nothing left: exit
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  test("Escape with no onExit is a safe no-op", () => {
    render(<Deck deck={deck} />);
    key("Escape");
    expect(screen.getByText("stage-a step 0")).toBeInTheDocument();
  });

  test("announces slide and step to screen readers", () => {
    render(<Deck deck={deck} />);
    expect(screen.getByRole("status")).toHaveTextContent("Slide 1 of 2: Alpha, step 0 of 2");
  });

  test("drawer renders narration array with step tags and the takeaway", () => {
    render(<Deck deck={deck} />);
    key("ArrowDown");
    key("E");
    expect(screen.getByText("Open.")).toBeInTheDocument();
    expect(screen.getByText("More.")).toBeInTheDocument();
    expect(screen.getByText("Beta take.")).toBeInTheDocument();
  });

  test("Learn button flips mode and pins reveals", () => {
    render(<Deck deck={deck} />);
    fireEvent.click(screen.getByRole("button", { name: "Learn" }));
    expect(screen.getByText("stage-a step 2")).toBeInTheDocument();
    expect(window.location.search).toBe("?mode=learn");
  });
});
