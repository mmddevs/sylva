import type Lenis from "lenis";

/* Le défilement doux (Lenis) est actif seulement à la souris / au trackpad et
   hors prefers-reduced-motion. Tout défilement programmé passe par ici : doux
   quand Lenis tourne, `scrollTo` natif sinon. */

let current: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  current = lenis;
}

export function smoothScrollTo(
  y: number,
  { immediate = false, duration = 1.3 }: { immediate?: boolean; duration?: number } = {},
) {
  if (current) current.scrollTo(y, { immediate, duration });
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}

/** Défile jusqu'à un élément (ancre), en tenant compte du `scroll-padding-top` de la page. */
export function smoothScrollToElement(el: HTMLElement, options?: { duration?: number }) {
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const y = el.getBoundingClientRect().top + window.scrollY - pad;
  smoothScrollTo(y, options);
}

export function isSmoothScrolling() {
  return current !== null;
}
