"use client";

import * as React from "react";
import { useThemeTokens } from "@/components/theme/theme";

/* La barre d'état et le chrome du navigateur prennent la couleur du fond du
   thème actif (lue dans les tokens, pas écrite ici). */
export function ThemeColor() {
  const tokens = useThemeTokens();
  React.useEffect(() => {
    if (!tokens) return;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = tokens.background;
  }, [tokens]);
  return null;
}
