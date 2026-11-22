import { ViewTransition } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal, RevealText } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { SERIES, SERIES_PAGE, categoryLabel, getSeries } from "@/lib/site";

/* Une série inconnue doit répondre 404 : la première requête attend le rendu
   complet au lieu d'envoyer d'abord le shell en 200. */
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return SERIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/series/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getSeries(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.summary,
    alternates: { canonical: `/series/${s.slug}` },
    openGraph: { title: s.title, description: s.summary, images: [{ url: s.cover.src, alt: s.cover.alt }] },
  };
}

export default async function SeriesPage({ params }: PageProps<"/series/[slug]">) {
  const { slug } = await params;
  const s = getSeries(slug);
  if (!s) notFound();
  const i = SERIES.indexOf(s);
  const prev = SERIES[i - 1];
  const next = SERIES[i + 1];
  const facts = [
    { label: SERIES_PAGE.place, value: s.place },
    { label: SERIES_PAGE.year, value: String(s.year) },
    { label: SERIES_PAGE.prints, value: String(s.prints) },
    { label: SERIES_PAGE.category, value: categoryLabel(s.category) },
  ];

  return (
    <main id="main" className="flex-1 pt-16">
        <article className="mx-auto w-full max-w-6xl px-6 pt-10 pb-section">
          <Link
            href="/#series"
            transitionTypes={["nav-back"]}
            className="group inline-flex h-11 items-center gap-2 text-sm text-muted-foreground transition-colors duration-(--duration-ui) hover:text-foreground"
          >
            <ArrowLeft aria-hidden className="size-4 transition-transform duration-(--duration-ui) ease-out group-hover:-translate-x-0.5" />
            {SERIES_PAGE.back}
          </Link>

          <ViewTransition name={`series-${s.slug}`} share="morph" default="none">
            <div className="relative mt-6 aspect-3/2 overflow-hidden rounded-sm bg-muted shadow-print sm:aspect-21/9">
              <Image src={s.cover.src} alt={s.cover.alt} fill priority sizes="(min-width: 1152px) 1104px, 100vw" className="object-cover" />
            </div>
          </ViewTransition>

          <ViewTransition enter="page-enter" exit="page-exit" default="none">
            <div>
              <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
                <div>
                  <RevealText
                    as="h1"
                    text={s.title}
                    className="text-balance wrap-break-word font-heading text-5xl font-normal tracking-[-0.03em] sm:text-7xl"
                  />
                  <Reveal delay={120}>
                    <p className="mt-6 max-w-xl font-heading text-2xl text-pretty italic text-muted-foreground">{s.summary}</p>
                  </Reveal>
                  {s.text.map((p, k) => (
                    <Reveal key={k} delay={220 + k * 120}>
                      <p className="mt-6 max-w-xl text-pretty">{p}</p>
                    </Reveal>
                  ))}
                </div>
                <Reveal delay={200}>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-6">
                    {facts.map((f) => (
                      <div key={f.label} className="min-w-0">
                        <dt className="text-sm text-muted-foreground">{f.label}</dt>
                        <dd className="mt-1 font-mono text-sm wrap-break-word tabular-nums">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <Button nativeButton={false} render={<Link href="/#contact" />} size="lg" className="mt-8 w-full whitespace-normal sm:w-auto">
                    {SERIES_PAGE.cta}
                  </Button>
                </Reveal>
              </div>

              <ul className="mt-20 grid gap-6 sm:grid-cols-2">
                {s.images.map((img, k) => (
                  <Reveal
                    as="li"
                    key={img.src}
                    variant="unveil"
                    delay={(k % 2) * 120}
                    className={k % 3 === 0 ? "sm:col-span-2" : undefined}
                  >
                    <div className={`relative overflow-hidden rounded-sm bg-muted ${k % 3 === 0 ? "aspect-video" : "aspect-4/5"}`}>
                      <Image src={img.src} alt={img.alt} fill sizes={k % 3 === 0 ? "(min-width: 1152px) 1104px, 100vw" : "(min-width: 640px) 50vw, 100vw"} className="object-cover" />
                    </div>
                  </Reveal>
                ))}
              </ul>

              <nav aria-label={SERIES_PAGE.neighbours} className="mt-20 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
                {prev ? (
                  <Link href={`/series/${prev.slug}`} transitionTypes={["nav-back"]} className="group flex flex-col gap-1 rounded-lg p-2 -m-2">
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowLeft aria-hidden className="size-4 transition-transform duration-(--duration-ui) ease-out group-hover:-translate-x-0.5" />
                      {SERIES_PAGE.previous}
                    </span>
                    <span className="font-heading text-3xl tracking-tight">{prev.title}</span>
                  </Link>
                ) : <span />}
                {next && (
                  <Link href={`/series/${next.slug}`} transitionTypes={["nav-forward"]} className="group flex flex-col items-end gap-1 rounded-lg p-2 -m-2 text-right">
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      {SERIES_PAGE.next}
                      <ArrowRight aria-hidden className="size-4 transition-transform duration-(--duration-ui) ease-out group-hover:translate-x-0.5" />
                    </span>
                    <span className="font-heading text-3xl tracking-tight">{next.title}</span>
                  </Link>
                )}
              </nav>
            </div>
          </ViewTransition>
        </article>
    </main>
  );
}
