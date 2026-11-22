"use client";

import * as React from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { SeriesCard } from "@/components/series/series-card";
import { CATEGORIES, SERIES_SECTION, type CategoryId, type Series } from "@/lib/site";
import { cn } from "@/lib/utils";

type Filter = CategoryId | "all";

/* Filtrer : les cartes restantes glissent à leur nouvelle place (layout,
   ressort), celles qui partent sortent du flux tout de suite (popLayout) pour
   que le trou se referme pendant leur fondu. Pas de stagger : c'est un
   contrôle qu'on utilise plusieurs fois. */
const SPRING = { type: "spring", duration: 0.5, bounce: 0.12 } as const;

export function SeriesGrid({ series }: { series: Series[] }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const reduce = useReducedMotion();
  const visible = filter === "all" ? series : series.filter((s) => s.category === filter);

  const options: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: SERIES_SECTION.all, count: series.length },
    ...CATEGORIES.map((c) => ({
      id: c.id,
      label: c.label,
      count: series.filter((s) => s.category === c.id).length,
    })),
  ];

  return (
    <LayoutGroup>
      <div
        role="group"
        aria-label={SERIES_SECTION.filterLabel}
        className="-mx-6 flex snap-x gap-2 overflow-x-auto overscroll-x-contain px-6 pb-2 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {options.map((o) => {
          const active = filter === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(o.id)}
              className={cn(
                "relative inline-flex h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-4 text-sm",
                "transition-[color,border-color,scale] duration-(--duration-ui) ease-out active:scale-[0.97]",
                active
                  ? "border-transparent text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="series-filter"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={reduce ? { duration: 0 } : SPRING}
                />
              )}
              <span className="relative">{o.label}</span>
              <span className="relative font-mono text-xs tabular-nums opacity-70">{o.count}</span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {visible.length === 0 ? SERIES_SECTION.empty : SERIES_SECTION.shownLabel(visible.length)}
      </p>

      <motion.ul layout={!reduce} className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((s, i) => (
            <motion.li
              key={s.slug}
              layout={!reduce}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
              transition={reduce ? { duration: 0 } : SPRING}
              className="min-w-0"
            >
              <SeriesCard series={s} tall={i % 3 === 1} priority={i < 3} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {visible.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground"
          >
            {SERIES_SECTION.empty}
          </motion.p>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
