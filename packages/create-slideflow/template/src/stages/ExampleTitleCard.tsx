// ═══ EXAMPLE SLIDE: delete this file, write your own ═══
// See README.md ("Replace the examples") and docs/authoring/deck-standard.md.
import type { StageContext } from "slideflow";

function ExampleRibbon() {
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        padding: "0.3rem 0.7rem",
        border: "1px solid var(--sf-accent-2)",
        borderRadius: 8,
        color: "var(--sf-accent-2)",
        fontSize: "0.7rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        zIndex: 10,
      }}
    >
      Example slide: replace me
    </div>
  );
}

export function ExampleTitleCard(_props: { ctx: StageContext }) {
  return (
    <div style={{ textAlign: "center" }}>
      <ExampleRibbon />
      <h1 style={{ fontSize: "var(--sf-fs-hero)", margin: 0, color: "var(--sf-text-strong)" }}>
        __DECK_TITLE__
      </h1>
      <p style={{ fontSize: "var(--sf-fs-body)", color: "var(--sf-text-dim)" }}>
        Press ? for the keyboard map. Press E for this slide's notes.
      </p>
    </div>
  );
}
