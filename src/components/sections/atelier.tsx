import Image from "next/image";
import { Reveal, RevealText } from "@/components/reveal";
import { ATELIER } from "@/lib/site";

/* Le cadre se dévoile de bas en haut (clip-path, une fois) ; l'image glisse
   lentement dans son cadre au scroll (parallaxe mesurée : ±6 %, CSS
   scroll-driven, coupée en reduced motion). Le texte, lui, ne bouge pas. */
export function Atelier() {
  return (
    <section
      id="atelier"
      className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-section lg:grid-cols-[1fr_1.05fr] lg:gap-24"
    >
      <div>
        <RevealText
          text={ATELIER.title}
          className="text-balance font-heading text-4xl font-normal tracking-[-0.02em] sm:text-6xl"
        />
        <Reveal delay={150}>
          <p className="mt-8 max-w-[34rem] text-pretty text-lg text-foreground/85">{ATELIER.text}</p>
        </Reveal>
        <Reveal delay={280}>
          <p className="mt-5 max-w-[34rem] text-pretty text-muted-foreground">{ATELIER.text2}</p>
        </Reveal>
      </div>
      <Reveal variant="unveil" className="relative aspect-4/5 overflow-hidden rounded-sm bg-muted shadow-print">
        <div className="scroll-parallax absolute inset-0">
          <Image
            src={ATELIER.image.src}
            alt={ATELIER.image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>
    </section>
  );
}
