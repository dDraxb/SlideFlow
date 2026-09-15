#!/usr/bin/env node
// Single source of truth: copy canonical authoring docs and the text lint
// into the create-slideflow template. Run after editing docs/authoring or
// scripts/check-text.mjs, and before publishing create-slideflow.
import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const template = join(root, "packages/create-slideflow/template");

mkdirSync(join(template, "docs"), { recursive: true });
mkdirSync(join(template, "scripts"), { recursive: true });
cpSync(join(root, "docs/authoring"), join(template, "docs/authoring"), { recursive: true });
cpSync(join(root, "scripts/check-text.mjs"), join(template, "scripts/check-text.mjs"));
console.log("synced docs/authoring and check-text.mjs into create-slideflow template");
