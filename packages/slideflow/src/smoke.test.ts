import { expect, test } from "vitest";

test("harness boots under jsdom", () => {
  expect(window.location.pathname).toBe("/");
});
