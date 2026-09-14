import type { ComponentType, ReactNode } from "react";

/** Two ways the same deck is consumed: projected, or read. */
export type Mode = "present" | "learn";

/**
 * What a slide's Stage receives. The Stage renders the same visual in both
 * modes; `step` drives progressive reveal.
 */
export interface StageContext {
  mode: Mode;
  /** Highest revealed step. Present: 0..steps. Learn: pinned to steps. */
  step: number;
  /** Total progressive reveals this slide declares. */
  steps: number;
  isPresent: boolean;
  isLearn: boolean;
}

/**
 * Narration is the written voice-over: public learning content, not private
 * speaker notes.
 * - string   -> one block for the whole slide.
 * - string[] -> one block per step (index 0 = step 0).
 */
export type Narration = string | string[];

export interface Slide {
  id: string;
  /** Act label for the chrome, e.g. "Act 2, the walk". */
  act?: string;
  title: string;
  /** Number of progressive reveals. 0 = static. Default 0. */
  steps?: number;
  Stage: ComponentType<{ ctx: StageContext }>;
  /** Rich learning layer, shown in the explain drawer. Wins over narration. */
  explain?: ReactNode;
  /** Simple-text fallback for the explain drawer. */
  narration?: Narration;
  /** One line the audience should leave the slide with. */
  takeaway?: ReactNode;
}

export interface DeckModel {
  id: string;
  title: string;
  subtitle?: string;
  slides: Slide[];
}
