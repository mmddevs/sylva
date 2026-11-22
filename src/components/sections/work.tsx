"use client";

import * as React from "react";
import { LazyMount } from "@/components/lazy-mount";
import DitherHelixCarousel from "@/components/ui/dither-helix-carousel";
import { WORK, WORK_ITEMS } from "@/lib/site";

/* Section épinglée : le cadre `sticky` reste plein écran pendant qu'on
   traverse la section, et le défilement de la page fait tourner la colonne de
   la première à la dernière carte (voir `scrollTarget`). Ensuite la page
   reprend son cours. Sans WebGL2, la section redevient un simple écran. */
const STEPS = WORK_ITEMS.length - 1;

export function Work() {
  const ref = React.useRef<HTMLElement>(null);
  const [pinned, setPinned] = React.useState(true);
  return (
    <section
      id="work"
      ref={ref}
      aria-label={WORK.title}
      style={pinned ? { height: `calc(100svh + ${STEPS} * 60svh)` } : undefined}
      className={pinned ? "relative" : "h-svh min-h-140"}
    >
      <div className={pinned ? "sticky top-0 h-svh" : "h-full"}>
        <LazyMount className="h-full w-full bg-background">
          <DitherHelixCarousel
            items={WORK_ITEMS}
            brand={WORK.title}
            scrollTarget={ref}
            onUnsupported={() => setPinned(false)}
            className="h-full w-full"
          />
        </LazyMount>
      </div>
    </section>
  );
}
