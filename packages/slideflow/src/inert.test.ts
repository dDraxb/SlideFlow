import { expect, test } from "vitest";
import { inertWhen } from "./inert";

test("returns the React 18 contract: a truthy-string inert attribute when inert, no attributes otherwise", () => {
  expect(inertWhen(true)).toEqual({ inert: "" });
  expect(inertWhen(false)).toEqual({});
});
