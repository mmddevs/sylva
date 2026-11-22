import Link from "next/link";
import { Reveal, RevealText, Rule } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { NOT_FOUND } from "@/lib/site";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-svh w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-24 pb-16">
      <p className="hero-in font-mono text-sm tabular-nums text-muted-foreground">{NOT_FOUND.code}</p>
      <Rule className="mt-4 max-w-md bg-sun" />
      <RevealText
        as="h1"
        text={NOT_FOUND.title}
        className="mt-10 max-w-3xl text-balance font-heading text-5xl font-normal tracking-[-0.03em] sm:text-7xl"
      />
      <Reveal delay={200}>
        <p className="mt-6 max-w-md text-pretty text-muted-foreground">{NOT_FOUND.text}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="/" />}>{NOT_FOUND.home}</Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/#series" />}>{NOT_FOUND.series}</Button>
        </div>
      </Reveal>
    </main>
  );
}
