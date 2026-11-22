/* Données « pire cas » pour la route de dev /dev/break-ui (jamais en prod).
   Valeurs plausibles : noms longs réels, écritures non latines, singulier,
   gros nombres. */
import { SERIES, type Series } from "@/lib/site";

const base = SERIES[0];

export const WORST_SERIES: Series[] = [
  {
    ...base,
    slug: "worst-long",
    title: "Forêt domaniale de Saint-Germain-en-Laye et ses abords",
    summary:
      "Une série au long cours, commencée sous la pluie et terminée en plein été, sur les mêmes trois kilomètres de sentier forestier.",
    prints: 1,
    year: 2026,
  },
  { ...SERIES[1], slug: "worst-cjk", title: "森の光と霧の朝", summary: "朝霧の中の森。", prints: 128 },
  { ...SERIES[2], slug: "worst-short", title: "Ô", summary: "Lac.", prints: 0 },
  {
    ...SERIES[3],
    slug: "worst-word",
    title: "Hochgebirgslandschaftsfotografie",
    summary: "Đồi núi phía Bắc, sương mù và ánh sáng — tiếng Việt với dấu.",
    prints: 15,
  },
  ...SERIES.slice(4),
];

export const WORST_FIGURES = [
  { value: 1, label: "série publiée" },
  { value: 1284, label: "massifs parcourus, refuges et cabanes compris" },
  { value: 2_450_000, label: "kilomètres à pied" },
  { value: 0, label: "tirages vendus" },
];
