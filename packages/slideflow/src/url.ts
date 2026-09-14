import type { Mode } from "./types";

export interface UrlState {
  index: number;
  step: number;
  mode: Mode;
}

/**
 * How the deck talks to the address bar. The default is hash-based and
 * dependency-free; a host app with a router can pass its own adapter to
 * <Deck urlAdapter={...}> instead.
 */
export interface UrlAdapter {
  read(): UrlState;
  write(state: UrlState): void;
  /** Optional: notify on external URL changes; returns unsubscribe. */
  subscribe?(onChange: () => void): () => void;
}

/** URL contract: ?mode=learn + hash #/<index>/<step>. */
export function createHashAdapter(): UrlAdapter {
  return {
    read() {
      const params = new URLSearchParams(window.location.search);
      const mode: Mode = params.get("mode") === "learn" ? "learn" : "present";
      const m = window.location.hash.match(/^#\/(\d+)(?:\/(\d+))?/);
      const index = m ? Number.parseInt(m[1], 10) : 0;
      const step = m?.[2] ? Number.parseInt(m[2], 10) : 0;
      return {
        index: Number.isNaN(index) ? 0 : index,
        step: Number.isNaN(step) ? 0 : step,
        mode,
      };
    },
    write({ index, step, mode }) {
      const params = new URLSearchParams(window.location.search);
      if (mode === "learn") params.set("mode", "learn");
      else params.delete("mode");
      const qs = params.toString();
      const hash = `#/${index}${step > 0 ? `/${step}` : ""}`;
      // replace, not push: one history entry, so Back leaves the deck.
      window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${hash}`);
    },
    subscribe(onChange) {
      window.addEventListener("popstate", onChange);
      window.addEventListener("hashchange", onChange);
      return () => {
        window.removeEventListener("popstate", onChange);
        window.removeEventListener("hashchange", onChange);
      };
    },
  };
}
