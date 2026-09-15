import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { NavHelp } from "./NavHelp";

describe("NavHelp", () => {
  test("closed: hidden and inert", () => {
    const { container } = render(<NavHelp open={false} onClose={() => {}} />);
    const backdrop = container.firstElementChild!;
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
    expect(backdrop).toHaveAttribute("inert");
  });

  test("open: dialog receives focus", () => {
    render(<NavHelp open={true} onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  test("closing restores focus to the previously focused element", () => {
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    outside.focus();
    const { rerender } = render(<NavHelp open={false} onClose={() => {}} />);
    rerender(<NavHelp open={true} onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toHaveFocus();
    rerender(<NavHelp open={false} onClose={() => {}} />);
    expect(outside).toHaveFocus();
    outside.remove();
  });

  test("lists the Escape sequencing contract", () => {
    render(<NavHelp open={true} onClose={() => {}} />);
    expect(screen.getByText(/Close help, then the drawer/)).toBeInTheDocument();
  });
});
