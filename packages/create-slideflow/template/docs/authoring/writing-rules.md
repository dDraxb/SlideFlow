# Writing rules (hard constraints for deck text)

Concrete, enforceable rules for all audience-facing deck text (slide copy, narration,
explain panels, takeaways). These sit on top of `tone-of-voice.md`. When in doubt, read human.

> Gate: run `pnpm lint:text`. It hard-fails on any dash in `src` and prints soft warnings
> for the fuzzier rules (semicolons in prose, comma-before-and, ALL-CAPS) to review by eye.

1. **No dashes.** No em-dash (—) or en-dash (–). Rewrite with a period or comma. Hyphens in
   compound words (`non-developer`, `day-to-day`) are fine.
2. **No colons or semicolons** unless they genuinely add readability. Default to a period.
   (Structured "spec" blocks / artifacts where a colon labels a field are the rare exception.)
3. **No quotes to highlight a name or term.** Quotation marks are for actual speech or a quoted
   line only (a real prompt, a spoken punchline). Don't quote a word for emphasis — bold it or
   leave it plain.
4. **No comma before "and"** unless you genuinely need it to break up a long sentence.
5. **Sentences read human.** Say it the way you'd say it out loud.
6. **Don't capitalise words for significance.** No ALL-CAPS or Title-Casing for emphasis. Use
   bold or just normal case. (Real acronyms like RAG, CSV, HR are fine.)
7. **No dramatic / Shakespearian prose.** Plain and direct beats grand. Cut the flourish.
