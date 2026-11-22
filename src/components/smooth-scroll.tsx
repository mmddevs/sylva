"use client";

import * as React from "react";
import Lenis from "lenis";
import { useFinePointer } from "@/components/motion/pointer";
import {
  registerLenis,
  smoothScrollToElement,
} from "@/lib/smooth-scroll";

/* Défilement doux à inertie (Lenis) : la molette ne saute plus d'un cran, la
   page glisse et s'arrête en douceur.

   - Souris et trackpad seulement. Au doigt, le défilement natif est déjà
     inertiel ; avec « réduire les animations », on ne touche à rien.
   - Lenis écrit la vraie position de défilement : `position: sticky`, les
     animations liées au scroll en CSS et la section épinglée du carousel
     continuent de lire `scrollY` comme avant.
   - Les liens vers une ancre de la même page (`/#series`) sont pris en charge
     ici : défilement doux au lieu du saut instantané de Next.
   - Une zone qui défile d'elle-même (menu, champ de texte long) porte
     `data-lenis-prevent` et garde sa molette. */
export function SmoothScroll() {
  const enabled = useFinePointer();

  React.useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      wheelMultiplier: 1,
      allowNestedScroll: true,
    });
    registerLenis(lenis);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      // On garde la main : ni le saut de Next, ni un second défilement.
      e.preventDefault();
      e.stopPropagation();
      smoothScrollToElement(target);
      history.pushState(null, "", url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      registerLenis(null);
      lenis.destroy();
    };
  }, [enabled]);

  return null;
}
