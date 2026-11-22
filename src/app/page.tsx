import { Hero } from "@/components/hero";
import { Atelier } from "@/components/sections/atelier";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Figures } from "@/components/sections/figures";
import { Matiere } from "@/components/sections/matiere";
import { Press } from "@/components/sections/press";
import { SeriesSection } from "@/components/sections/series";
import { LazyMount } from "@/components/lazy-mount";
import DitherHelixCarousel from "@/components/ui/dither-helix-carousel";
import { WORK, WORK_ITEMS } from "@/lib/site";

export default function Home() {
  return (
    <main id="main" className="flex flex-1 flex-col bg-background">
        <Hero />
        <section id="work" aria-label={WORK.title} className="h-[100svh] min-h-[560px]">
          <LazyMount className="h-full w-full bg-background">
            <DitherHelixCarousel items={WORK_ITEMS} brand={WORK.title} className="h-full w-full" />
          </LazyMount>
        </section>
        <SeriesSection />
        <Atelier />
        <Figures />
        <Matiere />
        <Press />
        <Faq />
        <Contact />
    </main>
  );
}
