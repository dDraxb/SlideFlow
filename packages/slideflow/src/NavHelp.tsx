import { useEffect, useRef } from "react";
import { cx } from "./cx";
import { inertWhen } from "./inert";

/**
 * The keyboard contract, discoverable from the UI. Starts closed, opened on
 * demand (? or the chrome button); no first-run state to store. It matters:
 * the click-to-advance surface is deliberately roleless, which leans on the
 * deck being fully operable from the keyboard.
 */
const KEYS: { keys: string; does: string }[] = [
  { keys: "→  Space  PageDown", does: "Next step, then next slide" },
  { keys: "←  PageUp", does: "Previous step, then previous slide" },
  { keys: "↓  ↑", does: "Skip a whole slide" },
  { keys: "Home  End", does: "First / last slide" },
  { keys: "E", does: "Toggle this slide's explanation" },
  { keys: "?", does: "This help" },
  { keys: "Esc", does: "Close help, then the drawer, then leave the deck" },
  { keys: "F11", does: "Fullscreen (browser-native)" },
];

export function NavHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  // Move focus into the dialog on open and put it back on close. `inert` on
  // the closed overlay keeps it out of the tab order the rest of the time.
  useEffect(() => {
    if (open) {
      returnFocusTo.current = document.activeElement as HTMLElement | null;
      dialogRef.current?.focus();
    } else {
      returnFocusTo.current?.focus();
      returnFocusTo.current = null;
    }
  }, [open]);

  return (
    <div
      className={cx("sf-help-backdrop", open && "sf-open")}
      aria-hidden={!open}
      {...inertWhen(!open)}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabIndex={-1}
        className="sf-help"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sf-help-head">
          <h2 className="sf-help-title">Keyboard</h2>
          <button type="button" className="sf-btn" onClick={onClose}>Close</button>
        </div>
        <dl className="sf-help-keys">
          {KEYS.map((k) => (
            <div key={k.keys} className="sf-help-row">
              <dt>{k.keys}</dt>
              <dd>{k.does}</dd>
            </div>
          ))}
        </dl>
        <p className="sf-help-note">
          Clicking the slide also advances. Add <code>?mode=learn</code>, or press Learn,
          to reveal every slide fully for reading.
        </p>
      </div>
    </div>
  );
}
