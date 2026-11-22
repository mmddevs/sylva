import { Hero } from "@/components/hero";
import { Atelier } from "@/components/sections/atelier";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Figures } from "@/components/sections/figures";
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
      <Atelier />
      <Figures />
      <Matiere />
      <Press />
      <Faq />
      <Contact />
    </main>
  );
}
