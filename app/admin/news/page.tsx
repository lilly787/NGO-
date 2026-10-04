import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { remove, setStatus } from "@/app/admin/actions";
import { ContentStatus } from "@prisma/client";
import { DeleteButton } from "@/components/admin-delete-button";

export default async function NewsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  if (!await isAdmin()) redirect("/admin/login");

  const { filter } = await searchParams;
  const where =
    filter === "published" ? { status: ContentStatus.PUBLISHED } :
    filter === "draft"     ? { status: ContentStatus.DRAFT }     :
    {};

  let items: Awaited<ReturnType<typeof prisma.news.findMany>> = [];
  try {
    items = await prisma.news.findMany({ where, orderBy: { updatedAt: "desc" } });
  } catch {
    // DB may be paused
  }

  return (
    <>
      <p className="eyebrow">Content management</p>
      <h1>News &amp; Stories</h1>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", marginBottom: "32px" }}>
        <Link className="button primary" href="/admin/news/new">+ Add News</Link>
        <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          {(["all", "published", "draft"] as const).map(f => (
            <Link
              key={f}
              href={f === "all" ? "/admin/news" : `/admin/news?filter=${f}`}
              className="button"
              style={{
                fontSize: "13px",
                minHeight: "38px",
                padding: "8px 16px",
                background: (filter === f || (!filter && f === "all")) ? "var(--plum)" : "transparent",
                borderColor: (filter === f || (!filter && f === "all")) ? "var(--plum)" : "var(--line)",
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      {items.length ? (
        <div style={{ display: "grid", gap: "16px" }}>
          {items.map(item => (
            <article
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: item.featuredImage ? "80px 1fr auto" : "1fr auto",
                gap: "16px",
                alignItems: "center",
                padding: "20px 24px",
                border: "1px solid var(--line)",
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(176,112,230,0.04), transparent)",
              }}
            >
              {/* Thumbnail */}
              {item.featuredImage && (
                <img
                  src={item.featuredImage}
                  alt=""
                  style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                />
              )}

              {/* Info — click to view live page or edit */}
              <Link
                href={item.status === "PUBLISHED" ? `/news/${item.slug}` : `/admin/news/${item.id}/edit`}
                target={item.status === "PUBLISHED" ? "_blank" : undefined}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <p style={{ margin: "0 0 4px", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: item.status === "PUBLISHED" ? "var(--orchid)" : "var(--muted)" }}>
                  {item.status.toLowerCase()}
                  {item.publishedAt && ` · ${new Date(item.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
                </p>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "16px", color: "#fff", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "rgba(255,255,255,0.2)" }}>{item.title}</p>
              </Link>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <Link
                  className="button"
                  href={`/admin/news/${item.id}/edit`}
                  style={{ fontSize: "13px", minHeight: "38px", padding: "8px 14px" }}
                >
                  Edit
                </Link>

                {item.status === "PUBLISHED" && (
                  <Link
                    className="button"
                    href={`/news/${item.slug}`}
                    target="_blank"
                    style={{ fontSize: "13px", minHeight: "38px", padding: "8px 14px" }}
                  >
                    View ↗
                  </Link>
                )}

                {item.status === "DRAFT" ? (
                  <form action={setStatus.bind(null, "news", item.id, ContentStatus.PUBLISHED)}>
                    <button className="button primary" style={{ fontSize: "13px", minHeight: "38px", padding: "8px 14px" }}>
                      Publish
                    </button>
                  </form>
                ) : (
                  <form action={setStatus.bind(null, "news", item.id, ContentStatus.DRAFT)}>
                    <button className="button" style={{ fontSize: "13px", minHeight: "38px", padding: "8px 14px" }}>
                      Unpublish
                    </button>
                  </form>
                )}

                <DeleteButton title={item.title} action={remove.bind(null, "news", item.id)} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 16px" }}>
            {filter === "published" ? "No published News articles." :
             filter === "draft"     ? "No draft News articles." :
             "No News & Stories have been created yet."}
          </p>
          <Link className="button primary" href="/admin/news/new">+ Add News</Link>
        </div>
      )}
    </>
  );
}
