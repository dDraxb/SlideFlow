import type { StageContext } from "slideflow";

export function Drawer(_props: { ctx: StageContext }) {
  return (
    <div>
      <h2 style={{ fontSize: "var(--sf-fs-h1)", color: "var(--sf-text-strong)" }}>Press E</h2>
      <p style={{ fontSize: "var(--sf-fs-body)", color: "var(--sf-text-dim)" }}>
        The drawer on the right carries this slide's full explanation.
      </p>
    </div>
  );
}
