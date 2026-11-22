"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const SECTION_IDS = [...NAV.links.map((l) => l.id), NAV.cta.id];

/** Section actuellement au centre de l'écran (accueil uniquement). */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!enabled) return;
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return enabled ? active : null;
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [threshold]);
  return scrolled;
}

export function SiteNav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const active = useActiveSection(home);
  const scrolled = useScrolled();
  const [open, setOpen] = React.useState(false);
  const solid = scrolled || !home;

  return (
    <header
      data-solid={solid}
      className={cn(
        "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]",
        "border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-(--duration-ui) ease-out",
        "data-[solid=true]:border-border data-[solid=true]:bg-background/80 data-[solid=true]:backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))]">
        <Link
          href="/"
          aria-label={NAV.home}
          className="-mx-2 rounded-full px-2 py-2 font-heading text-xl tracking-tight italic"
        >
          {SITE.name}
        </Link>

        <nav aria-label={NAV.label} className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center gap-1">
            {NAV.links.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id} className="relative">
                  <Link
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative inline-flex h-11 items-center rounded-full px-3 text-sm",
                      "text-muted-foreground transition-colors duration-(--duration-ui) ease-out hover:text-foreground",
                      isActive && "text-foreground",
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden
                        className="absolute bottom-1.5 left-1/2 -ml-0.75 size-1.5 rounded-full bg-sun"
                        transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            nativeButton={false}
            render={<Link href={NAV.cta.href} />}
            className="hidden h-11 md:inline-flex"
            variant={active === NAV.cta.id ? "outline" : "default"}
          >
            {NAV.cta.label}
          </Button>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              aria-label={NAV.menuOpen}
              className="inline-flex size-11 items-center justify-center rounded-full transition-[background-color,scale] duration-(--duration-ui) ease-out hover:bg-accent active:scale-[0.94] md:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/20 transition-opacity duration-500 ease-drawer data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:duration-150" />
              <Dialog.Popup
                data-lenis-prevent
                className={cn(
                  "fixed inset-x-0 top-0 z-50 flex max-h-svh flex-col overflow-y-auto rounded-b-2xl border-b border-border bg-background",
                  "pt-[env(safe-area-inset-top)] pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lift outline-none",
                  "transition-[translate,opacity] duration-500 ease-drawer",
                  "data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
                  "motion-reduce:duration-150 motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-starting-style:opacity-0 motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-ending-style:opacity-0",
                )}
              >
                <div className="flex h-16 items-center justify-between px-6">
                  <Dialog.Title className="font-heading text-xl italic">
                    {SITE.name}
                  </Dialog.Title>
                  <Dialog.Close
                    aria-label={NAV.menuClose}
                    className="-mr-2 inline-flex size-11 items-center justify-center rounded-full transition-[background-color,scale] duration-(--duration-ui) ease-out hover:bg-accent active:scale-[0.94]"
                  >
                    <X aria-hidden className="size-5" />
                  </Dialog.Close>
                </div>
                <nav aria-label={NAV.label} className="px-6 pt-4">
                  <ul className="flex flex-col">
                    {[...NAV.links, NAV.cta].map((link) => (
                      <li key={link.id} className="border-b border-border">
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          aria-current={active === link.id ? "location" : undefined}
                          className="flex min-h-14 items-center justify-between py-3 font-heading text-3xl tracking-tight"
                        >
                          {link.label}
                          {active === link.id && (
                            <span aria-hidden className="size-2 rounded-full bg-sun" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
