import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.news.findFirst({ where: { slug, status: "PUBLISHED" } });
  return item ? { title: item.title } : {};
}

export default async function Story({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await prisma.news.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!item) notFound();

  return (
    <main className="section shell article">
      {item.featuredImage && (
        <img
          src={item.featuredImage}
          alt={item.title}
          className="article-hero-image"
        />
      )}
      <p className="eyebrow">News &amp; Stories</p>
      <h1>{item.title}</h1>
      {item.publishedAt && (
        <p className="article-meta">
          Published{" "}
          {new Date(item.publishedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
      <div dangerouslySetInnerHTML={{ __html: item.content }} />
    </main>
  );
}
