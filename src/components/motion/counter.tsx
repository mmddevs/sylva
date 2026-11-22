"use client";

import NumberFlow from "@number-flow/react";
import { useInView } from "@/components/reveal";

/* Compteur : part de 0 et monte à sa valeur la première fois qu'il entre à
   l'écran. Chiffres tabulaires, séparateur de milliers français. NumberFlow
   respecte prefers-reduced-motion (saut direct). */
export function Counter({ value, className }: { value: number; className?: string }) {
  const [ref, shown] = useInView<HTMLSpanElement>({ threshold: 0.6 });
  return (
    <span ref={ref} className={className}>
      <NumberFlow
        value={shown ? value : 0}
        locales="fr-FR"
        format={value >= 1_000_000 ? { notation: "compact", maximumFractionDigits: 1 } : undefined}
        className="tabular-nums"
        transformTiming={{ duration: 1100, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }}
        spinTiming={{ duration: 1100, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      />
    </span>
  );
}
