import type { MetadataRoute } from "next";

const baseUrl = "https://aruform.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    "",
    "/write",
    "/entries",
    "/snapshot",
    "/timeline",
    "/compare",
  ];

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.6,
  }));
}
