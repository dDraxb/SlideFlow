import { useState } from "react";
import { Reveal, type StageContext } from "slideflow";

export function Interactive({ ctx }: { ctx: StageContext }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h2 style={{ fontSize: "var(--sf-fs-h1)", color: "var(--sf-text-strong)" }}>Widgets</h2>
      <span
        role="button"
        tabIndex={0}
        data-interactive
        onClick={() => setCount((c) => c + 1)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            setCount((c) => c + 1);
          }
        }}
        style={{
          display: "inline-block",
          fontSize: "var(--sf-fs-body)",
          padding: "0.5rem 1.2rem",
          borderRadius: "var(--sf-radius-sm)",
          border: "1px solid var(--sf-border-strong)",
          background: "var(--sf-bg-raise-2)",
          color: "var(--sf-text-bright)",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        Clicked {count} times, deck did not advance
      </span>
      <Reveal ctx={ctx} at={1}>
        <p style={{ fontSize: "var(--sf-fs-body)", color: "var(--sf-text-dim)" }}>
          Clicking anywhere else on the stage advances as usual.
        </p>
      </Reveal>
    </div>
  );
}
