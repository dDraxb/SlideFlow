import { useEffect, useState, type MouseEvent } from "react";
import { cx } from "./cx";
import { DeckProvider, useDeck, useStageContext } from "./DeckContext";
import { inertWhen } from "./inert";
import { NavHelp } from "./NavHelp";
import type { DeckModel, Narration } from "./types";
import type { UrlAdapter } from "./url";

export interface DeckProps {
  deck: DeckModel;
  /** Called when Escape is pressed with nothing left to close. Absent: no-op. */
  onExit?: () => void;
  /** Override URL handling (e.g. to integrate a host router). Default: hash. */
  urlAdapter?: UrlAdapter;
}

export function Deck({ deck, onExit, urlAdapter }: DeckProps) {
  return (
    <DeckProvider deck={deck} urlAdapter={urlAdapter}>
      <DeckRoot onExit={onExit} />
    </DeckProvider>
  );
}

function DeckRoot({ onExit }: { onExit?: () => void }) {
  const { deck, mode, index, step, steps, total, explainOpen, next, prev, goTo, setMode, toggleExplain } =
    useDeck();
  const ctx = useStageContext();
  const slide = deck.slides[index];
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Never hijack typing inside a form field on an interactive slide.
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

      // The help overlay is modal and must swallow navigation, or a presenter
      // dismissing it with Space advances hidden reveals behind the scrim.
      // The explain DRAWER deliberately does not do this: advancing with your
      // notes open is the point of it.
      if (helpOpen) {
        if (e.key === "Escape" || e.key === "?") {
          e.preventDefault();
          setHelpOpen(false);
        }
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "ArrowDown":
          e.preventDefault();
          goTo(index + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          goTo(index - 1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(total - 1);
          break;
        case "e":
        case "E":
          toggleExplain();
          break;
        case "?":
          e.preventDefault();
          setHelpOpen(true);
          break;
        case "Escape":
          // Escape closes what is open before it leaves the deck; a presenter
          // who opened the drawer to check a note must not land on another
          // page mid-talk. (helpOpen is handled by the modal guard above.)
          e.preventDefault();
          if (explainOpen) toggleExplain();
          else onExit?.();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, index, total, toggleExplain, onExit, explainOpen, helpOpen]);

  if (!slide) return null;
  const Stage = slide.Stage;
  const progress = total > 1 ? (index / (total - 1)) * 100 : 0;

  // Click-to-advance, but never on interactive widgets inside a Stage.
  const onStageClick = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    if (el.closest('button, a, input, select, textarea, [role="switch"], [data-interactive]')) return;
    next();
  };

  return (
    <div className="sf-root">
      <div className="sf-progress">
        <i style={{ width: `${progress}%` }} />
      </div>

      {/* Click-to-advance surface. Keyboard navigation is bound at the window
          level, so the deck is fully operable without this element; it
          carries no role by design. */}
      <div className="sf-stage" onClick={onStageClick}>
        <div className="sf-stage-inner" key={slide.id}>
          <Stage ctx={ctx} />
        </div>
      </div>

      <div className="sf-chrome" onClick={(e) => e.stopPropagation()}>
        <span className="sf-act">
          {slide.act ?? deck.title}
          <span className="sf-act-title"> · {slide.title}</span>
        </span>
        {steps > 0 && (
          <span className="sf-step-dots" role="img" aria-label={`step ${step} of ${steps}`}>
            {Array.from({ length: steps + 1 }, (_, i) => (
              <i key={i} className={i <= step ? "sf-on" : ""} />
            ))}
          </span>
        )}
        <span className="sf-spacer" />
        <span className="sf-count">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          className="sf-btn"
          onClick={() => setMode(mode === "learn" ? "present" : "learn")}
          aria-pressed={mode === "learn"}
          title="Learn mode reveals every slide fully and opens the explanation"
        >
          {mode === "learn" ? "Present" : "Learn"}
        </button>
        <button
          type="button"
          className="sf-btn"
          onClick={toggleExplain}
          aria-pressed={explainOpen}
          title="Toggle this slide's explanation (E)"
        >
          {explainOpen ? "Hide explain" : "Explain"}
        </button>
        <button
          type="button"
          className="sf-btn"
          onClick={() => setHelpOpen(true)}
          title="Keyboard shortcuts (?)"
          aria-label="Keyboard shortcuts"
        >
          ?
        </button>
      </div>

      {/* Screen readers get no signal from the aria-hidden flips a step change
          causes; this is what makes the deck perceivable, not just operable. */}
      <div className="sf-sr-only" role="status" aria-live="polite">
        {`Slide ${index + 1} of ${total}: ${slide.title}${steps > 0 ? `, step ${step} of ${steps}` : ""}`}
      </div>

      <NavHelp open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* The drawer never leaves the DOM (CSS cannot defer unmount), so when
          closed it must be inert as well as aria-hidden. */}
      <aside
        className={cx("sf-explain", explainOpen && "sf-open")}
        aria-hidden={!explainOpen}
        {...inertWhen(!explainOpen)}
      >
        <div className="sf-explain-head">
          {slide.act && <span className="sf-explain-act">{slide.act}</span>}
          <button type="button" className="sf-btn sf-ghost" onClick={toggleExplain} title="Close (E)">
            ✕
          </button>
        </div>
        <h3 className="sf-explain-title">{slide.title}</h3>
        <div className="sf-explain-body" key={slide.id}>
          {slide.explain ?? <NarrationBlock narration={slide.narration ?? ""} />}
          {slide.takeaway && <div className="sf-takeaway">{slide.takeaway}</div>}
        </div>
      </aside>
    </div>
  );
}

function NarrationBlock({ narration }: { narration: Narration }) {
  if (Array.isArray(narration)) {
    return (
      <>
        {narration.map((block, i) => (
          <p key={i}>
            {narration.length > 1 && (
              <span className="sf-step-tag">{i === 0 ? "open" : `step ${i}`}</span>
            )}
            {block}
          </p>
        ))}
      </>
    );
  }
  return <p>{narration}</p>;
}
