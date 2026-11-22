/* Tout le contenu du site : textes, listes, URLs d'images.
   Les composants ne contiennent aucun texte éditorial. */

export const SITE = {
  name: "Sylva",
  studio: "Sylva Atelier",
  url: "https://sylva.example",
  /** Fin de la ligne de copyright ; l'année est calculée dans SiteFooter. */
  metaTail: "Forêt / Lumière",
  tagline: "La forêt,\nramenée à la lumière.",
  description:
    "Atelier de paysage photographique. Des séries nées d’une marche, développées lentement, imprimées sur papier baryté.",
  /** Image de partage (Open Graph / Twitter), 1200×630, public/og.jpg. */
  ogImage: { src: "/og.jpg", alt: "Sous-bois baigné de lumière dorée" },
  heroCta: { label: "Voir les séries", href: "/#series" },
  heroSecondary: { label: "Commander un tirage", href: "/#contact" },
  scrollCue: "Faire défiler",
  skipLink: "Aller au contenu",
} as const;

/* Photos Unsplash téléchargées et converties en WebP dans public/images/
   (voir scripts/fetch-images.mjs). "sm" = 1000 px (hero, carousel). */
const photo = (name: string, size: "full" | "sm" = "full") =>
  `/images/${name}${size === "sm" ? "-sm" : ""}.webp`;

export type Img = { src: string; alt: string };

export const NAV = {
  label: "Navigation principale",
  links: [
    { id: "work", label: "Œuvre", href: "/#work" },
    { id: "series", label: "Séries", href: "/#series" },
    { id: "presse", label: "Presse", href: "/#presse" },
    { id: "faq", label: "Questions", href: "/#faq" },
  ],
  cta: { id: "contact", label: "Contact", href: "/#contact" },
  menuOpen: "Ouvrir le menu",
  menuClose: "Fermer le menu",
  themeToLight: "Passer en thème clair",
  themeToDark: "Passer en thème sombre",
  home: "Sylva, retour à l’accueil",
} as const;

export const HERO_IMAGES: Img[] = [
  { src: photo("sous-bois-lumiere", "sm"), alt: "Sous-bois baigné de lumière" },
  { src: photo("lac-aube", "sm"), alt: "Lac de montagne au petit jour" },
  { src: photo("foret-brume", "sm"), alt: "Forêt dans la brume" },
  { src: photo("collines-brouillard", "sm"), alt: "Collines dans le brouillard" },
  { src: photo("cascade", "sm"), alt: "Cascade entre les roches" },
  { src: photo("montagnes-aube", "sm"), alt: "Montagnes au lever du jour" },
  { src: photo("prairie-soleil", "sm"), alt: "Prairie au soleil levant" },
  { src: photo("sous-bois-fougeres", "sm"), alt: "Sous-bois brumeux et fougères" },
  { src: photo("montagne-or", "sm"), alt: "Montagne dans la lumière dorée" },
  { src: photo("maison-lac", "sm"), alt: "Maison au bord du lac" },
];

export const WORK = {
  title: "L’œuvre, tirage après tirage.",
  hint: "Molette, glisser ou flèches pour parcourir",
};

export const WORK_ITEMS = [
  { image: photo("lac-aube", "sm"), title: "Lac d’altitude" },
  { image: photo("sous-bois-lumiere", "sm"), title: "Canopée" },
  { image: photo("foret-brume", "sm"), title: "Brume" },
  { image: photo("cascade", "sm"), title: "Cascade" },
  { image: photo("montagnes-aube", "sm"), title: "Vallée" },
  { image: photo("collines-brouillard", "sm"), title: "Crête" },
  { image: photo("montagne-or", "sm"), title: "Soleil" },
  { image: photo("sous-bois-fougeres", "sm"), title: "Mousse" },
];

/* ── Séries ─────────────────────────────────────────────────────── */

export const CATEGORIES = [
  { id: "foret", label: "Forêt" },
  { id: "brume", label: "Brume" },
  { id: "eau", label: "Eau" },
  { id: "altitude", label: "Altitude" },
  { id: "lumiere", label: "Lumière" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Series = {
  slug: string;
  title: string;
  category: CategoryId;
  year: number;
  place: string;
  prints: number;
  summary: string;
  text: string[];
  cover: Img;
  images: Img[];
};

export const SERIES: Series[] = [
  {
    slug: "canopee",
    title: "Canopée",
    category: "foret",
    year: 2025,
    place: "Forêt de Tronçais",
    prints: 14,
    summary: "La tête levée, une saison entière sous les chênes.",
    text: [
      "Quatorze images prises la tête renversée, d’avril à octobre, sous les mêmes chênes. Le cadre ne change pas : seule la lumière traverse.",
      "Les tirages sont faits sur un papier baryté mat qui garde la profondeur des verts sans les saturer.",
    ],
    cover: { src: photo("cimes-vues-du-sol"), alt: "Cimes des arbres vues depuis le sol" },
    images: [
      { src: photo("sous-bois-lumiere"), alt: "Rayons de soleil dans un sous-bois" },
      { src: photo("hetraie"), alt: "Hêtraie au soleil rasant, sol couvert de mousse" },
      { src: photo("pinede-contre-jour"), alt: "Pinède à contre-jour" },
      { src: photo("troncs-sous-bois"), alt: "Troncs hauts dans un sous-bois sombre" },
    ],
  },
  {
    slug: "brume-basse",
    title: "Brume basse",
    category: "brume",
    year: 2024,
    place: "Monts du Forez",
    prints: 9,
    summary: "Les vallées avant le lever, quand le relief se dissout.",
    text: [
      "Neuf matins à attendre que le brouillard se pose dans les vallées. On ne voit plus que les crêtes de sapins, comme des îles.",
      "Le grain est volontairement poussé au développement : la brume devient matière.",
    ],
    cover: { src: photo("vallee-brumeuse"), alt: "Vallée boisée noyée de brouillard" },
    images: [
      { src: photo("coniferes-brume"), alt: "Forêt de conifères sous la brume, vue d’en haut" },
      { src: photo("foret-brume"), alt: "Forêt dans la brume" },
      { src: photo("riviere-sapins"), alt: "Rivière calme entre les sapins dans le brouillard" },
      { src: photo("collines-brouillard"), alt: "Collines dans le brouillard" },
    ],
  },
  {
    slug: "lac-d-altitude",
    title: "Lac d’altitude",
    category: "eau",
    year: 2023,
    place: "Haute-Savoie",
    prints: 12,
    summary: "Des miroirs à deux mille mètres, à l’heure où l’air ne bouge pas.",
    text: [
      "Douze lacs atteints à pied, photographiés dans la première heure du jour, quand l’eau tient encore le reflet.",
      "Chaque tirage porte le nom du lac et l’altitude au dos, au crayon.",
    ],
    cover: { src: photo("lac-aube"), alt: "Lac de montagne au petit jour" },
    images: [
      { src: photo("lac-glaciaire"), alt: "Lac glaciaire entre deux parois rocheuses" },
      { src: photo("lac-turquoise"), alt: "Lac turquoise au pied de sommets rosis" },
      { src: photo("sapins-lac"), alt: "Sapins au bord d’un lac de montagne, lumière dorée" },
      { src: photo("cascade"), alt: "Cascade entre les roches" },
    ],
  },
  {
    slug: "cretes",
    title: "Crêtes",
    category: "altitude",
    year: 2024,
    place: "Alpes du Sud",
    prints: 11,
    summary: "La ligne des sommets, du rouge du soir au gris de l’orage.",
    text: [
      "Une seule ligne d’horizon, suivie sur onze jours de marche. Le soir la teinte, l’orage l’efface.",
      "Les tirages les plus sombres sont faits en noir et blanc, sur papier chaud.",
    ],
    cover: { src: photo("crete-rouge"), alt: "Crête rocheuse rougie par le soleil couchant" },
    images: [
      { src: photo("montagnes-aube"), alt: "Montagnes au lever du jour, au-dessus des nuages" },
      { src: photo("cretes-couchant"), alt: "Crêtes en couches au coucher du soleil" },
      { src: photo("sommets-enneiges"), alt: "Sommets enneigés sous les nuages" },
      { src: photo("sommet-nuages"), alt: "Sommet dans les nuages, en noir et blanc" },
    ],
  },
  {
    slug: "prairies",
    title: "Prairies",
    category: "lumiere",
    year: 2022,
    place: "Aubrac",
    prints: 8,
    summary: "L’herbe haute, un arbre seul, et le soleil qui rase.",
    text: [
      "Huit images de plateau, à l’heure dorée. Ce qui compte ici, c’est la lumière rasante qui sculpte l’herbe.",
      "Série tirée en petit format, pour être tenue à la main.",
    ],
    cover: { src: photo("prairie-soleil"), alt: "Prairie au soleil levant" },
    images: [
      { src: photo("arbre-prairie"), alt: "Arbre isolé dans une prairie" },
      { src: photo("coquelicots"), alt: "Coquelicots dans les herbes hautes" },
      { src: photo("montagne-or"), alt: "Montagne dans la lumière dorée" },
    ],
  },
  {
    slug: "nuit-claire",
    title: "Nuit claire",
    category: "altitude",
    year: 2025,
    place: "Pyrénées",
    prints: 6,
    summary: "Les poses longues sous la Voie lactée, loin de toute ville.",
    text: [
      "Six poses de plusieurs minutes, au-dessus de 2 000 mètres. Le ciel bouge, la montagne ne bouge pas.",
    ],
    cover: { src: photo("voie-lactee"), alt: "Voie lactée au-dessus de sommets enneigés" },
    images: [
      { src: photo("vallee-alpine"), alt: "Vallée alpine entre sapins et sommets enneigés" },
      { src: photo("falaise-granit"), alt: "Falaise de granit au-dessus d’une vallée boisée" },
    ],
  },
  {
    slug: "sentiers",
    title: "Sentiers",
    category: "foret",
    year: 2023,
    place: "Vosges",
    prints: 10,
    summary: "Les chemins qui entrent dans le bois, et ce qu’ils laissent voir.",
    text: [
      "Dix images de passages : une passerelle, une route vue du ciel, un tapis de mousse. Le chemin est toujours le sujet.",
    ],
    cover: { src: photo("passerelle"), alt: "Passerelle en bois qui entre dans la forêt" },
    images: [
      { src: photo("route-foret"), alt: "Route sinueuse dans une forêt dense, vue du ciel" },
      { src: photo("sous-bois-fougeres"), alt: "Sous-bois brumeux et fougères" },
    ],
  },
];

export const SERIES_SECTION = {
  title: "Chaque série, une marche.",
  intro:
    "Des forêts, des lacs, des crêtes : chaque série naît d’un lieu et d’une saison. Survolez-en une pour l’ouvrir, touchez-la deux fois sur un écran tactile.",
  printsLabel: (n: number) => `${n} tirage${n > 1 ? "s" : ""}`,
} as const;

export const SERIES_PAGE = {
  back: "Toutes les séries",
  place: "Lieu",
  year: "Année",
  prints: "Tirages",
  category: "Paysage",
  previous: "Série précédente",
  next: "Série suivante",
  cta: "Commander un tirage de cette série",
  neighbours: "Séries voisines",
} as const;

/* ── Chiffres et parcours ───────────────────────────────────────── */

export const FIGURES = {
  title: "Neuf ans de marche, en quelques chiffres.",
  items: [
    { value: 24, label: "séries publiées", suffix: "" },
    { value: 11, label: "massifs parcourus", suffix: "" },
    { value: 3180, label: "kilomètres à pied", suffix: "" },
    { value: 412, label: "tirages vendus", suffix: "" },
  ],
  timelineTitle: "Parcours",
  timeline: [
    { year: 2017, text: "Premières marches dans le Morvan, avec une chambre 4×5 empruntée." },
    { year: 2019, text: "Ouverture du laboratoire. Premiers tirages sur papier baryté." },
    { year: 2022, text: "Exposition « Prairies » à Rodez. Première commande d’une collectivité." },
    { year: 2024, text: "« Brume basse » entre dans une collection publique." },
    { year: 2026, text: "Vingt-quatre séries, et un atelier ouvert sur rendez-vous." },
  ],
} as const;

/* ── Défilement des séries (marquee diagonal) ──────────────────── */

export const MARQUEE = {
  title: "Le résultat, série après série.",
  text: "Des forêts, des lacs, des crêtes : chaque série garde la lenteur de la marche qui l’a fait naître.",
  cta: { label: "Voir toutes les séries", href: "/#series" },
} as const;

/* ── Matière ────────────────────────────────────────────────────── */

export const MATIERE = {
  title: "Trois gestes, du terrain à l’image.",
  steps: [
    {
      icon: "footprints",
      title: "Marcher",
      text: "Repérer le lieu, attendre la bonne heure et laisser le paysage choisir le cadre.",
    },
    {
      icon: "flask",
      title: "Développer",
      text: "Travailler la lumière en laboratoire, couche après couche, jusqu’à la juste densité.",
    },
    {
      icon: "printer",
      title: "Imprimer",
      text: "Faire entrer le grain dans l’image, comme une trame qui se dissout dans le papier.",
    },
  ],
} as const;

/* ── Presse et témoignages (publications fictives) ─────────────── */

export const PRESS = {
  title: "Ce qu’on en dit.",
  marqueeLabel: "Publications ayant parlé de l’atelier",
  outlets: ["Revue Sylvestre", "Carnets d’images", "Le Grain", "Atlas lent", "Lumière rasante", "Papier & Sel"],
  carouselLabel: "Témoignages",
  previous: "Témoignage précédent",
  next: "Témoignage suivant",
  hint: "Glisser pour parcourir",
  quotes: [
    {
      quote: "Des images qui obligent à ralentir. On reste devant « Brume basse » bien plus longtemps qu’on ne l’avait prévu.",
      author: "Claire Vasseur",
      role: "Revue Sylvestre",
    },
    {
      quote: "Le grain n’est jamais un effet : il fait partie du paysage, comme la mousse fait partie de la pierre.",
      author: "Rémi Delmas",
      role: "Le Grain",
    },
    {
      quote: "Nous avons commandé six tirages pour la médiathèque. Les visiteurs s’assoient pour les regarder.",
      author: "Inès Moreau",
      role: "Médiathèque de Saint-Flour",
    },
    {
      quote: "Une rigueur de laboratoire au service d’un regard très doux. Les tirages sont d’une profondeur rare.",
      author: "Jun Takahashi",
      role: "Atlas lent",
    },
    {
      quote: "Un atelier qui prend le temps de vous expliquer pourquoi un papier plutôt qu’un autre.",
      author: "Bastien Leroy",
      role: "Collectionneur",
    },
  ],
} as const;

/* ── FAQ ────────────────────────────────────────────────────────── */

export const FAQ = {
  title: "Questions fréquentes.",
  items: [
    {
      q: "Quels formats de tirage proposez-vous ?",
      a: "Trois formats par série : 30 × 40, 50 × 70 et 80 × 120 cm. Chaque format est limité à quinze exemplaires numérotés et signés.",
    },
    {
      q: "Sur quel papier imprimez-vous ?",
      a: "Sur papier baryté fibre, mat ou satiné selon la série. Les tirages pigmentaires sont garantis plus de cent ans dans des conditions d’exposition normales.",
    },
    {
      q: "Les tirages sont-ils encadrés ?",
      a: "Ils sont livrés sous passe-partout, dans une boîte d’archive. L’encadrement en chêne est possible sur demande, comptez trois semaines.",
    },
    {
      q: "Acceptez-vous les commandes sur mesure ?",
      a: "Oui, pour des lieux publics, des entreprises ou des particuliers. Nous commençons toujours par une marche sur place.",
    },
    {
      q: "Quels sont les délais de livraison ?",
      a: "Deux semaines pour un tirage en stock, quatre à six semaines pour un tirage à la demande. Livraison en France et en Europe.",
    },
  ],
} as const;

/* ── Contact ────────────────────────────────────────────────────── */

export const CONTACT = {
  title: "Une forêt à raconter ?",
  text: "Écrivez-nous pour une commande, une exposition ou simplement pour dire bonjour. Réponse sous trois jours ouvrés.",
  email: "hello@sylva.example",
  emailLabel: "Ou directement :",
  form: {
    name: { label: "Nom", placeholder: "Camille Martin", autoComplete: "name" },
    email: { label: "E-mail", placeholder: "camille@exemple.fr", autoComplete: "email" },
    subject: {
      label: "Objet",
      options: [
        { value: "tirage", label: "Commander un tirage" },
        { value: "commande", label: "Commande sur mesure" },
        { value: "exposition", label: "Exposition" },
        { value: "autre", label: "Autre" },
      ],
    },
    message: { label: "Message", placeholder: "Le lieu, le format, l’idée…" },
    submit: "Envoyer le message",
    sending: "Envoi en cours…",
    sent: "Message envoyé",
    successTitle: "Merci, votre message est parti.",
    successText: "Nous vous répondons sous trois jours ouvrés.",
    again: "Écrire un autre message",
    serverError: "Le message n’a pas pu partir. Réessayez dans un instant ou écrivez-nous directement.",
  },
  errors: {
    nameRequired: "Indiquez votre nom.",
    nameLong: "Le nom doit faire moins de 80 caractères.",
    emailRequired: "Indiquez votre e-mail pour qu’on puisse vous répondre.",
    emailInvalid: "Cet e-mail ne semble pas valide (exemple : nom@domaine.fr).",
    messageShort: "Votre message doit faire au moins 20 caractères.",
    messageLong: "Votre message doit faire moins de 2 000 caractères.",
  },
} as const;

/* ── Footer ─────────────────────────────────────────────────────── */

export const FOOTER = { backToTop: "Haut de page ↑" } as const;

export const FOOTER_COLUMNS = [
  {
    title: "Œuvre",
    links: [
      { label: "Index", href: "/#work" },
      { label: "Séries", href: "/#series" },
      { label: "Parcours", href: "/#parcours" },
    ],
  },
  {
    title: "Atelier",
    links: [
      { label: "Matière", href: "/#matiere" },
      { label: "Presse", href: "/#presse" },
      { label: "Questions", href: "/#faq" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "hello@sylva.example", href: "mailto:hello@sylva.example" },
      { label: "Nous écrire", href: "/#contact" },
    ],
  },
];

export const NOT_FOUND = {
  code: "404",
  title: "Ce sentier ne mène nulle part.",
  text: "La page a peut-être changé de lieu. Revenez à l’accueil ou parcourez les séries.",
  home: "Retour à l’accueil",
  series: "Voir les séries",
} as const;

export const getSeries = (slug: string) => SERIES.find((s) => s.slug === slug);
export const categoryLabel = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;
