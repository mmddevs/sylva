"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* Le seul système d'apparition du site. Un IntersectionObserver par élément,
   déclenché une fois ; l'animation elle-même est en CSS (globals.css,
   [data-reveal]) : transform/opacity/clip-path, ease-out, 800 ms, opacité
   seule en reduced motion. */

export function useInView<T extends Element>(
  options: { threshold?: number; rootMargin?: string } = {},
) {
  const ref = React.useRef<T>(null);
  const [shown, setShown] = React.useState(false);
  const { threshold = 0, rootMargin = "0px 0px -12% 0px" } = options;
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);
  return [ref, shown] as const;
}

type RevealVariant = "rise" | "fade" | "unveil" | "draw-x";

/** Fait apparaître ses enfants la première fois qu'ils entrent à l'écran. */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
  as: Tag = "div",
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  /** ms ; échelonner de 120–150 ms entre frères. */
  delay?: number;
  variant?: RevealVariant;
  as?: "div" | "li" | "span" | "figure";
  style?: React.CSSProperties;
}) {
  const [ref, shown] = useInView<HTMLDivElement>();
  return React.createElement(
    Tag,
    {
      ref,
      "data-reveal": variant,
      "data-shown": shown,
      className,
      style: { "--reveal-delay": `${delay}ms`, ...style } as React.CSSProperties,
    },
    children,
  );
}

/** Titre révélé mot par mot, chaque mot monte depuis sous sa ligne de base.
    Les écarts rétrécissent (vague, pas métronome) et plafonnent à ~450 ms. */
export function RevealText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
}) {
  const [ref, shown] = useInView<HTMLHeadingElement>({ threshold: 0.3 });
  const lines = text.split("\n");
  let index = 0;
  return React.createElement(
    Tag,
    { ref, "data-shown": shown, className },
    lines.map((line, li) => (
      <React.Fragment key={li}>
        {li > 0 && <br />}
        {line.split(" ").map((word, wi) => {
          const i = index++;
          const step = Math.min(450, Math.round(70 * Math.pow(i, 0.8)));
          return (
            <React.Fragment key={wi}>
              {wi > 0 && " "}
              <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                <span
                  className="reveal-word"
                  style={{ "--reveal-delay": `${delay + step}ms` } as React.CSSProperties}
                >
                  {word}
                </span>
              </span>
            </React.Fragment>
          );
        })}
      </React.Fragment>
    )),
  );
}

/** Filet qui se dessine de gauche à droite. Décoratif. */
export function Rule({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <Reveal
      variant="draw-x"
      delay={delay}
      className={cn("h-px w-full bg-border", className)}
    />
  );
}
