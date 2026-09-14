import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Reveal } from "./Reveal";
import type { StageContext } from "./types";

const ctxAt = (step: number): StageContext => ({
  mode: "present", step, steps: 3, isPresent: true, isLearn: false,
});

describe("Reveal", () => {
  test("is hidden before its step", () => {
    render(<Reveal ctx={ctxAt(0)} at={2}>hi</Reveal>);
    const el = screen.getByText("hi");
    expect(el).toHaveClass("sf-reveal");
    expect(el).not.toHaveClass("sf-reveal-shown");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  test("is shown at and after its step", () => {
    render(<Reveal ctx={ctxAt(2)} at={2}>hi</Reveal>);
    const el = screen.getByText("hi");
    expect(el).toHaveClass("sf-reveal-shown");
    expect(el).toHaveAttribute("aria-hidden", "false");
  });

  test("merges a caller className", () => {
    render(<Reveal ctx={ctxAt(3)} at={1} className="mine">hi</Reveal>);
    expect(screen.getByText("hi")).toHaveClass("sf-reveal", "sf-reveal-shown", "mine");
  });
});
