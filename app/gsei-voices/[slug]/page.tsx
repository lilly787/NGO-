import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { firstVoice } from "@/lib/content";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.voice.findFirst({ where: { slug, status: "PUBLISHED" } });
  const title = item?.title ?? (slug === firstVoice.slug ? firstVoice.title : null);
  return title ? { title } : {};
}

export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try DB first
  const item = await prisma.voice.findFirst({ where: { slug, status: "PUBLISHED" } });

  if (item) {
    return (
      <main className="section shell article">
        {item.featuredImage && (
          <img
            src={item.featuredImage}
            alt={item.title}
            className="article-hero-image"
          />
        )}
        <p className="eyebrow">GSEI Voices</p>
        <h1>{item.title}</h1>
        <p className="article-meta">
          By <strong>{item.authorName}</strong>
          {item.authorRole ? `, ${item.authorRole}` : ""}
          {item.publishedAt
            ? ` · ${new Date(item.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`
            : ""}
        </p>
        <div dangerouslySetInnerHTML={{ __html: item.content }} />
        {item.references && (
          <section className="article-references">
            <h2>Sources &amp; References</h2>
            <div style={{ whiteSpace: "pre-line", fontSize: "14px", color: "var(--muted)" }}>
              {item.references}
            </div>
          </section>
        )}
      </main>
    );
  }

  // Fallback to hardcoded inaugural article
  if (slug === firstVoice.slug) {
    return (
      <main className="section shell article">
        <p className="eyebrow">GSEI Voices</p>
        <h1>{firstVoice.title}</h1>
        <p className="article-meta">
          By <strong>{firstVoice.authorName}</strong>
        </p>
        <div dangerouslySetInnerHTML={{ __html: firstVoice.content }} />
      </main>
    );
  }

  notFound();
}
