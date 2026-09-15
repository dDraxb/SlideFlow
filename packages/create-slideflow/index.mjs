#!/usr/bin/env node
import { basename, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { scaffold } from "./lib.mjs";

const kebab = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "my-deck";
const humanize = (s) =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const argDir = process.argv[2];
const rl = createInterface({ input: process.stdin, output: process.stdout });

const targetDir = resolve(argDir ?? (await rl.question("Directory for the new deck: ")));
const defaultTitle = humanize(basename(targetDir));
const title = (await rl.question(`Deck title (${defaultTitle}): `)).trim() || defaultTitle;
const defaultId = kebab(title);
const id = (await rl.question(`Deck id (${defaultId}): `)).trim() || defaultId;
rl.close();

try {
  scaffold(targetDir, { title, id });
} catch (err) {
  console.error(String(err.message ?? err));
  process.exit(1);
}

console.log(`
Deck scaffolded in ${targetDir}

Next steps:
  cd ${targetDir}
  pnpm install
  pnpm dev

Then open README.md and replace the example slides.`);
