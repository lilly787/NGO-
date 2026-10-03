import React from "react";

/* ── GSEI About Bento ─────────────────────────────────────────
   Layout:
   Desktop (>768px):
     [  Headline  ] [Card A]
     [  Headline  ] [Card B]
     [    Card C — full width     ]

   Tablet (480–768px):
     [  Headline  ] [Card A]
     [    Card B — full width     ]
     [    Card C — full width     ]

   Mobile (<480px):
     Stack all cards vertically
──────────────────────────────────────────────────────────────── */

const PlusIcon = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "rgba(255,255,255,0.18)", position: "absolute", ...style }}
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const Corners = () => (
  <>
    <PlusIcon style={{ top: -9, left: -9 }} />
    <PlusIcon style={{ top: -9, right: -9 }} />
    <PlusIcon style={{ bottom: -9, left: -9 }} />
    <PlusIcon style={{ bottom: -9, right: -9 }} />
  </>
);

export default function AboutBento() {
  return (
    <section className="about-bento-section">
      {/* Inject responsive styles */}
      <style>{`
        .about-bento-section {
          background: var(--bg);
          padding: clamp(64px, 8vw, 120px) 0;
        }

        /* ── Top two-column row ── */
        .bento-top {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 12px;
          align-items: stretch;
        }

        /* Headline card — left, fills the full height of the right-col stack */
        .bento-headline {
          position: relative;
          border-radius: 20px;
          padding: clamp(32px, 4vw, 52px);
          background: var(--plum, #2d1660);
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          min-height: 220px;
        }

        /* Right column stacks two cards */
        .bento-right-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bento-card {
          position: relative;
          border-radius: 20px;
          padding: clamp(24px, 3vw, 36px);
          overflow: hidden;
          flex: 1;
        }

        .bento-card-accent {
          background: var(--orchid, #9047cc);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .bento-card-outline {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
        }

        /* Full-width bottom card */
        .bento-bottom {
          position: relative;
          border-radius: 20px;
          padding: clamp(24px, 3vw, 40px) clamp(28px, 4vw, 52px);
          background: var(--orchid, #9047cc);
          border: 1px solid rgba(255,255,255,0.12);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }

        /* ── Tablet ── */
        @media (max-width: 768px) {
          .bento-top {
            grid-template-columns: 1fr 1fr;
          }
          .bento-right-col {
            flex-direction: column;
          }
        }

        /* ── Mobile ── */
        @media (max-width: 520px) {
          .bento-top {
            grid-template-columns: 1fr;
          }
          .bento-headline {
            min-height: 180px;
          }
          .bento-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }

        .bento-text-white {
          margin: 0;
          color: #ffffff;
          font-size: clamp(14px, 1.3vw, 16px);
          line-height: 1.72;
        }
        .bento-text-muted {
          margin: 0;
          color: rgba(255,255,255,0.78);
          font-size: clamp(14px, 1.3vw, 16px);
          line-height: 1.72;
        }
      `}</style>

      <div className="shell" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Eyebrow */}
        <p className="eyebrow" style={{ margin: 0 }}>Who we are</p>

        {/* ── Top row: headline left, two stacked right ── */}
        <div className="bento-top">
          {/* Headline card */}
          <div className="bento-headline">
            <Corners />
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(26px, 3vw, 48px)",
                lineHeight: 1.15,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
              }}
            >
              Every girl deserves safety, opportunity, and the freedom to dream.
            </h2>
          </div>

          {/* Right column */}
          <div className="bento-right-col">
            {/* Card A — accent orchid */}
            <div className="bento-card bento-card-accent">
              <Corners />
              <p className="bento-text-white">
                Girls Spring Empowerment Initiative (GSEI) is a non-profit, non-governmental organization committed to advancing the rights, safety, and wellbeing of girls and women.
              </p>
            </div>

            {/* Card B — subtle outline */}
            <div className="bento-card bento-card-outline">
              <Corners />
              <p className="bento-text-muted">
                Our work is grounded in the belief that lasting change begins with prevention, community ownership, and equal opportunities for every girl.
              </p>
            </div>
          </div>
        </div>

        {/* ── Full-width bottom card ── */}
        <div className="bento-bottom">
          <Corners />
          <p className="bento-text-white" style={{ maxWidth: "640px" }}>
            We build bridges between communities, governments, and global partners — turning advocacy into action and awareness into lasting protection for every girl.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.55)",
              fontSize: "11px",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "rgba(255,255,255,0.5)",
                display: "inline-block",
              }}
            />
            Est. GSEI · Nigeria
          </div>
        </div>
      </div>
    </section>
  );
}
