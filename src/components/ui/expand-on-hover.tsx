"use client";

import * as React from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExpandItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  /** Ligne secondaire (catégorie, année…), en police mono. */
  meta?: string;
  href: string;
  /** Si présent, l'image devient un élément partagé de transition de vue. */
  transitionName?: string;
}

export interface HoverExpandProps {
  items: ExpandItem[];
  /** Panneau ouvert au chargement. @default 0 */
  defaultActive?: number;
  className?: string;
}

/* Accordéon d'images. Au survol (souris), au focus (clavier) ou au premier
   toucher, un panneau s'ouvre pendant que les autres se referment ; un second
   toucher (ou un clic sur le panneau ouvert) suit le lien.

   - Horizontal à partir de `lg`, vertical en dessous (téléphone, tablette).
   - La largeur est animée par `flex-grow` : les panneaux remplissent toujours
     le conteneur, quelle que soit sa largeur, et la transition CSS se
     rattrape en vol.
   - L'image garde une taille fixe derrière le panneau : l'ouverture la
     dévoile, elle ne l'écrase pas.
   - Couleurs, ombres et rayons viennent des jetons du thème. */
export function HoverExpand({
  items,
  defaultActive = 0,
  className,
}: HoverExpandProps) {
  const [active, setActive] = React.useState(defaultActive);

  return (
    <ul
      className={cn(
        "flex h-152 flex-col gap-1 [--grow:6] lg:h-120 lg:flex-row lg:[--grow:7]",
        className,
      )}
    >
      {items.map((item, i) => {
        const on = i === active;
        const link = (
          <Link
            href={item.href}
            aria-label={item.meta ? `${item.title}, ${item.meta}` : item.title}
            transitionTypes={["nav-forward"]}
            onClick={(e) => {
              // Toucher : le premier appui ouvre, le second suit le lien.
              if (!on) {
                e.preventDefault();
                setActive(i);
              }
            }}
            onFocus={() => setActive(i)}
            className="group relative block size-full overflow-hidden rounded-sm bg-muted shadow-print outline-offset-4"
          >
            {/* Taille fixe, centrée : le panneau la découvre. */}
            <div className="absolute inset-x-0 top-1/2 h-88 -translate-y-1/2 lg:inset-y-0 lg:right-auto lg:left-1/2 lg:h-auto lg:w-176 lg:-translate-x-1/2 lg:translate-y-0">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 704px, 100vw"
                draggable={false}
                className="object-cover"
              />
            </div>

            {/* Les panneaux fermés reculent : voile de la couleur du fond. */}
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 bg-background/55 transition-opacity duration-300 ease-in-out motion-reduce:transition-none",
                on ? "opacity-0" : "opacity-100",
              )}
            />

            {/* Panneau fermé : le titre, à l'horizontale (vertical en bureau). */}
            <span
              aria-hidden
              className={cn(
                "absolute top-1/2 left-4 -translate-y-1/2 font-mono text-xs tracking-widest whitespace-nowrap text-foreground uppercase transition-opacity duration-200 ease-out motion-reduce:transition-none",
                "lg:top-auto lg:bottom-5 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-0 lg:[writing-mode:vertical-rl]",
                on ? "opacity-0" : "opacity-100 delay-150",
              )}
            >
              {item.title}
            </span>

            {/* Panneau ouvert : titre, méta et flèche sur un dégradé du fond. */}
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-background/90 via-background/55 to-transparent p-5 pt-24 transition-opacity duration-300 ease-out motion-reduce:transition-none",
                on ? "opacity-100 delay-150" : "pointer-events-none opacity-0",
              )}
            >
              <div className="w-64 min-w-0 sm:w-96">
                <h3 className="line-clamp-2 font-heading text-3xl tracking-tight text-balance text-foreground">
                  {item.title}
                </h3>
                {item.meta ? (
                  <p className="mt-1.5 truncate font-mono text-xs text-muted-foreground tabular-nums">
                    {item.meta}
                  </p>
                ) : null}
              </div>
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-(--duration-ui) ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              >
                <ArrowUpRight className="size-5" />
              </span>
            </div>
          </Link>
        );

        return (
          <li
            key={item.id}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setActive(i);
            }}
            style={{ flexGrow: on ? "var(--grow)" : 1, flexBasis: 0 }}
            className="min-h-0 min-w-0 transition-[flex-grow] duration-300 ease-in-out motion-reduce:transition-none"
          >
            {item.transitionName ? (
              <ViewTransition
                name={item.transitionName}
                share="morph"
                default="none"
              >
                {link}
              </ViewTransition>
            ) : (
              link
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default HoverExpand;
