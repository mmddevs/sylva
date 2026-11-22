import { FlaskConical, Footprints, Printer } from "lucide-react";
import { Reveal, RevealText, Rule } from "@/components/reveal";
import { MATIERE } from "@/lib/site";

const ICONS = { footprints: Footprints, flask: FlaskConical, printer: Printer } as const;

/* Trois gestes reliés par un filet qui se dessine de gauche à droite ; chaque
   geste monte à son tour (120 ms d'écart, la lecture va de gauche à droite). */
export function Matiere() {
  return (
    <section id="matiere" className="mx-auto w-full max-w-6xl px-6 py-section">
      <RevealText
        text={MATIERE.title}
        className="max-w-3xl text-balance font-heading text-4xl font-normal tracking-[-0.02em] sm:text-6xl"
      />
      <div className="relative mt-16">
        <Rule className="absolute top-[1.375rem] hidden md:block" delay={200} />
        <ol className="grid gap-12 md:grid-cols-3 md:gap-10">
          {MATIERE.steps.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <Reveal as="li" key={step.title} delay={200 + i * 140} className="relative">
                <span className="relative inline-flex size-11 items-center justify-center rounded-full border border-border bg-background text-primary">
                  <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-8 font-heading text-3xl tracking-tight italic">{step.title}</h3>
                <p className="mt-3 max-w-xs text-pretty text-muted-foreground">{step.text}</p>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
