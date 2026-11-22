"use client";

import * as React from "react";

/* Monte ses enfants seulement quand le bloc approche de l’écran (marge
   300 px). Sert au carousel WebGL : ses 8 textures ne sont plus téléchargées
   au premier chargement. La hauteur est réservée par le parent (pas de CLS). */
export function LazyMount({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {mounted ? children : null}
    </div>
  );
}
