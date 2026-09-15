import type { StageContext } from "slideflow";

export function Title(_props: { ctx: StageContext }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: "var(--sf-fs-hero)", margin: 0, color: "var(--sf-text-strong)" }}>
        SlideFlow
      </h1>
      <p style={{ fontSize: "var(--sf-fs-body)", color: "var(--sf-text-dim)" }}>
        Press ? for the keyboard map. Press E for this slide's notes.
      </p>
    </div>
  );
}
