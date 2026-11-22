"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/components/theme/theme";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const dark = theme === "dark";
  const label = dark ? NAV.themeToLight : NAV.themeToDark;
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-flex size-11 items-center justify-center rounded-full text-foreground",
        "transition-[background-color,scale] duration-(--duration-ui) ease-out",
        "hover:bg-accent active:scale-[0.94] active:duration-(--duration-press)",
        className,
      )}
    >
      {/* Les deux icônes se croisent : rotation + fondu, 220 ms. Pilotées par
          la classe .dark (posée avant le rendu), donc juste dès le SSR. */}
      <Sun
        aria-hidden
        className={cn(
          "absolute size-[1.15rem] transition-[opacity,rotate,scale] duration-(--duration-ui) ease-out motion-reduce:transition-opacity",
          "-rotate-90 scale-75 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100",
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          "absolute size-[1.05rem] transition-[opacity,rotate,scale] duration-(--duration-ui) ease-out motion-reduce:transition-opacity",
          "rotate-0 opacity-100 dark:rotate-90 dark:scale-75 dark:opacity-0",
        )}
      />
    </button>
  );
}
