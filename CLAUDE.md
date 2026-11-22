@AGENTS.md

# Sylva — site vitrine (Next.js 16 + Tailwind v4 + shadcn)

Site d'un atelier de paysage fictif. Accueil : hero → carousel (#work) → Séries (#series) → Atelier (#atelier) → Parcours (#parcours) → Matière (#matiere) → Presse (#presse) → FAQ (#faq) → Contact (#contact, formulaire) → footer. Pages `/series/[slug]` (statiques), `not-found`, `sitemap`, `robots`.
Langue du site et des textes : **français** (espaces insécables avant ? ! : ; et dans « »).

## Commandes

- `npm run dev` : serveur de dev (l'utilisateur le lance lui-même ; ne le laisse pas tourner en fond après tes tests)
- `npx tsc --noEmit` et `npx eslint src` : à passer avant de dire que c'est fini
- `npx next build` : vérification finale
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

## Contenu et images

- Textes, listes, URLs : [src/lib/site.ts](src/lib/site.ts) (`SITE`, `NAV`, `HERO_IMAGES`, `WORK_ITEMS`, `SERIES`, `CATEGORIES`, `ATELIER`, `FIGURES`, `MATIERE`, `PRESS`, `FAQ`, `CONTACT`, `FOOTER*`, `NOT_FOUND`). Validation du formulaire : [src/lib/contact.ts](src/lib/contact.ts), Server Action simulée : [src/app/actions.ts](src/app/actions.ts) (`#echec` dans le message simule une erreur serveur).
- Images : Unsplash via `unsplash(id, w)`. **Vérifie qu'un ID répond 200** (`curl -I`) avant de l'utiliser. `next/image` partout sauf dans les composants fournis.

## Composants fournis (à modifier avec précaution)

- `tilted-grid-hero.tsx` : hero cylindre CSS 3D, via [hero.tsx](src/components/hero.tsx).
- `dither-helix-carousel.tsx` : carousel WebGL **fini** qui rend la molette à la page (`MIN`/`MAX`, `atEnd`). Ne pas rétablir la boucle infinie. Se met en pause hors écran / onglet caché ; monté à l'approche via [LazyMount](src/components/lazy-mount.tsx).
- `halftone-wordmark-footer.tsx` : footer canvas, palette fournie par [SiteFooter](src/components/site-footer.tsx) depuis le thème ; prop `backToTopLabel` ajoutée.

Les `<img>` brutes dans ces composants sont voulues (avertissements ESLint `no-img-element` acceptés).

## Next.js

- Next 16.4.6, `cacheComponents` et `partialPrefetching` activés, Turbopack avec `root: __dirname`. `images.remotePatterns` autorise `images.unsplash.com`.
- `experimental.agentUpgrade: "security"` est dans la config : ne pas retirer.
- Lire le guide correspondant dans `node_modules/next/dist/docs/` avant d'utiliser une API Next (voir AGENTS.md).

## Skills disponibles (installés au niveau utilisateur, `~/.claude/skills/`)

Pour le design et le mouvement, utiliser `frontend-design`, `tailwind-design-system`, `animate`, `choreograph`, `gestures`, `emil-design-eng`, `impeccable`, `design-taste-frontend`. `review-animations` / `improve-animations` se lancent à la main (`/review-animations`). Pour le code : `systematic-debugging`, `verification-before-completion`, `nextjs-best-practices`, `react-best-practices`. Toujours respecter d'abord les règles ci-dessus : en cas de conflit, ce fichier gagne.
