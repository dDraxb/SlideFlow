/** Tiny classnames join; keeps the engine dependency-free. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
