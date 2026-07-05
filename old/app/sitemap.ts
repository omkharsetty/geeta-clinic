import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/services/diabetes-management",
    "/services/thyroid-disorders",
    "/services/pcos-hormonal-care",
    "/services/obesity-metabolic-health",
  ];

  return [
    ...routes.map((route, index) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: index === 0 ? 1 : 0.8,
    })),
  ];
}
