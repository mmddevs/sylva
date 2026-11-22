"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: string | number;
  url: string;
  title: string;
  /** Texte alternatif de l'image. Par défaut : le titre. */
  alt?: string;
  /** Si présent, la carte est cliquable (souris et doigt). */
  href?: string;
}

export interface DiagonalMarqueeCarouselProps {
  cards?: CardItem[];
  angle?: number;
  /** Secondes pour parcourir un demi-rang. Plus grand = plus lent. */
  baseSpeed?: number;
  alternateDirections?: boolean;
  className?: string;
  cardClassName?: string;
  fadeClassName?: string;
}

/* Adapté au projet : couleurs, ombres et rayons viennent des jetons du thème
   (globals.css), les keyframes aussi (`animate-diag-left` / `animate-diag-right`),
   les images passent par next/image.

   Accessibilité : ce défilement est décoratif. Il est masqué aux lecteurs
   d'écran et ses cartes sortent de l'ordre de tabulation (tabIndex -1) : la
   navigation au clavier se fait par la section qui l'accompagne. Les cartes
   restent cliquables à la souris et au doigt. Le mouvement s'arrête au survol
   et avec prefers-reduced-motion. */

const Card = ({ card, className }: { card: CardItem; className?: string }) => {
  const body = (
    <>
      <Image
        src={card.url}
        alt={card.alt ?? card.title}
        fill
        sizes="(min-width: 640px) 400px, 256px"
        draggable={false}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-background/35" />
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/85 to-transparent px-4 pt-10 pb-3">
        <span className="block truncate font-heading text-lg tracking-tight text-foreground sm:text-xl">
          {card.title}
        </span>
      </div>
    </>
  );

  const classes = cn(
    "group relative block h-48 w-64 shrink-0 overflow-hidden rounded-sm shadow-lift sm:h-75 sm:w-100",
    className,
  );

  return card.href ? (
    <Link
      href={card.href}
      tabIndex={-1}
      transitionTypes={["nav-forward"]}
      className={cn(classes, "cursor-pointer")}
    >
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
};

const MarqueeRow = ({
  cards,
  speed,
  direction,
  cardClassName,
}: {
  cards: CardItem[];
  speed: number;
  direction: 1 | -1;
  cardClassName?: string;
}) => {
  const animationClass =
    direction === -1 ? "animate-diag-left" : "animate-diag-right";

  return (
    <div className="flex w-full overflow-hidden">
      <div
        className={cn(
          "flex shrink-0 hover:paused motion-reduce:animate-none",
          animationClass,
        )}
        style={{ "--speed": `${speed}s` } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {cards.map((card, idx) => (
              <div key={`${card.id}-${idx}-${copy}`} className="shrink-0 pr-8">
                <Card card={card} className={cardClassName} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DiagonalMarqueeCarousel({
  cards = [],
  angle = -25,
  baseSpeed = 120,
  alternateDirections = true,
  className = "",
  cardClassName = "",
  fadeClassName = "",
}: DiagonalMarqueeCarouselProps) {
  // Un demi-rang doit être au moins aussi large que le conteneur (200vw) pour
  // qu'aucun vide n'apparaisse : deux tours de cartes suffisent jusqu'à ~2 800 px.
  const rowCards = [...cards, ...cards];
  const rowCardsReverse = [...rowCards].reverse();

  return (
    <div
      aria-hidden
      className={cn(
        "relative flex h-svh w-full items-center justify-center overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute z-0 flex w-[200vw] flex-col gap-8"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <MarqueeRow
          cards={rowCards}
          speed={baseSpeed}
          direction={-1}
          cardClassName={cardClassName}
        />
        <MarqueeRow
          cards={rowCardsReverse}
          speed={baseSpeed - 15 > 20 ? baseSpeed - 15 : 30}
          direction={alternateDirections ? 1 : -1}
          cardClassName={cardClassName}
        />
        <MarqueeRow
          cards={rowCards}
          speed={baseSpeed + 15}
          direction={-1}
          cardClassName={cardClassName}
        />
        <MarqueeRow
          cards={rowCardsReverse}
          speed={baseSpeed - 6 > 20 ? baseSpeed - 6 : 35}
          direction={alternateDirections ? 1 : -1}
          cardClassName={cardClassName}
        />
        <MarqueeRow
          cards={rowCards}
          speed={baseSpeed + 24}
          direction={-1}
          cardClassName={cardClassName}
        />
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-1/5 bg-linear-to-b from-background to-transparent",
          fadeClassName,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/5 bg-linear-to-t from-background to-transparent",
          fadeClassName,
        )}
      />
    </div>
  );
}

/**
 * Great UI Component
 *
 * Built with React, TypeScript, Tailwind CSS, and Framer Motion.
 * Designed to be accessible, customizable, and production-ready.
 *
 * Website: https://great-ui.com
 * GitHub: https://github.com/Saurabh-2607/GreatUI
 * X (Great UI): https://x.com/GreatUIHQ
 *
 * Released under the MIT License.
 * Contributions, issues, and feature requests are always welcome.
 *
 * Author: Saurabh Sharma
 * X: https://x.com/srbh_s
 */
