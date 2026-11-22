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

type CursorKind = "idle" | "link" | "label" | "text";

const TEXT_FIELD =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';
const CLICKABLE =
  'a[href], button:not(:disabled), [role="button"], summary, select, label';

/* Taille et opacité de chaque état. Le rond mesure 2 rem au repos ; l'échelle
   (jamais sous 0.6) et l'opacité sont les seules propriétés animées. */
const LOOK: Record<CursorKind, { scale: number; pressed: number; opacity: number }> = {
  idle: { scale: 1, pressed: 0.8, opacity: 0.85 },
  link: { scale: 1.9, pressed: 1.6, opacity: 0.35 },
  label: { scale: 2.6, pressed: 2.3, opacity: 1 },
  text: { scale: 0.6, pressed: 0.6, opacity: 0 },
};

/** Un rond plein qui suit la souris avec un léger retard (ressort). La flèche
    système reste visible par-dessus. Il grossit et s'éclaircit sur ce qui se
    clique, se resserre à l'appui, s'efface dans les champs de saisie, et
    affiche une étiquette sur les éléments [data-cursor="…"]. Souris
    seulement : absent au toucher et avec prefers-reduced-motion. */
export function CursorDisc() {
  const enabled = useFinePointer();
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 420, damping: 36, mass: 0.5 });
  const y = useSpring(my, { stiffness: 420, damping: 36, mass: 0.5 });
  const placed = React.useRef(false);
  const [kind, setKind] = React.useState<CursorKind>("idle");
  const [label, setLabel] = React.useState<string | null>(null);
  const [pressed, setPressed] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX);
      my.set(e.clientY);
      // Première position : le rond naît sous la souris au lieu d'y voler.
      if (!placed.current) {
        placed.current = true;
        x.jump(e.clientX);
        y.jump(e.clientY);
      }
      setVisible(true);
      const target = e.target as Element | null;
      const named = target?.closest?.("[data-cursor]");
      setLabel(named ? named.getAttribute("data-cursor") : null);
      setKind(
        named
          ? "label"
          : target?.closest?.(TEXT_FIELD)
            ? "text"
            : target?.closest?.(CLICKABLE)
              ? "link"
              : "idle",
      );
    };
    const down = (e: PointerEvent) => e.pointerType === "mouse" && setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, mx, my, x, y]);

  if (!enabled) return null;

  const look = LOOK[kind];
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-70"
      style={{ x, y }}
    >
      <div
        className={cn(
          "absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun",
          "transition-[scale,opacity] ease-out motion-reduce:transition-none",
          pressed ? "duration-(--duration-press)" : "duration-(--duration-ui)",
        )}
        style={{
          scale: visible ? (pressed ? look.pressed : look.scale) : 0.6,
          opacity: visible ? look.opacity : 0,
        }}
      />
      {/* L'étiquette n'est pas mise à l'échelle : le texte reste net. */}
      <span
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 font-mono text-xs tracking-wide whitespace-nowrap text-primary-foreground uppercase transition-opacity duration-(--duration-ui) ease-out motion-reduce:transition-none",
          label && visible ? "opacity-100" : "opacity-0",
        )}
      >
        {label}
      </span>
    </motion.div>
  );
}
