#!/usr/bin/env node
// Writing-rules gate for deck text. Usage: node check-text.mjs [srcDir]. See docs/authoring/writing-rules.md.
// Dashes are a hard FAIL (they never appear in code, so detection is exact).
// The rest are WARN (heuristic — code lines are skipped, but review them by eye).
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.argv[2] ?? 'src'
const CAPS_OK = new Set(['RAG', 'CSV', 'HR', 'AI', 'CV', 'NL', 'ON', 'OFF', 'DOM', 'URL', 'API', 'JSON', 'UI'])

if (!existsSync(ROOT)) {
  console.error(`check-text: directory not found: ${ROOT}`)
  process.exit(1)
}

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) out.push(...walk(p))
    else if (/\.(tsx?|ts)$/.test(p)) out.push(p)
  }
  return out
}

// crude: is this line code rather than prose? skip import/const/comments/jsx-attr-only lines.
function isCodeLine(line) {
  const t = line.trim()
  return (
    t === '' ||
    t.startsWith('import ') || t.startsWith('export ') || t.startsWith('const ') ||
    t.startsWith('type ') || t.startsWith('return ') || t.startsWith('function ') ||
    t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('}') ||
    /^(initial|animate|transition|style|className|key|whileHover|onClick|role|aria|data-)/.test(t) ||
    /=>|=== |!== |\{\s*\[/.test(t)
  )
}

let errors = 0
const warns = []

for (const file of walk(ROOT)) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    const where = `${file}:${i + 1}`
    if (/[—–]/.test(line)) { console.error(`DASH  ${where}  ${line.trim()}`); errors++ }
    if (isCodeLine(line)) return
    // strip JSX expressions {…}, attrs, and css values so only prose text is scanned
    const prose = line
      .replace(/\{[^}]*\}/g, '')
      .replace(/className="[^"]*"/g, '')
      .replace(/\b(var|rgba|calc)\([^)]*\)/g, '')
    if (/; /.test(prose) && !/;\s*$/.test(prose)) warns.push(`SEMICOLON ${where}  ${line.trim()}`)
    if (/, and /.test(prose)) warns.push(`COMMA-AND ${where}  ${line.trim()}`)
    for (const m of prose.match(/\b[A-Z]{3,}\b/g) || []) {
      if (!CAPS_OK.has(m)) { warns.push(`CAPS(${m}) ${where}  ${line.trim()}`); break }
    }
  })
}

if (warns.length) {
  console.warn(`\n${warns.length} warning(s) to review by eye:`)
  for (const w of warns) console.warn('  ' + w)
}
if (errors) {
  console.error(`\nFAIL: ${errors} dash(es) in deck text. Rewrite them (see writing-rules.md).`)
  process.exit(1)
}
console.log(`\nOK: no dashes in ${ROOT}. (${warns.length} soft warnings above, review optional.)`)
