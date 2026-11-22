"use client";

import { Accordion } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";
import { Reveal, RevealText } from "@/components/reveal";
import { FAQ } from "@/lib/site";

/* Accordéon Base UI (clavier, aria-expanded/controls fournis). La hauteur du
   panneau est la seule exception tolérée à « transform/opacity » : 220 ms
   ease-out ; le + tourne en ×. Reduced motion : ouverture instantanée. */
export function Faq() {
  return (
    <section id="faq" className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-section lg:grid-cols-[1fr_1.4fr] lg:gap-20">
      <RevealText
        text={FAQ.title}
        className="text-balance font-heading text-4xl font-normal tracking-[-0.02em] sm:text-6xl"
      />
      <Reveal delay={150}>
        <Accordion.Root className="border-t border-border">
          {FAQ.items.map((item) => (
            <Accordion.Item key={item.q} className="border-b border-border">
              <Accordion.Header className="m-0">
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left text-lg transition-colors duration-(--duration-ui) ease-out hover:text-primary">
                  <span className="text-pretty">{item.q}</span>
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border transition-[background-color,border-color] duration-(--duration-ui) group-hover:border-foreground/30 group-data-panel-open:bg-accent">
                    <Plus
                      aria-hidden
                      className="size-4 transition-transform duration-(--duration-ui) ease-out group-data-panel-open:rotate-45 motion-reduce:transition-none"
                    />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height,opacity] duration-(--duration-ui) ease-out data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none">
                <p className="max-w-prose pr-12 pb-6 text-pretty text-muted-foreground">{item.a}</p>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Reveal>
    </section>
  );
}
