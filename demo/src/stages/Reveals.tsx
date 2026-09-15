import { Reveal, type StageContext } from "slideflow";

const lines = [
  "Reveals are plain CSS transitions.",
  "They respect prefers-reduced-motion.",
  "They never re-run when the drawer opens.",
];

export function Reveals({ ctx }: { ctx: StageContext }) {
  return (
    <div>
      <h2 style={{ fontSize: "var(--sf-fs-h1)", color: "var(--sf-text-strong)" }}>Reveals</h2>
      {lines.map((line, i) => (
        <Reveal key={line} ctx={ctx} at={i + 1}>
          <p style={{ fontSize: "var(--sf-fs-body)" }}>{line}</p>
        </Reveal>
      ))}
    </div>
  );
}
