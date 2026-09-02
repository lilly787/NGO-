export default function Loading() {
  return (
    <main className="section">
      <div className="shell listing-frame">
        <div className="skeleton skeleton-eyebrow" />
        <div className="skeleton skeleton-h1" />
        <div className="skeleton skeleton-lead" />
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 48 }}>
          {[1, 2, 3].map((i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton skeleton-eyebrow" />
              <div className="skeleton skeleton-h2" />
              <div className="skeleton skeleton-btn" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
