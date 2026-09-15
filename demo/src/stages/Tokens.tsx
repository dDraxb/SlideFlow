import { Reveal, type StageContext } from "slideflow";

const swatches: Array<[string, string]> = [
  ["--sf-accent-1", "accent 1"],
  ["--sf-accent-2", "accent 2"],
  ["--sf-accent-3", "accent 3"],
  ["--sf-accent-cool", "cool"],
  ["--sf-accent-violet", "violet"],
];

export function Tokens({ ctx }: { ctx: StageContext }) {
  return (
    <div>
      <h2 style={{ fontSize: "var(--sf-fs-h1)", color: "var(--sf-text-strong)" }}>Tokens</h2>
      <Reveal ctx={ctx} at={1}>
        <div style={{ display: "flex", gap: "1rem" }}>
          {swatches.map(([token, name]) => (
            <div key={token} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "var(--sf-radius-sm)",
                  background: `var(${token})`,
                }}
              />
              <small style={{ color: "var(--sf-text-faint)" }}>{name}</small>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal ctx={ctx} at={2}>
        <p style={{ fontSize: "var(--sf-fs-body)", color: "var(--sf-text-dim)" }}>
          Override any of these in one deck-local CSS file.
        </p>
      </Reveal>
    </div>
  );
}
