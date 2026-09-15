import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TEMPLATE = join(dirname(fileURLToPath(import.meta.url)), "template");
const TEXT_EXTENSIONS = /\.(tsx?|mjs|json|html|css|md)$/;

/**
 * Copy the template into targetDir, replacing __DECK_TITLE__ and __DECK_ID__
 * in text files. Throws if targetDir exists and is not empty.
 */
export function scaffold(targetDir, { title, id }) {
  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    throw new Error(`target directory is not empty: ${targetDir}`);
  }
  mkdirSync(targetDir, { recursive: true });
  cpSync(TEMPLATE, targetDir, { recursive: true });

  // npm strips .gitignore from published packages; the template stores it
  // as "gitignore" and we restore the dot here.
  const plainIgnore = join(targetDir, "gitignore");
  if (existsSync(plainIgnore)) renameSync(plainIgnore, join(targetDir, ".gitignore"));

  replaceTokens(targetDir, { __DECK_TITLE__: title, __DECK_ID__: id });
}

function replaceTokens(dir, tokens) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      replaceTokens(p, tokens);
    } else if (TEXT_EXTENSIONS.test(name)) {
      let text = readFileSync(p, "utf8");
      for (const [token, value] of Object.entries(tokens)) {
        text = text.replaceAll(token, value);
      }
      writeFileSync(p, text);
    }
  }
}
