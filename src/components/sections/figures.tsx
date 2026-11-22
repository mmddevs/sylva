import { Counter } from "@/components/motion/counter";
import { Reveal, RevealText, Rule } from "@/components/reveal";
import { FIGURES } from "@/lib/site";

export function Figures() {
  return (
    <section id="parcours" className="border-y border-border bg-muted/50">
      <div className="mx-auto w-full max-w-6xl px-6 py-section">
        <RevealText
          text={FIGURES.title}
          className="max-w-3xl text-balance font-heading text-4xl font-normal tracking-[-0.02em] sm:text-6xl"
        />

        <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {FIGURES.items.map((item, i) => (
            <Reveal as="li" key={item.label} delay={i * 120} className="min-w-0">
              <Rule delay={i * 120} />
              <p className="mt-6 font-heading text-[clamp(2.75rem,6vw,4.5rem)] leading-none tracking-[-0.03em]">
                <Counter value={item.value} />
                {item.suffix}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{item.label}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-24 grid gap-10 lg:grid-cols-[14rem_1fr]">
          <h3 className="font-heading text-2xl italic">{FIGURES.timelineTitle}</h3>
          <ol className="relative">
            {/* La ligne se dessine au fil du scroll (scroll-driven, scaleY). */}
            <span aria-hidden className="absolute top-2 bottom-2 left-1.25 w-px bg-border" />
            <span aria-hidden className="scroll-draw-y absolute top-2 bottom-2 left-1.25 w-px bg-sun" />
            {FIGURES.timeline.map((step, i) => (
              <Reveal as="li" key={step.year} delay={i * 100} className="relative grid gap-1 pb-10 pl-10 last:pb-0 sm:grid-cols-[6rem_1fr] sm:gap-6">
                <span aria-hidden className="absolute top-1.5 left-0 size-2.75 rounded-full border-2 border-sun bg-background" />
                <span className="font-mono text-sm tabular-nums text-muted-foreground">{step.year}</span>
                <p className="max-w-xl text-pretty">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
