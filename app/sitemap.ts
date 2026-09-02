import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.girlsspring.org";

  const staticUrls: MetadataRoute.Sitemap = [
    "", "/about", "/programmes", "/spring-her-forward",
    "/gsei-voices", "/news", "/partner", "/volunteer", "/donate", "/contact",
  ].map((url) => ({ url: `${base}${url}`, lastModified: new Date(), changeFrequency: "monthly", priority: url === "" ? 1 : 0.8 }));

  const [newsItems, voiceItems] = await Promise.all([
    prisma.news.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.voice.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);

  const newsUrls: MetadataRoute.Sitemap = newsItems.map((n) => ({
    url: `${base}/news/${n.slug}`,
    lastModified: n.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const voiceUrls: MetadataRoute.Sitemap = voiceItems.map((v) => ({
    url: `${base}/gsei-voices/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticUrls, ...newsUrls, ...voiceUrls];
}

