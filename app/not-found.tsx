import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="section shell" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <p className="eyebrow">404</p>
      <h1 style={{ fontSize: "clamp(64px,12vw,180px)", margin: "0 0 24px" }}>
        Not found.
      </h1>
      <p style={{ fontSize: "clamp(17px,1.8vw,22px)", color: "var(--muted)", maxWidth: 560 }}>
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Head back to the homepage and try again.
      </p>
      <div className="actions" style={{ marginTop: 36 }}>
        <Link className="button primary" href="/">Back to homepage</Link>
        <Link className="button" href="/contact">Contact us</Link>
      </div>
    </main>
  );
}
