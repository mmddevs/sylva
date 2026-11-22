import { Reveal, RevealText } from "@/components/reveal";
import HoverExpand from "@/components/ui/expand-on-hover";
import { SERIES, SERIES_SECTION, categoryLabel } from "@/lib/site";

const ITEMS = SERIES.map((s) => ({
  id: s.slug,
  src: s.cover.src,
  alt: s.cover.alt,
  title: s.title,
  meta: `${categoryLabel(s.category)} · ${s.year} · ${SERIES_SECTION.printsLabel(s.prints)}`,
  href: `/series/${s.slug}`,
  transitionName: `series-${s.slug}`,
}));

/* Les séries en accordéon d'images : une s'ouvre au survol, au focus ou au
   toucher, et mène à sa page (l'image devient celle de l'en-tête). */
export function SeriesSection() {
  return (
    <section id="series" className="mx-auto w-full max-w-6xl px-6 py-section">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <RevealText
          as="h2"
          text={SERIES_SECTION.title}
          className="text-balance font-heading text-5xl font-normal tracking-[-0.02em] sm:text-7xl"
        />
        <Reveal delay={150}>
          <p className="max-w-md text-pretty text-muted-foreground lg:justify-self-end">
            {SERIES_SECTION.intro}
          </p>
        </Reveal>
      </div>
      <Reveal delay={250} className="mt-12 lg:mt-16">
        <HoverExpand items={ITEMS} />
      </Reveal>
    </section>
  );
}
