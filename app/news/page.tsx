import Link from "next/link";
import { published } from "@/lib/cms";

export default async function News() {
  let items: Awaited<ReturnType<typeof published>> = [];
  try {
    items = await published("news");
  } catch {
    // DB may be paused (Neon free tier) — show empty state gracefully
  }

  return (
    <main className="section">
      <div className="shell listing-frame">
        <p className="eyebrow">News &amp; Stories</p>
        <h1>Stories of resilience, innovation, and impact.</h1>
        <p className="listing-intro">
          Discover community outreach, partnerships, leadership programmes,
          beneficiary success stories, research, and advocacy initiatives.
        </p>
        {items.length ? (
          <div className="news-list">
            {items.map((item) => (
              <article className="feature" key={item.id}>
                {item.featuredImage && (
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="feature-thumb"
                  />
                )}
                <p className="eyebrow">
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "News & Stories"}
                </p>
                <h2>{item.title}</h2>
                <Link className="button primary" href={`/news/${item.slug}`}>
                  Read story
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">
            News &amp; Stories will appear here when GSEI publishes them.
          </div>
        )}
      </div>
    </main>
  );
}
