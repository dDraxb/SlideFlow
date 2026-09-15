import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { scaffold } from "./lib.mjs";

let dir;
afterEach(() => { if (dir) rmSync(dir, { recursive: true, force: true }); });

const freshTarget = () => {
  dir = mkdtempSync(join(tmpdir(), "sf-scaffold-"));
  return join(dir, "my-talk");
};

describe("scaffold", () => {
  test("creates a complete deck app with tokens replaced", () => {
    const target = freshTarget();
    scaffold(target, { title: "My Great Talk", id: "my-great-talk" });

    const pkg = JSON.parse(readFileSync(join(target, "package.json"), "utf8"));
    expect(pkg.name).toBe("my-great-talk");
    expect(pkg.dependencies.slideflow).toBeDefined();

    const deck = readFileSync(join(target, "src/deck.tsx"), "utf8");
    expect(deck).toContain('title: "My Great Talk"');
    expect(deck).toContain('id: "my-great-talk"');
    expect(deck).not.toContain("__DECK_TITLE__");

    expect(existsSync(join(target, ".gitignore"))).toBe(true);
    expect(existsSync(join(target, "docs/authoring/deck-standard.md"))).toBe(true);
    expect(existsSync(join(target, "scripts/check-text.mjs"))).toBe(true);
    expect(existsSync(join(target, "src/stages/ExampleTitleCard.tsx"))).toBe(true);
    expect(existsSync(join(target, "README.md"))).toBe(true);
  });

  test("refuses a non-empty target directory", () => {
    const target = freshTarget();
    mkdirSync(target, { recursive: true });
    writeFileSync(join(target, "stuff.txt"), "occupied");
    expect(() => scaffold(target, { title: "T", id: "t" })).toThrow(/not empty/);
  });

  test("example slides carry the placeholder banner", () => {
    const target = freshTarget();
    scaffold(target, { title: "T", id: "t" });
    const stage = readFileSync(join(target, "src/stages/ExampleTitleCard.tsx"), "utf8");
    expect(stage).toContain("EXAMPLE SLIDE: delete this file");
    expect(stage).toContain("Example slide: replace me");
  });
});
