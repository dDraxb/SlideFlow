/**
 * `inert` on a React 18 element.
 *
 * The explain drawer and the help overlay both stay mounted when closed (CSS
 * cannot defer unmount) so they need `inert` alongside `aria-hidden` to stay
 * out of the tab order. React 18's type definitions predate the attribute,
 * but React 18 forwards unknown lowercase attributes straight to the DOM.
 * Delete this file and use `inert={bool}` directly on a React 19 upgrade.
 *
 * Spread it: `<aside {...inertWhen(!open)}>`
 */
export function inertWhen(inert: boolean): Record<string, unknown> {
  return inert ? { inert: "" } : {};
}
