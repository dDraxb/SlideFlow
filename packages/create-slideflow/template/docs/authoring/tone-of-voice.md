# Tone of Voice

> Reusable authoring contract for slide decks built on this framework.
> Audience: anyone (human or AI agent) writing slide copy or narration for a deck.
> Source of truth for *how it sounds*. The deck's narrative file owns *what it says*.

An operating distillation of the deck author's voice, kept deliberately
impersonal so any deck built on this framework can adopt it as-is.

---

## 1. The one-line voice

Direct, evidence-first, systems-minded. Make the complex navigable. No filler, no
flattery, no hype. Earn every claim; name the boundary; end with something concrete.

If a sentence does not inform a decision or sharpen a mental model, cut it.

---

## 2. Voice principles (ranked)

1. **Clarity over cleverness.** A clean boundary beats a clever turn of phrase.
   The goal is that the audience can *act on* the idea, not admire it.
2. **Evidence before conclusion.** Show the thing, then name what it means.
   "Here is the output with a field missing — so the system rejects it." Not
   "validation is important."
3. **Decompose the scary.** Default move: take the blob, name its parts, name
   what each part is responsible for. This is the through-line of every deck.
4. **State uncertainty plainly.** "This is the part I'm least sure about" builds
   more trust than false confidence. Never hide a gap behind polish.
5. **Calm challenge.** Push on weak assumptions with evidence, not volume.
   "I wouldn't do that, because it conflicts with X." Never strawman.
6. **Respect the audience's existing skill.** Especially non-developers: the
   posture is "you already do this in your domain," never "let me dumb this down."
7. **Useful over impressive.** Optimize for the idea that survives the drive home,
   not the slide that gets a photo.

---

## 3. How it sounds — sentence-level

Pattern to favor: `[concrete thing] → [what it means] → [what you do with it].`

- Short declaratives. Fragments are fine for emphasis. One idea per sentence.
- Active voice. Named actors ("the model", "the validator", "you"), not "it is done".
- Concrete nouns over abstractions. "the salary clause", not "a contractual element".
- Define a term once, in plain words, then reuse it consistently (shared vocabulary).
- Numbers and specifics over intensifiers. "five parts", not "many parts".

Avoid:

- Filler and hedging: *just, really, basically, actually, simply, very, in order to.*
- Corporate padding: *leverage synergies, unlock value, at the end of the day.*
- Hype: *revolutionary, magic, game-changing, mind-blowing* — except when naming
  the *feeling* you are about to dismantle (e.g. "it looks like magic — it isn't").
- Flattery and generic encouragement.
- Unsupported superlatives. If it's the strongest, show why.

---

## 4. Slide copy (what's projected) vs narration (the written voice-over)

This framework separates the two. They have different jobs and different rules.

### Slide copy — sparse, projected

- Few words. A slide is a *pointer*, not a document. Headline + at most a short
  phrase or 3 bullets. If a slide needs a paragraph, it's a narration, not a slide.
- One idea per slide. If two ideas fight, split the slide.
- The visual carries the claim where possible; text labels it, doesn't repeat it.
- No sentence that the speaker will read aloud verbatim. Slides don't talk; you do.

### Narration — the written voice-over (public learning content)

- This is the explain-it layer a reader gets when the deck is shared as a website.
  It is *not* private speaker notes — write it for the learner, not the presenter.
- Full sentences, but still tight. The voice above applies: direct, evidence-first.
- It should make sense standing alone, without the speaker in the room.
- Carry the *why*, the boundary, and the one caveat. This is where nuance lives that
  the slide deliberately omits.
- Length: a few sentences per step. Enough to stand alone, never a wall of text.

---

## 5. Analogies — the load-bearing tool, handled carefully

Decomposition analogies (contracts, personas, relationships) are how this voice
makes AI concrete. Rules so they don't break:

- **Transfer the posture, not a 1:1 map.** "You already decompose complex things"
  transfers. "This clause = that component" is a category error — name the trap out
  loud before the audience falls into it.
- **Don't overclaim identity.** "Plays the same role as" is safe. "Literally is"
  invites the one skeptic to detonate it in front of the room.
- **Let the visual make the claim** when you can, so the words stay honest.
- **One anchor, carried well.** A single concrete analogy that lands beats three
  that half-land. Pressure-test the anchor against the least technical person.

---

## 6. Opening and closing

- **Open** with awe + curiosity, not fear. "Isn't it strange that this works?"
  A worried audience is a closed one; a curious one is open.
- **Credibility = access, not credentials.** "I've been inside these systems and
  I'll show you what's actually there" beats a title slide of accomplishments.
- **Close with agency relocated to the audience.** The payoff line should make the
  audience the one who changed, not the technology. Keep the complexity intact —
  don't promise it got simpler; promise they can now see into it.
- **Earn callbacks.** If the open plants an image, the close revisits the *same*
  image, now understood. Don't gesture at a callback you didn't set up.

---

## 7. Anti-patterns (avoid these)

- **Over-structuring.** More boxes than the idea needs. Find the smallest useful
  decomposition, not the complete one.
- **Abstraction outrunning the audience.** If a term is DDD/engineering jargon
  ("bounded context"), say the plain-language concept instead and drop the term.
- **Moving faster than they can follow.** Add a translation beat for non-experts
  before the next layer. One new idea at a time.
- **Tool-first reflex.** Don't show machinery for its own sake; show it only where
  it changes what the audience can do or decide.
- **Demo fragility.** Pre-bake or simulate anything shown "working live." Never put
  a real network/model call on the critical path of a talk.

---

## 8. Per-deck authoring checklist

Before a deck is "done", every slide should pass:

- [ ] Slide copy is sparse; the paragraph lives in narration, not on screen.
- [ ] Narration stands alone for a shared-link reader and carries the *why*.
- [ ] One idea per slide; the visual labels the claim, doesn't repeat the headline.
- [ ] No filler/hype words (section 3) unless naming a feeling to dismantle.
- [ ] Every claim has visible evidence or is flagged as uncertain.
- [ ] Any analogy transfers posture, not a 1:1 map; no "literally is" overclaim.
- [ ] Any jargon term is replaced by its plain-language concept.
- [ ] The open is curiosity (not fear); the close relocates agency to the audience.
