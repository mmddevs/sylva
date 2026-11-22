import type { MetadataRoute } from "next";
import { SERIES, SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "monthly", priority: 1 },
    ...SERIES.map((s) => ({
      url: `${SITE.url}/series/${s.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
      images: [`${SITE.url}${s.cover.src}`],
    })),
  ];
}
