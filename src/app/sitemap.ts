import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, priority: 1 },
    { url: `${siteConfig.url}/scan`, lastModified: now, priority: 0.8 },
    { url: `${siteConfig.url}/brands`, lastModified: now, priority: 0.6 },
  ];
}
