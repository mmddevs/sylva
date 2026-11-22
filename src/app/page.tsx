import { Hero } from "@/components/hero";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Figures } from "@/components/sections/figures";
import { Marquee } from "@/components/sections/marquee";
import { Matiere } from "@/components/sections/matiere";
import { Press } from "@/components/sections/press";
import { SeriesSection } from "@/components/sections/series";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <main id="main" className="flex flex-1 flex-col bg-background">
      <Hero />
      <Work />
      <SeriesSection />
      <Figures />
      <Matiere />
      <Marquee />
      <Press />
      <Faq />
      <Contact />
    </main>
  );
}
