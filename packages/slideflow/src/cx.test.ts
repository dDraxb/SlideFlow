import { expect, test } from "vitest";
import { cx } from "./cx";

test("joins truthy class parts with spaces", () => {
  expect(cx("a", false, "b", undefined, null, "c")).toBe("a b c");
});

test("returns empty string for no truthy parts", () => {
  expect(cx(false, undefined)).toBe("");
});
