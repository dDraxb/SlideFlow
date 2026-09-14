import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

afterEach(cleanup);

// Each test starts from a clean URL; the engine reads location on mount.
beforeEach(() => {
  window.history.replaceState(null, "", "/");
});
