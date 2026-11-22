import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealText } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import DiagonalMarqueeCarousel from "@/components/ui/great-ui-diagonal-marquee-carousel";
import { MARQUEE, SERIES } from "@/lib/site";

const CARDS = SERIES.map((s) => ({
  id: s.slug,
  url: s.cover.src,
  title: s.title,
  alt: s.cover.alt,
  href: `/series/${s.slug}`,
}));

/* Les couvertures des séries défilent en diagonale derrière le titre. Le défilement
   est décoratif (aria-hidden, hors tabulation) : le clavier passe par le bouton et par
   la section Séries. `content-visibility: auto` suspend le rendu, et donc les
   animations, tant que la section est loin de l'écran. */
export function Marquee() {
  return (
    <section className="relative h-svh max-h-240 min-h-144 overflow-hidden [contain-intrinsic-size:auto_48rem] [content-visibility:auto]">
      <DiagonalMarqueeCarousel cards={CARDS} className="absolute inset-0 h-full" />

      {/* Une réserve de la couleur du fond, sous le texte : lisible sur n'importe quelle photo, en clair comme en sombre. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_78%_58%_at_50%_50%,var(--background),transparent)] opacity-95"
      />

      <div className="pointer-events-none relative z-20 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <RevealText
          text={MARQUEE.title}
          className="text-balance font-heading text-4xl font-normal tracking-[-0.02em] sm:text-6xl"
        />
        <Reveal delay={150}>
          <p className="mx-auto mt-6 max-w-md text-pretty text-muted-foreground sm:text-lg">
            {MARQUEE.text}
          </p>
        </Reveal>
        <Reveal delay={280} className="pointer-events-auto mt-10">
          <Button size="lg" nativeButton={false} render={<Link href={MARQUEE.cta.href} />}>
            {MARQUEE.cta.label}
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
