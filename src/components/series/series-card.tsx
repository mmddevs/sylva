import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERIES_SECTION, categoryLabel, type Series } from "@/lib/site";
import { cn } from "@/lib/utils";

/* Une carte liée : la photo zoome de 3 % dans son cadre, la carte monte de
   2 px, la flèche glisse. L'image est un élément partagé (`series-<slug>`)
   qui se transforme en image d'en-tête sur la page détail. */
export function SeriesCard({
  series,
  tall = false,
  priority = false,
}: {
  series: Series;
  tall?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/series/${series.slug}`}
      transitionTypes={["nav-forward"]}
      data-cursor={SERIES_SECTION.open}
      className="group block rounded-lg outline-offset-4"
    >
      <ViewTransition name={`series-${series.slug}`} share="morph" default="none">
        <div
          className={cn(
            "relative overflow-hidden rounded-sm bg-muted shadow-print transition-[translate,box-shadow] duration-(--duration-ui) ease-out",
            "group-hover:-translate-y-0.5 group-hover:shadow-lift motion-reduce:group-hover:translate-y-0",
            tall ? "aspect-4/5 sm:aspect-3/2 lg:aspect-4/5" : "aspect-3/2",
          )}
        >
          <Image
            src={series.cover.src}
            alt={series.cover.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </div>
      </ViewTransition>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 title={series.title} className="line-clamp-2 font-heading text-2xl tracking-tight text-balance">{series.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-pretty text-muted-foreground">
            {series.summary}
          </p>
        </div>
        <ArrowUpRight
          aria-hidden
          className="mt-1.5 size-5 shrink-0 text-muted-foreground transition-[translate,color] duration-(--duration-ui) ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
        />
      </div>
      <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground tabular-nums">
        <span>{categoryLabel(series.category)}</span>
        <span aria-hidden>·</span>
        <span>{series.year}</span>
        <span aria-hidden>·</span>
        <span>{SERIES_SECTION.printsLabel(series.prints)}</span>
      </p>
    </Link>
  );
}
