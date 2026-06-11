// Shared handle to the single Lenis instance created in SmoothScroll, so the
// opening NameIntro can pause/resume smooth scroll while it plays — without
// reaching through `window` (which Lenis already augments with its own type).
import type Lenis from 'lenis';

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}
