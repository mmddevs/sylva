# Sylva — système visuel « Passe-partout »

## Intention

Un tirage photographique posé dans son passe-partout : papier baryté chaud, encre graphite teintée de forêt, marge généreuse autour de l'image. Le site se comporte comme une boîte de tirages qu'on feuillette, pas comme une plaquette d'agence. L'image mène, l'interface s'efface.

Le mode sombre n'est pas une inversion : c'est la **chambre noire**. Fond vert-noir profond, papier qui sort du bain, et une seule lumière chaude réservée à ce qui est actif.

Ce qui a été écarté : la planche-contact (trop « outil de photographe »), la carte IGN (bruit de lignes), l'herbier (trop décoratif). Ce que la direction garde de la pellicule développée à la main : le grain n'est pas un filtre, il est animé et vit sur toute la page, comme l'émulsion.

## Palette

Tous les tokens vivent dans `src/app/globals.css` (`:root` et `.dark`), en OKLCH. Aucun composant n'écrit de couleur.

| Token | Clair (papier baryté) | Sombre (chambre noire) | Usage |
|---|---|---|---|
| `background` | `oklch(0.968 0.012 88)` papier chaud | `oklch(0.17 0.014 160)` vert-noir | Fond de page |
| `foreground` | `oklch(0.205 0.018 155)` encre forêt | `oklch(0.93 0.015 95)` papier | Texte, titres |
| `card` | `oklch(0.985 0.008 88)` | `oklch(0.205 0.016 160)` | Cartes, panneaux, champs |
| `muted` | `oklch(0.935 0.014 88)` | `oklch(0.235 0.016 160)` | Bandeaux, squelettes |
| `muted-foreground` | `oklch(0.46 0.02 150)` | `oklch(0.74 0.02 120)` | Texte courant secondaire (≥ 4.5:1) |
| `primary` | `oklch(0.34 0.06 152)` mousse profonde | `oklch(0.84 0.08 132)` lichen | Bouton principal, liens actifs |
| `accent` | `oklch(0.91 0.035 132)` lichen pâle | `oklch(0.28 0.03 150)` | Survols, puces de filtres |
| `sun` | `oklch(0.64 0.15 60)` | `oklch(0.79 0.13 70)` | **La lumière** : indicateur de section active, curseur, points chauds du footer. Jamais en aplat. |
| `border` | `oklch(0.87 0.014 88)` | `oklch(1 0 0 / 11%)` | Filets |
| `input` | `oklch(0.62 0.02 130)` | `oklch(0.5 0.02 140)` | Bord des champs (≥ 3:1, WCAG 1.4.11) |
| `ring` | `oklch(0.5 0.1 148)` | `oklch(0.8 0.1 132)` | Focus |
| `destructive` | `oklch(0.52 0.19 28)` | `oklch(0.7 0.17 25)` | Erreurs de formulaire |

Le carousel WebGL et le footer canvas lisent ces tokens à l'exécution (styles calculés), ils suivent donc le thème sans valeur en dur.

## Typographie (`next/font/google`)

- **Titres** : *Newsreader* (variable, axe optique `opsz`), poids 400–500, italique pour l'accent d'un mot. `font-heading`.
- **Texte** : *Hanken Grotesk* (variable), 400/500. `font-sans`. Corps 16–18 px, mesure 60–70 ch.
- **Données** : *Geist Mono*, uniquement pour ce qui se mesure (années, numéros d'édition, compteurs). `font-mono` + `tabular-nums`.

Échelle : `text-sm` 14 · `text-base` 16 · `text-lg` 18 · titres de section `text-4xl → sm:text-6xl` (Newsreader, tracking `-0.02em`), display hero `text-5xl → lg:text-8xl` (max 6 rem). Pas de surtitre (kicker) : le titre porte seul la section.

## Espacement

Base 4 px (Tailwind). Rythme de section : `py-section` = `clamp(6rem, 12vw, 10rem)`. Conteneur : `mx-auto w-full max-w-6xl px-6`. Groupes serrés (gap 2–3), séparations larges (gap 12–20). Plus d'air au-dessus d'un titre qu'en dessous.

## Rayons

Le passe-partout est net : `--radius: 0.375rem`. Photos `rounded-sm`, cartes et champs `rounded-lg`, boutons `rounded-full` (pastille, seule forme ronde du système).

## Ombres

Ombres de tirage posé sur une table, toujours décalées et diffuses :
- `shadow-print` : `0 1px 2px` + `0 12px 32px -16px`, teinte de l'encre.
- `shadow-lift` : la même, plus haute, pour le survol d'une carte liée.

## Mouvement

| Token | Valeur | Usage |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entrées, survols, tout par défaut |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Ce qui se déplace à l'écran |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Menu mobile |
| `--duration-press` | 140 ms | Appui (scale 0.97) |
| `--duration-ui` | 220 ms | Survols, focus, filtres, accordéon |
| `--duration-move` | 400 ms | Morph de vue partagée |
| `--duration-reveal` | 800 ms | Apparition au scroll (une fois par visite) |
| ressort | `{ type: "spring", duration: 0.5, bounce: 0.15 }` | Drag, magnétisme, layout |

Règles :
1. `transform` et `opacity` (plus `clip-path` pour dévoiler une image). Jamais `width/height/top/left`, sauf la hauteur de l'accordéon.
2. Entrées en `ease-out`. Jamais `ease-in`, jamais `scale(0)`.
3. UI courante sous 300 ms ; les apparitions au scroll et l'entrée du hero (vues une fois) ont droit à 800 ms.
4. Rien ne bouge au clavier ni sur ce qui est très fréquent (liens de nav, champs).
5. Survols derrière `@media (hover: hover) and (pointer: fine)`.
6. `prefers-reduced-motion` : opacité seule, pas de délai, pas de parallaxe, grain figé, marquee à l'arrêt, curseur masqué.
7. Tout ce qui se glisse finit sur un ressort qui reprend la vitesse du geste ; tout est interruptible.

## Règles d'usage

- Une seule couleur chaude (`sun`) à l'écran à la fois, en point ou en filet, jamais en fond.
- Les images ne portent pas de légende ; le titre de série est à côté, pas dessous.
- Un seul style de carte (`rounded-lg border bg-card`), une seule paire de boutons (plein mousse / contour).
- Les sélections de texte, le caret et les barres de défilement prennent la palette.
