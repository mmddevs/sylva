"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/* Réactions au pointeur. Actives uniquement avec une souris
   (hover + pointer fine) et sans prefers-reduced-motion. */

const FINE = "(hover: hover) and (pointer: fine)";
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeMedia(cb: () => void) {
  const a = matchMedia(FINE);
  const b = matchMedia(REDUCED);
  a.addEventListener("change", cb);
  b.addEventListener("change", cb);
  return () => {
    a.removeEventListener("change", cb);
    b.removeEventListener("change", cb);
  };
}

export function useFinePointer() {
  return React.useSyncExternalStore(
    subscribeMedia,
    () => matchMedia(FINE).matches && !matchMedia(REDUCED).matches,
    () => false,
  );
}

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

/** L'enfant se laisse attirer par le pointeur (25 % de l'écart), puis revient
    sur un ressort. Interruptible : le ressort reprend sa vitesse. */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const enabled = useFinePointer();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  if (!enabled) return <span className={cn("inline-flex", className)}>{children}</span>;

  return (
    <motion.span
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Un anneau de lumière qui suit la souris avec un léger retard (ressort).
    Il s'agrandit et affiche une étiquette sur les éléments [data-cursor]. */
export function PointerHalo() {
  const enabled = useFinePointer();
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 500, damping: 40, mass: 0.4 });
  const y = useSpring(my, { stiffness: 500, damping: 40, mass: 0.4 });
  const [label, setLabel] = React.useState<string | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, mx, my]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70]"
      style={{ x, y }}
    >
      <div
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border-2 border-sun",
          "transition-[scale,opacity,background-color] duration-(--duration-ui) ease-out",
          label
            ? "size-20 scale-100 bg-sun/90 opacity-100"
            : "size-20 scale-[0.35] bg-transparent",
          visible ? (label ? "opacity-100" : "opacity-70") : "opacity-0",
        )}
      >
        <span
          className={cn(
            "font-mono text-[0.7rem] tracking-wide text-foreground uppercase transition-opacity duration-(--duration-ui) dark:text-background",
            label ? "opacity-100" : "opacity-0",
          )}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}
