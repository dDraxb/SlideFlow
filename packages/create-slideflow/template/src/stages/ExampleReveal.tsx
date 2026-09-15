// ═══ EXAMPLE SLIDE: delete this file, write your own ═══
// See README.md ("Replace the examples") and docs/authoring/deck-standard.md.
import { Reveal, type StageContext } from "slideflow";

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

const items = [
  "Wrap anything in a Reveal with an `at` step.",
  "The step dots in the chrome track your position.",
  "The drawer (press E) explains each step.",
];

export function ExampleReveal({ ctx }: { ctx: StageContext }) {
  return (
    <div>
      <ExampleRibbon />
      <h2 style={{ fontSize: "var(--sf-fs-h1)", color: "var(--sf-text-strong)" }}>
        Progressive reveal
      </h2>
      {items.map((item, i) => (
        <Reveal key={item} ctx={ctx} at={i + 1}>
          <p style={{ fontSize: "var(--sf-fs-body)" }}>{item}</p>
        </Reveal>
      ))}
    </div>
  );
}
