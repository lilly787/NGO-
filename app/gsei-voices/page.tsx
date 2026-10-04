import Link from "next/link";
import { published } from "@/lib/cms";
import { firstVoice } from "@/lib/content";

export default async function Voices() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let items: any[] = [];
  try {
    items = await published("voice");
  } catch {
    // DB may be paused (Neon free tier) — fall back to empty/pinned state
  }

  return (
    <main className="section">
      <div className="shell listing-frame">
        <p className="eyebrow">GSEI Voices</p>
        <h1>Perspectives for a safer future.</h1>
        <p className="listing-intro">
          Opinions, research, field observations, commentary, perspectives, and
          public-interest writing on issues affecting girls and women.
        </p>

        {items.length > 0 ? (
          <div className="voices-list">
            {items.map((item) => (
              <article className="feature" key={item.id}>
                <p className="eyebrow">
                  {item.authorName}
                  {item.authorRole ? ` · ${item.authorRole}` : ""}
                  {item.publishedAt
                    ? ` · ${new Date(item.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                    : ""}
                </p>
                <h2>{item.title}</h2>
                <Link className="button primary" href={`/gsei-voices/${item.slug}`}>
                  Read article
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <>
            {/* Pinned inaugural article while DB is still empty */}
            <article className="feature voice-feature">
              <p className="eyebrow">First publication · {firstVoice.authorName}</p>
              <h2>{firstVoice.title}</h2>
              <Link className="button primary" href={`/gsei-voices/${firstVoice.slug}`}>
                Read article
              </Link>
            </article>
          </>
        )}
      </div>
    </main>
  );
}
