import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DeckModel, Mode, StageContext } from "./types";
import { createHashAdapter, type UrlAdapter, type UrlState } from "./url";

interface DeckState {
  deck: DeckModel;
  mode: Mode;
  index: number;
  step: number;
  steps: number;
  total: number;
  explainOpen: boolean;
  toggleExplain: () => void;
  setMode: (m: Mode) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number, step?: number) => void;
}

const Ctx = createContext<DeckState | null>(null);

export function useDeck(): DeckState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDeck must be used inside <DeckProvider>");
  return v;
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function DeckProvider({
  deck,
  urlAdapter,
  children,
}: {
  deck: DeckModel;
  urlAdapter?: UrlAdapter;
  children: ReactNode;
}) {
  if (deck.slides.length === 0) {
    throw new Error("slideflow: deck has no slides");
  }
  const adapter = useMemo(() => urlAdapter ?? createHashAdapter(), [urlAdapter]);
  const total = deck.slides.length;
  const [url, setUrl] = useState<UrlState>(() => adapter.read());

  const index = clamp(url.index, 0, total - 1);
  const declaredSteps = deck.slides[index]?.steps ?? 0;
  const rawStep = clamp(url.step, 0, declaredSteps);
  const mode = url.mode;
  // Learn mode pins the step so the slide is always fully revealed.
  const step = mode === "learn" ? declaredSteps : rawStep;

  const [explainOpen, setExplainOpen] = useState(mode === "learn");

  const commit = useCallback(
    (s: UrlState) => {
      adapter.write(s);
      setUrl(s);
    },
    [adapter],
  );

  const goTo = useCallback(
    (i: number, s = 0) => {
      const ni = clamp(i, 0, total - 1);
      const ns = clamp(s, 0, deck.slides[ni]?.steps ?? 0);
      commit({ index: ni, step: ns, mode });
    },
    [commit, deck.slides, mode, total],
  );

  const next = useCallback(() => {
    if (step < declaredSteps) goTo(index, step + 1);
    else if (index < total - 1) goTo(index + 1, 0);
  }, [declaredSteps, goTo, index, step, total]);

  const prev = useCallback(() => {
    // In learn mode `step` is pinned, so decrementing it would be undone on
    // the next render; learn mode goes straight to the previous slide.
    if (mode === "present" && step > 0) goTo(index, step - 1);
    // Entering a previous slide from the right reveals it fully.
    else if (index > 0) goTo(index - 1, deck.slides[index - 1]?.steps ?? 0);
  }, [deck.slides, goTo, index, mode, step]);

  const setMode = useCallback(
    (m: Mode) => {
      commit({ index, step: rawStep, mode: m });
      setExplainOpen(m === "learn");
    },
    [commit, index, rawStep],
  );

  const toggleExplain = useCallback(() => setExplainOpen((o) => !o), []);

  // External URL changes: back/forward, hand-edited hash.
  useEffect(() => adapter.subscribe?.(() => setUrl(adapter.read())), [adapter]);

  const value = useMemo<DeckState>(
    () => ({
      deck,
      mode,
      index,
      step,
      steps: declaredSteps,
      total,
      explainOpen,
      toggleExplain,
      setMode,
      next,
      prev,
      goTo,
    }),
    [deck, mode, index, step, declaredSteps, total, explainOpen, toggleExplain, setMode, next, prev, goTo],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * The Stage's view of state. `mode` comes from the URL, NOT from whether the
 * explain drawer happens to be open, so a stage never reflows when the
 * presenter presses E mid-talk.
 */
export function useStageContext(): StageContext {
  const { mode, step, steps } = useDeck();
  return { mode, step, steps, isPresent: mode === "present", isLearn: mode === "learn" };
}
