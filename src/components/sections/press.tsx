"use client";

import * as React from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal, RevealText } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { PRESS } from "@/lib/site";

/* Marquee des publications : défilement linéaire constant, s'arrête au survol
   et en reduced motion (liste statique). */
function Marquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-16 pr-16">
      {PRESS.outlets.map((name) => (
        <li key={name} className="font-heading text-3xl whitespace-nowrap text-muted-foreground italic sm:text-4xl">
          {name}
        </li>
      ))}
    </ul>
  );
  return (
    <div
      aria-label={PRESS.marqueeLabel}
      role="region"
      className="group relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap">
        {row(false)}
        <div className="flex motion-reduce:hidden">{row(true)}</div>
      </div>
    </div>
  );
}

/* Carrousel au drag. Suivi 1:1 pendant le geste (motion value, aucun rendu
   React par mouvement), bord élastique (0.2), relâché sur un ressort qui
   reprend la vitesse du doigt et se pose sur la carte la plus proche de la
   position projetée. Rattrapable en vol. Boutons et flèches du clavier. */
function Testimonials() {
  const reduce = useReducedMotion();
  const track = React.useRef<HTMLUListElement>(null);
  const viewport = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [index, setIndex] = React.useState(0);
  const [bounds, setBounds] = React.useState({ step: 0, max: 0 });
  const count = PRESS.quotes.length;

  React.useEffect(() => {
    const measure = () => {
      const t = track.current;
      const v = viewport.current;
      if (!t || !v) return;
      const first = t.children[0] as HTMLElement | undefined;
      const second = t.children[1] as HTMLElement | undefined;
      const step = first && second ? second.offsetLeft - first.offsetLeft : 0;
      setBounds({ step, max: Math.max(0, t.scrollWidth - v.clientWidth) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewport.current) ro.observe(viewport.current);
    return () => ro.disconnect();
  }, []);

  const lastReachable = bounds.step ? Math.min(count - 1, Math.ceil(bounds.max / bounds.step)) : 0;

  const go = React.useCallback(
    (next: number, velocity = 0) => {
      const i = Math.max(0, Math.min(lastReachable, next));
      setIndex(i);
      const target = -Math.min(i * bounds.step, bounds.max);
      animate(
        x,
        target,
        reduce
          ? { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
          : { type: "spring", duration: 0.55, bounce: 0.15, velocity },
      );
    },
    [bounds, lastReachable, reduce, x],
  );

  // Garde la carte courante en place quand la largeur change.
  React.useEffect(() => {
    x.set(-Math.min(index * bounds.step, bounds.max));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds]);

  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label={PRESS.carouselLabel}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div ref={viewport} className="overflow-hidden">
        <motion.ul
          ref={track}
          drag="x"
          style={{ x, touchAction: "pan-y" }}
          dragConstraints={{ left: -bounds.max, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (!bounds.step) return;
            const projected = x.get() + info.velocity.x * 0.25;
            go(Math.round(-projected / bounds.step), info.velocity.x);
          }}
          className="flex cursor-grab gap-5 select-none active:cursor-grabbing"
        >
          {PRESS.quotes.map((q, i) => (
            <li
              key={q.author}
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${count}`}
              className="w-[min(85vw,26rem)] shrink-0"
            >
              <figure className="flex h-full flex-col justify-between gap-10 rounded-lg border border-border bg-card p-8 text-card-foreground">
                <blockquote className="font-heading text-2xl leading-snug text-pretty">
                  <p>{`«\u00a0${q.quote}\u00a0»`}</p>
                </blockquote>
                <figcaption className="text-sm">
                  <span className="block font-medium">{q.author}</span>
                  <span className="text-muted-foreground">{q.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </motion.ul>
      </div>
      <div className="mt-8 flex items-center justify-between gap-4">
        <p aria-live="polite" className="font-mono text-sm tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
          <span className="opacity-60"> / {String(count).padStart(2, "0")}</span>
          <span className="ml-4 hidden sm:inline">{PRESS.hint}</span>
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" aria-label={PRESS.previous} disabled={index === 0} onClick={() => go(index - 1)}>
            <ArrowLeft aria-hidden />
          </Button>
          <Button variant="outline" size="icon" aria-label={PRESS.next} disabled={index >= lastReachable} onClick={() => go(index + 1)}>
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Press() {
  return (
    <section id="presse" className="overflow-hidden border-y border-border bg-muted/50 py-section">
      <div className="mx-auto w-full max-w-6xl px-6">
        <RevealText
          text={PRESS.title}
          className="text-balance font-heading text-4xl font-normal tracking-[-0.02em] sm:text-6xl"
        />
      </div>
      <Reveal delay={120} className="mt-10">
        <Marquee />
      </Reveal>
      <Reveal delay={240} className="mx-auto mt-12 w-full max-w-6xl px-6">
        <Testimonials />
      </Reveal>
    </section>
  );
}
