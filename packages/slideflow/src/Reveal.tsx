import type { ReactNode } from "react";
import { cx } from "./cx";
import type { StageContext } from "./types";

/**
 * Progressive reveal. Driven ONLY by ctx.step, so opening the explain drawer
 * never dumps the whole stage. Animation is pure CSS (see styles.css); hidden
 * content is aria-hidden and click-transparent.
 */
export function Reveal({
  ctx,
  at,
  children,
  className,
}: {
  ctx: StageContext;
  at: number;
  children: ReactNode;
  className?: string;
}) {
  const shown = ctx.step >= at;
  return (
    <div className={cx("sf-reveal", shown && "sf-reveal-shown", className)} aria-hidden={!shown}>
      {children}
    </div>
  );
}
