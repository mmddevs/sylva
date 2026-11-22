import { ContactForm } from "@/components/contact/contact-form";
import { Reveal, RevealText } from "@/components/reveal";
import { CONTACT } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-section lg:grid-cols-[1fr_1.3fr] lg:gap-20">
      <div>
        <RevealText
          text={CONTACT.title}
          className="text-balance font-heading text-5xl font-normal tracking-[-0.02em] sm:text-7xl"
        />
        <Reveal delay={150}>
          <p className="mt-8 max-w-sm text-pretty text-lg text-muted-foreground">{CONTACT.text}</p>
        </Reveal>
      </div>
      <Reveal delay={250}>
        <ContactForm />
      </Reveal>
    </section>
  );
}
