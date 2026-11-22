"use client";

import * as React from "react";
import { Counter } from "@/components/motion/counter";
import { SeriesGrid } from "@/components/series/series-grid";
import { WORST_FIGURES, WORST_SERIES } from "@/lib/fixtures/worst-case";
import { FIGURES, SERIES } from "@/lib/site";

const STATES = ["demo", "worst", "empty", "one"] as const;
type State = (typeof STATES)[number];

export function BreakUi() {
  const [state, setState] = React.useState<State>("demo");
  React.useEffect(() => {
    const q = new URLSearchParams(location.search).get("data") as State | null;
    // Lecture de l'URL au montage (sélection persistante au rechargement).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q && STATES.includes(q)) setState(q);
  }, []);
  const pick = (s: State) => {
    setState(s);
    history.replaceState(null, "", `?data=${s}`);
  };
  const series =
    state === "worst" ? WORST_SERIES : state === "empty" ? [] : state === "one" ? SERIES.slice(0, 1) : SERIES;
  const figures = state === "worst" ? WORST_FIGURES : FIGURES.items;

  return (
    <main id="main" className="mx-auto w-full max-w-6xl px-6 pt-28 pb-40">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
        {figures.map((f) => (
          <li key={f.label} className="min-w-0 border-t border-border pt-6">
            <p className="font-heading text-[clamp(2.25rem,6vw,4.5rem)] leading-none tracking-[-0.03em]">
              <Counter value={f.value} />
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{f.label}</p>
          </li>
        ))}
      </ul>
      <div className="mt-20" key={state}>
        <SeriesGrid series={series} />
      </div>
      <div className="fixed bottom-4 left-1/2 z-[90] flex -translate-x-1/2 gap-1 rounded-full border border-border bg-card p-1 font-sans text-xs text-card-foreground shadow-lift">
        {STATES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => pick(s)}
            className={`rounded-full px-3 py-1.5 ${state === s ? "bg-foreground text-background" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>
    </main>
  );
}
