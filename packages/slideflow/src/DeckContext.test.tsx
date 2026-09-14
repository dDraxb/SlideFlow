import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { DeckProvider, useDeck } from "./DeckContext";
import type { DeckModel } from "./types";

const S = () => null;
const deck: DeckModel = {
  id: "t",
  title: "Test deck",
  slides: [
    { id: "a", title: "A", steps: 2, Stage: S },
    { id: "b", title: "B", Stage: S },
    { id: "c", title: "C", steps: 1, Stage: S },
  ],
};

function Probe() {
  const d = useDeck();
  return (
    <div>
      <span data-testid="pos">{d.index}:{d.step}</span>
      <span data-testid="mode">{d.mode}</span>
      <button onClick={d.next}>next</button>
      <button onClick={d.prev}>prev</button>
      <button onClick={() => d.goTo(99, 99)}>far</button>
      <button onClick={() => d.setMode(d.mode === "learn" ? "present" : "learn")}>flip</button>
    </div>
  );
}

const setup = () => {
  render(<DeckProvider deck={deck}><Probe /></DeckProvider>);
  return userEvent.setup();
};

describe("DeckProvider", () => {
  test("next walks steps first, then slides", async () => {
    const user = setup();
    expect(screen.getByTestId("pos")).toHaveTextContent("0:0");
    await user.click(screen.getByText("next"));
    expect(screen.getByTestId("pos")).toHaveTextContent("0:1");
    await user.click(screen.getByText("next"));
    expect(screen.getByTestId("pos")).toHaveTextContent("0:2");
    await user.click(screen.getByText("next"));
    expect(screen.getByTestId("pos")).toHaveTextContent("1:0");
  });

  test("next at the last slide's last step is a no-op", async () => {
    window.history.replaceState(null, "", "/#/2/1");
    const user = setup();
    await user.click(screen.getByText("next"));
    expect(screen.getByTestId("pos")).toHaveTextContent("2:1");
  });

  test("prev from a slide start re-enters the previous slide fully revealed", async () => {
    window.history.replaceState(null, "", "/#/1");
    const user = setup();
    await user.click(screen.getByText("prev"));
    expect(screen.getByTestId("pos")).toHaveTextContent("0:2");
  });

  test("goTo clamps out-of-range targets", async () => {
    const user = setup();
    await user.click(screen.getByText("far"));
    expect(screen.getByTestId("pos")).toHaveTextContent("2:1");
  });

  test("navigation writes the hash URL", async () => {
    const user = setup();
    await user.click(screen.getByText("next"));
    expect(window.location.hash).toBe("#/0/1");
  });

  test("learn mode pins step to the slide's declared steps", () => {
    window.history.replaceState(null, "", "/?mode=learn#/0");
    setup();
    expect(screen.getByTestId("pos")).toHaveTextContent("0:2");
    expect(screen.getByTestId("mode")).toHaveTextContent("learn");
  });

  test("prev in learn mode goes straight to the previous slide", async () => {
    window.history.replaceState(null, "", "/?mode=learn#/1");
    const user = setup();
    await user.click(screen.getByText("prev"));
    expect(screen.getByTestId("pos")).toHaveTextContent("0:2");
  });

  test("an out-of-range hash is clamped, not crashed on", () => {
    window.history.replaceState(null, "", "/#/99/99");
    setup();
    expect(screen.getByTestId("pos")).toHaveTextContent("2:1");
  });

  test("an empty deck throws a clear error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <DeckProvider deck={{ id: "e", title: "Empty", slides: [] }}>
          <Probe />
        </DeckProvider>,
      ),
    ).toThrow(/deck has no slides/);
    spy.mockRestore();
  });

  test("popstate re-reads the URL", async () => {
    setup();
    window.history.replaceState(null, "", "/#/2");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(await screen.findByText("2:0")).toBeInTheDocument();
  });
});
