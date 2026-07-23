import type { MetadataRoute } from "next";
import { siteConfig, isProduction } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  // Vercel preview/branch deployments serve the same code on throwaway
  // URLs, don't let those get crawled and indexed as duplicate content.
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
