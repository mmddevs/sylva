import * as React from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/motion/pointer";
import { Button } from "@/components/ui/button";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import { HERO_IMAGES, SITE } from "@/lib/site";

/* Entrée chorégraphiée, une fois par visite (CSS, globals.css .hero-in) :
   | Élément        | Rôle       | Début  | Durée  | Mouvement           |
   | Mots du titre  | Lead       | 0 ms   | 900 ms | montée 1.25rem      | écarts qui rétrécissent
   | Description    | Support    | 380 ms | 900 ms | montée 0.75rem      | chevauche le titre
   | Boutons        | Support    | 480 ms | 900 ms | montée 0.5rem       | chevauche
   | Indice scroll  | Décoration | 800 ms | 1200ms | fondu seul          |
   | Bande d'images | Statique   | (elle défile déjà d'elle-même)
   | Navigation     | Statique   | (utilisable dès la première image)
   Reduced motion : fondu seul, sans délai. Au scroll, le contenu sort en
   fondu (scroll-driven, .scroll-exit). */

const delay = (ms: number, rise?: string) =>
  ({ "--hero-delay": `${ms}ms`, ...(rise ? { "--hero-rise": rise } : {}) }) as React.CSSProperties;

export function Hero() {
  const lines = SITE.tagline.split("\n");
  let w = 0;
  return (
    <TiltedGridHero
      images={HERO_IMAGES}
      axis={60}
      tileHeight={24}
      className="h-svh min-h-150 w-full bg-background"
    >
      <div className="scroll-exit relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-between px-6 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
        <h1 className="max-w-4xl text-balance font-heading text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] font-normal tracking-[-0.03em] text-foreground">
          {lines.map((line, li) => (
            <span key={li} className="block">
              {line.split(" ").map((word, wi) => {
                const i = w++;
                const ms = Math.round(85 * Math.pow(i, 0.75));
                return (
                  <React.Fragment key={wi}>
                    {wi > 0 && " "}
                    <span
                      className={`hero-in inline-block ${li === 1 && wi === line.split(" ").length - 1 ? "italic" : ""}`}
                      style={delay(ms)}
                    >
                      {word}
                    </span>
                  </React.Fragment>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="flex flex-col items-center gap-6">
          <p
            className="hero-in max-w-md text-pretty text-base text-muted-foreground sm:text-lg"
            style={delay(380, "0.75rem")}
          >
            {SITE.description}
          </p>
          <div className="hero-in flex flex-wrap items-center justify-center gap-3" style={delay(480, "0.5rem")}>
            <Magnetic>
              <Button size="lg" nativeButton={false} render={<Link href={SITE.heroCta.href} />}>
                {SITE.heroCta.label}
                <ArrowRight data-icon="inline-end" aria-hidden />
              </Button>
            </Magnetic>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href={SITE.heroSecondary.href} />}
            >
              {SITE.heroSecondary.label}
            </Button>
          </div>
          <Link
            href="/#work"
            className="hero-fade group mt-2 hidden items-center gap-2 font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase sm:inline-flex"
            style={delay(800)}
          >
            {SITE.scrollCue}
            <ArrowDown
              aria-hidden
              className="size-3.5 transition-transform duration-(--duration-ui) ease-out group-hover:translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </TiltedGridHero>
  );
}
