import { describe, expect, test } from "vitest";
import { createHashAdapter } from "./url";

describe("createHashAdapter", () => {
  test("round-trips index, step and mode", () => {
    const a = createHashAdapter();
    a.write({ index: 3, step: 2, mode: "learn" });
    expect(window.location.hash).toBe("#/3/2");
    expect(window.location.search).toBe("?mode=learn");
    expect(a.read()).toEqual({ index: 3, step: 2, mode: "learn" });
  });

  test("omits step 0 and present mode from the URL", () => {
    const a = createHashAdapter();
    a.write({ index: 1, step: 0, mode: "present" });
    expect(window.location.hash).toBe("#/1");
    expect(window.location.search).toBe("");
  });

  test("preserves unrelated query params", () => {
    window.history.replaceState(null, "", "/?foo=bar");
    const a = createHashAdapter();
    a.write({ index: 2, step: 1, mode: "learn" });
    const params = new URLSearchParams(window.location.search);
    expect(params.get("foo")).toBe("bar");
    expect(params.get("mode")).toBe("learn");
  });

  test("reads a garbage hash as slide 0, step 0, present", () => {
    window.history.replaceState(null, "", "/#/banana/soup");
    expect(createHashAdapter().read()).toEqual({ index: 0, step: 0, mode: "present" });
  });

  test("reads a missing hash as slide 0, step 0", () => {
    expect(createHashAdapter().read()).toEqual({ index: 0, step: 0, mode: "present" });
  });

  test("notifies on popstate and hashchange, unsubscribes cleanly", () => {
    const a = createHashAdapter();
    let calls = 0;
    const unsubscribe = a.subscribe!(() => { calls++; });
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.dispatchEvent(new Event("hashchange"));
    expect(calls).toBe(2);
    unsubscribe();
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(calls).toBe(2);
  });
});
