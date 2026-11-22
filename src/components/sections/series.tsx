import { Reveal, RevealText } from "@/components/reveal";
import { SeriesGrid } from "@/components/series/series-grid";
import { SERIES, SERIES_SECTION } from "@/lib/site";

export function SeriesSection() {
  return (
    <section id="series" className="mx-auto w-full max-w-6xl px-6 py-section">
      <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,24rem)] md:items-end">
        <RevealText
          as="h2"
          text={SERIES_SECTION.title}
          className="text-balance font-heading text-5xl font-normal tracking-[-0.02em] sm:text-7xl"
        />
        <Reveal delay={150}>
          <p className="text-pretty text-muted-foreground">{SERIES_SECTION.intro}</p>
        </Reveal>
      </div>
      <Reveal delay={250} className="mt-12">
        <SeriesGrid series={SERIES} />
      </Reveal>
    </section>
  );
}
