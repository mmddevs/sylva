"use client";

import * as React from "react";
import { THEME_KEY, type Theme } from "@/lib/theme-script";

export type { Theme };

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => mo.disconnect();
}
const read = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

/** Le thème réellement appliqué à <html>. `null` côté serveur. */
export function useTheme() {
  return React.useSyncExternalStore<Theme | null>(subscribe, read, () => null);
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

/* Les canvas (footer) veulent des hex : on lit les tokens calculés et on les
   convertit via un canvas 2D. Aucune couleur n'est écrite ici. */
function toHex(css: string, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000";
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export type ThemeTokens = {
  background: string;
  foreground: string;
  muted: string;
  sun: string;
  sans: string;
  mono: string;
};

export function useThemeTokens(): ThemeTokens | null {
  const theme = useTheme();
  const [tokens, setTokens] = React.useState<ThemeTokens | null>(null);
  React.useEffect(() => {
    if (!theme) return;
    const probe = document.createElement("canvas");
    probe.width = probe.height = 1;
    const ctx = probe.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const s = getComputedStyle(document.documentElement);
    const v = (name: string) => s.getPropertyValue(name).trim();
    const body = getComputedStyle(document.body);
    // Lecture d'un système externe (CSSOM) à chaque changement de thème.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTokens({
      background: toHex(v("--background"), ctx),
      foreground: toHex(v("--foreground"), ctx),
      muted: toHex(v("--muted-foreground"), ctx),
      sun: toHex(v("--sun"), ctx),
      sans: body.fontFamily,
      mono: s.getPropertyValue("--font-geist-mono").trim() || "monospace",
    });
  }, [theme]);
  return tokens;
}
