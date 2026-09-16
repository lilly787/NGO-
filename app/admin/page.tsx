import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  if (!await isAdmin()) redirect("/admin/login");

  const [newsTotal, newsPublished, newsDraft, voiceTotal, voicePublished, voiceDraft] = await Promise.all([
    prisma.news.count(),
    prisma.news.count({ where: { status: "PUBLISHED" } }),
    prisma.news.count({ where: { status: "DRAFT" } }),
    prisma.voice.count(),
    prisma.voice.count({ where: { status: "PUBLISHED" } }),
    prisma.voice.count({ where: { status: "DRAFT" } }),
  ]);

  return (
    <>
      <p className="eyebrow">Dashboard</p>
      <h1>Welcome to GSEI Admin</h1>
      <p style={{ color: "var(--muted)", marginBottom: "48px" }}>
        Manage News &amp; Stories and GSEI Voices content below.
      </p>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "56px" }}>
        {[
          { label: "Total News", value: newsTotal, href: "/admin/news" },
          { label: "Published News", value: newsPublished, href: "/admin/news?filter=published" },
          { label: "Draft News", value: newsDraft, href: "/admin/news?filter=draft" },
          { label: "Total Voices", value: voiceTotal, href: "/admin/voices" },
          { label: "Published Voices", value: voicePublished, href: "/admin/voices?filter=published" },
          { label: "Draft Voices", value: voiceDraft, href: "/admin/voices?filter=draft" },
        ].map(({ label, value, href }) => (
          <Link key={label} href={href} style={{ textDecoration: "none" }}>
            <div style={{
              padding: "28px 24px",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(176,112,230,0.06), transparent)",
              transition: "border-color .3s, transform .3s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--orchid)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
            >
              <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: "11px", fontFamily: "'DM Mono', monospace", letterSpacing: ".1em", textTransform: "uppercase" }}>{label}</p>
              <p style={{ margin: 0, fontSize: "42px", fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#fff", lineHeight: 1 }}>{value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link className="button primary" href="/admin/news/new">+ Add News</Link>
        <Link className="button primary" href="/admin/voices/new">+ Add Voice</Link>
        <Link className="button" href="/admin/news">Manage News</Link>
        <Link className="button" href="/admin/voices">Manage Voices</Link>
      </div>
    </>
  );
}
