import { version } from "react";

const REACT_19_OR_LATER = Number.parseInt(version, 10) >= 19;

/**
 * `inert` on a React element, across React 18 and React 19.
 *
 * The explain drawer and the help overlay both stay mounted when closed (CSS
 * cannot defer unmount) so they need `inert` alongside `aria-hidden` to stay
 * out of the tab order. React 18's type definitions predate the attribute,
 * but React 18 forwards unknown lowercase attributes straight to the DOM, so
 * it needs a truthy string value (`""` would be dropped as falsy). React 19
 * knows `inert` as a boolean attribute and treats `""` as falsy, removing it
 * from the DOM, so it needs the real boolean `true`. This helper picks the
 * right value for whichever major is installed.
 *
 * Spread it: `<aside {...inertWhen(!open)}>`
 */
export function inertWhen(inert: boolean): Record<string, unknown> {
  return inert ? { inert: REACT_19_OR_LATER ? true : "" } : {};
}
