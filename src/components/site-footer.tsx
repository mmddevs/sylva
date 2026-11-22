"use client";

import { useThemeTokens } from "@/components/theme/theme";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";
import { FOOTER, FOOTER_COLUMNS, SITE } from "@/lib/site";

/* Le footer canvas veut des hex : on lui passe les tokens du thème courant,
   relus à chaque bascule clair/sombre. Avant la lecture, une réserve de même
   hauteur évite tout saut de mise en page.

   L'année du ©  est lue ici, dans la branche rendue seulement côté client
   (les tokens n'existent qu'après le montage) : `new Date()` ne s'exécute donc
   jamais pendant le prérendu, ce que `cacheComponents` interdit, et l'année se
   met à jour toute seule chaque 1er janvier sans rebuild. */
export function SiteFooter() {
  const tokens = useThemeTokens();
  return (
    <div className="mt-auto">
      {tokens ? (
        <HalftoneWordmarkFooter
          wordmark={SITE.name.toLowerCase()}
          label={SITE.studio}
          meta={`©${new Date().getFullYear()} · ${SITE.metaTail}`}
          columns={FOOTER_COLUMNS}
          palette={{ background: tokens.background, ink: tokens.foreground, warm: tokens.sun }}
          fontFamily={tokens.sans}
          monoFamily={tokens.mono}
          fontWeight={800}
          backToTopLabel={FOOTER.backToTop}
          className="max-sm:h-150!"
        />
      ) : (
        <div aria-hidden className="h-140 bg-background max-sm:h-150" />
      )}
    </div>
  );
}
