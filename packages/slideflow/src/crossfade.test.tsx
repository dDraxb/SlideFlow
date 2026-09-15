import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Deck } from "./Deck";
import type { DeckModel } from "./types";

const A = () => <p>stage-a</p>;
const B = () => <p>stage-b</p>;
const deck: DeckModel = {
  id: "t",
  title: "T",
  slides: [
    { id: "a", title: "A", Stage: A },
    { id: "b", title: "B", Stage: B },
  ],
};

describe("cross-fade", () => {
  test("keeps the outgoing stage mounted until its exit animation ends", () => {
    const { container } = render(<Deck deck={deck} />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("stage-b")).toBeInTheDocument();
    const exit = container.querySelector(".sf-stage-exit")!;
    expect(exit).toHaveTextContent("stage-a");
    expect(exit).toHaveAttribute("aria-hidden", "true");
    fireEvent.animationEnd(exit);
    expect(container.querySelector(".sf-stage-exit")).toBeNull();
    expect(screen.getByText("stage-b")).toBeInTheDocument();
  });

  test("falls back to a timeout when no animation runs (reduced motion)", () => {
    vi.useFakeTimers();
    const { container } = render(<Deck deck={deck} />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(container.querySelector(".sf-stage-exit")).not.toBeNull();
    // React 18's concurrent root flushes this setState via a MessageChannel
    // macrotask the fake-timer clock doesn't drive; act() forces the flush.
    // See task-9-report.md "Deviation from brief" for the negative-control
    // evidence that this does not mask a missing implementation.
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(container.querySelector(".sf-stage-exit")).toBeNull();
    vi.useRealTimers();
  });

  test("ignores a bubbled animationend from a descendant of the exit layer", () => {
    const { container } = render(<Deck deck={deck} />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    const exit = container.querySelector(".sf-stage-exit")!;
    const child = exit.querySelector("p")!;
    fireEvent.animationEnd(child);
    expect(container.querySelector(".sf-stage-exit")).not.toBeNull();
    fireEvent.animationEnd(exit);
    expect(container.querySelector(".sf-stage-exit")).toBeNull();
  });

  test("a step change within a slide does not trigger an exit layer", () => {
    const deck2: DeckModel = {
      id: "t2",
      title: "T2",
      slides: [{ id: "a", title: "A", steps: 2, Stage: A }],
    };
    const { container } = render(<Deck deck={deck2} />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(container.querySelector(".sf-stage-exit")).toBeNull();
  });
});
