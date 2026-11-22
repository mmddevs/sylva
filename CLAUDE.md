@AGENTS.md

# Sylva — site vitrine (Next.js 16 + Tailwind v4 + shadcn)

Site d'un atelier de paysage fictif. Accueil : hero → carousel (#work) → Séries (#series) → Atelier (#atelier) → Parcours (#parcours) → Matière (#matiere) → Presse (#presse) → FAQ (#faq) → Contact (#contact, formulaire) → footer. Pages `/series/[slug]` (statiques), `not-found`, `sitemap`, `robots`.
Langue du site et des textes : **français** (espaces insécables avant ? ! : ; et dans « »).

## Commandes

- `npm run dev` : serveur de dev (l'utilisateur le lance lui-même ; ne le laisse pas tourner en fond après tes tests)
- `npx tsc --noEmit` et `npx eslint src` : à passer avant de dire que c'est fini
- `npx next build` : vérification finale
- `node scripts/canonical-classes.mjs` : liste les classes Tailwind non canoniques (jaunes dans VS Code) ; `--write` les corrige. Doit afficher « 0 suggestion(s) ».
- `.vscode/settings.json` : `*.css` en mode `tailwindcss` et `css.lint.unknownAtRules: ignore` (sinon `@theme`, `@custom-variant`, `@apply` ressortent en jaune).
- `/dev/break-ui?data=demo|worst|empty|one` : données extrêmes (dev seulement, 404 en prod)

## Thème « Passe-partout » (voir [DESIGN.md](DESIGN.md))

1. **Tout vit dans [src/app/globals.css](src/app/globals.css)** : couleurs OKLCH (`:root` = papier baryté, `.dark` = chambre noire), `--sun` (la seule couleur chaude, en point ou filet, jamais en aplat), ombres `shadow-print` / `shadow-lift`, `py-section`, courbes `ease-out` / `ease-in-out` / `ease-(--ease-drawer)`, durées `--duration-press|ui|move|reveal`. Pas de valeur en dur dans les composants.
2. **Polices** (`next/font`, layout) : `font-heading` Newsreader (titres, italique pour l'accent), `font-sans` Hanken Grotesk, `font-mono` Geist Mono (données mesurées seulement, `tabular-nums`).
3. **Thème clair/sombre** : script anti-flash [src/lib/theme-script.ts](src/lib/theme-script.ts) dans `<head>`, `useTheme` / `setTheme` / `useThemeTokens` dans [src/components/theme/theme.ts](src/components/theme/theme.ts). Les canvas (footer) reçoivent les tokens convertis en hex à l'exécution ; le carousel WebGL lit `bg-background` / `text-foreground` calculés.
4. **Structure d'une section** : `mx-auto w-full max-w-6xl px-6 py-section`, titre `RevealText` en `font-heading text-4xl sm:text-6xl font-normal tracking-[-0.02em]`, texte `text-pretty text-muted-foreground`, carte `rounded-lg border border-border bg-card p-6`. **Pas de surtitre (kicker)**, pas de numéros de section décoratifs.
5. **Boutons** : [`Button`](src/components/ui/button.tsx) (pastille `rounded-full`, appui `scale-[0.97]`). Lien : `<Button nativeButton={false} render={<Link href="…" />}>`. Icônes `lucide-react`, classes via `cn()`.

## Mouvement (règles retenues)

- **Un seul système d'apparition** : [src/components/reveal.tsx](src/components/reveal.tsx) — `Reveal` (`rise` | `fade` | `unveil` | `draw-x`, `delay` échelonné 100–150 ms), `RevealText` (mots), `Rule` (filet qui se dessine), `useInView`. CSS dans `globals.css` (`[data-reveal]`).
- Hero : entrée chorégraphiée en CSS (`.hero-in`, `--hero-delay`), timeline commentée dans [hero.tsx](src/components/hero.tsx). Lié au scroll : `.scroll-exit`, `.scroll-parallax`, `.scroll-draw-y` (CSS scroll-driven, ignoré sans support ou en reduced motion).
- Ressorts / drag / layout : `motion` (`motion/react`). Compteurs : `@number-flow/react` via [Counter](src/components/motion/counter.tsx). Toasts : `sonner` ([AppToaster](src/components/app-toaster.tsx)). Pointeur : `Magnetic` et `PointerHalo` ([pointer.tsx](src/components/motion/pointer.tsx)), souris uniquement.
- View transitions React : morph `series-<slug>` (grille → détail, `share="morph"`), `page-enter`/`page-exit`. Garder `data-scroll-behavior="smooth"` sur `<html>`.
- `transform`/`opacity` (+ `clip-path` pour dévoiler, hauteur pour l'accordéon). Entrées `ease-out`. UI < 300 ms. Rien au clavier ni sur la nav. `motion-reduce:` partout. En Tailwind v4, `translate-*`/`scale-*`/`rotate-*` sont des propriétés à part : écrire `transition-[translate,scale,…]`, pas `transform`.

## Responsive (téléphone / tablette)

Mobile-first, breakpoints Tailwind par défaut : `sm` 640 (séries en 2 colonnes), `md` 768 (nav complète au lieu du menu), `lg` 1024 (séries en 3 colonnes, mise en page bureau). Testé à 320, 360, 375, 390, 430, 768, 1024 et en paysage (812×375).
- **Tactile** : zones ≥ 44 px (`h-11`), texte ≥ 12 px, champs à 16 px (pas de zoom iOS), hauteurs en `svh` (jamais `vh`), zones sûres (`env(safe-area-inset-*)` : barre, menu, `body` en paysage). Survols seulement derrière `hover:` (Tailwind v4 le limite à `(hover: hover)`).
- **Hero** : sous 640 px de large, tuiles « portrait » (`compactBelow`, `compactAspectRatio`, `compactTileHeight`, `compactAxis`) ; la description disparaît sur les écrans courts (< 700 px en portrait, < 620 px en général) pour ne pas se superposer aux images.
- **Footer** : 3 colonnes sous 1024 px, 2 sous 560 px, liens à 44 px quand `pointer: coarse`, hauteur 600 px sur téléphone (`max-sm:h-150!`).
- **Séries** : cartes « hautes » (4/5) seulement en 1 colonne et en 3 colonnes ; en 2 colonnes toutes en 3/2 pour des rangées alignées.
- Vérification : mesurer débordements horizontaux, cibles < 44 px et textes < 11,5 px à chaque largeur avant de dire que c'est fini.

## Contenu et images

- Textes, listes, URLs : [src/lib/site.ts](src/lib/site.ts) (`SITE`, `NAV`, `HERO_IMAGES`, `WORK_ITEMS`, `SERIES`, `CATEGORIES`, `ATELIER`, `FIGURES`, `MATIERE`, `PRESS`, `FAQ`, `CONTACT`, `FOOTER*`, `NOT_FOUND`). Validation du formulaire : [src/lib/contact.ts](src/lib/contact.ts), Server Action simulée : [src/app/actions.ts](src/app/actions.ts) (`#echec` dans le message simule une erreur serveur).
- Images : **locales**, en WebP dans `public/images/` (`<nom>.webp` 1600 px, `<nom>-sm.webp` 1000 px pour hero et carousel), référencées par `photo("nom", "sm")` dans `site.ts`. Pour en ajouter : une ligne dans [scripts/fetch-images.mjs](scripts/fetch-images.mjs) (vérifier que l'ID Unsplash répond 200), puis `node scripts/fetch-images.mjs <nom>`. Image de partage : `public/og.jpg` (1200×630, `SITE.ogImage`). `next/image` partout sauf dans les composants fournis.
- **Classes Tailwind canoniques** (l'extension VS Code les signale en jaune) : `z-70` et non `z-[70]`, `h-svh`, `max-w-136`, `rounded-lg!` (le `!` à la fin), `aspect-video`… En cas de doute, écrire la valeur arbitraire puis laisser le quick-fix de l'extension, ou lancer `node scripts/canonical-classes.mjs --write`.

## Composants fournis (à modifier avec précaution)

- `tilted-grid-hero.tsx` : hero cylindre CSS 3D, via [hero.tsx](src/components/hero.tsx). Modifié : `fitBend` réduit la courbure (`curve`) pour que le bord extérieur d'une tuile reste sous 112° (la caméra est à 126,9° : au-delà les facettes explosent et traversent le hero comme un éclair) ; les tranches se chevauchent de 50 % + 1 px (sinon des coutures scintillent aux extrémités).
- `dither-helix-carousel.tsx` : carousel WebGL **fini** (première → dernière carte, pas de boucle infinie). Sur le site il est **épinglé** : [Work](src/components/sections/work.tsx) = section haute (100svh + 7 × 60svh) avec un cadre `sticky h-svh` ; le défilement de la page (prop `scrollTarget`) fait tourner la colonne, chaque carte « s'attarde » (DWELL), puis la page reprend. Molette et glisser sont laissés à la page (`touch-action: pan-y`), flèches et clic scrollent vers la carte. Sans la prop, l'ancien mode molette/glisser (qui rend la molette aux extrémités) reste disponible. `edge` (0 par défaut) règle le flou/grain sur les bords haut et bas : le laisser à 0. Pause hors écran / onglet caché, monté à l'approche via [LazyMount](src/components/lazy-mount.tsx).
- `halftone-wordmark-footer.tsx` : footer canvas, palette fournie par [SiteFooter](src/components/site-footer.tsx) depuis le thème ; prop `backToTopLabel` ajoutée.

Les `<img>` brutes dans ces composants sont voulues : l'avertissement ESLint `no-img-element` y est désactivé ligne par ligne, avec la raison.

## Next.js

- Next 16.4.6, `cacheComponents` et `partialPrefetching` activés, Turbopack avec `root: __dirname`. `images.remotePatterns` autorise `images.unsplash.com`.
- `experimental.agentUpgrade: "security"` est dans la config : ne pas retirer.
- Lire le guide correspondant dans `node_modules/next/dist/docs/` avant d'utiliser une API Next (voir AGENTS.md).

## Skills disponibles (installés au niveau utilisateur, `~/.claude/skills/`)

Pour le design et le mouvement, utiliser `frontend-design`, `tailwind-design-system`, `animate`, `choreograph`, `gestures`, `emil-design-eng`, `impeccable`, `design-taste-frontend`. `review-animations` / `improve-animations` se lancent à la main (`/review-animations`). Pour le code : `systematic-debugging`, `verification-before-completion`, `nextjs-best-practices`, `react-best-practices`. Toujours respecter d'abord les règles ci-dessus : en cas de conflit, ce fichier gagne.
