"use client";

import { useThemeTokens } from "@/components/theme/theme";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";
import { FOOTER, FOOTER_COLUMNS, SITE } from "@/lib/site";

/* Le footer canvas veut des hex : on lui passe les tokens du thème courant,
   relus à chaque bascule clair/sombre. Avant la lecture, une réserve de même
   hauteur évite tout saut de mise en page. */
export function SiteFooter() {
  const tokens = useThemeTokens();
  return (
    <div className="mt-auto">
      {tokens ? (
        <HalftoneWordmarkFooter
          wordmark={SITE.name.toLowerCase()}
          label={SITE.studio}
          meta={SITE.meta}
          columns={FOOTER_COLUMNS}
          palette={{ background: tokens.background, ink: tokens.foreground, warm: tokens.sun }}
          fontFamily={tokens.sans}
          monoFamily={tokens.mono}
          fontWeight={800}
          backToTopLabel={FOOTER.backToTop}
        />
      ) : (
        <div aria-hidden className="h-[560px] bg-background" />
      )}
    </div>
  );
}
