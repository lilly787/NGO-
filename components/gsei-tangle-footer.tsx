"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

/* ── GSEI Tangle Footer ──────────────────────────────────────────
   Five concentric text-rings that rotate in alternating directions,
   forming an upper-semicircle arch that fills the footer area.
   Inspired by TangleFooter / 21st.dev — rebuilt for GSEI palette.
────────────────────────────────────────────────────────────────── */

const GSEI_LINES = [
  "Empowering Girls · Protecting Futures · Building Communities",
  "Girls Spring Empowerment Initiative · Abuja, Nigeria",
  "Education · Safety · Opportunity · Leadership · Change",
  "Every Girl Deserves to Learn, Lead, and Live Free",
  "Advancing Rights · Preventing Violence · Creating Futures",
];

const RING_COUNT = 5;
const K = 0.5522847498; // cubic bezier constant for circle approximation
const STROKE = 26;

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function circlePath(cx: number, cy: number, r: number): string {
  const o = r * K;
  return [
    `M ${(cx + r).toFixed(1)} ${cy.toFixed(1)}`,
    `C ${(cx + r).toFixed(1)} ${(cy + o).toFixed(1)} ${(cx + o).toFixed(1)} ${(cy + r).toFixed(1)} ${cx.toFixed(1)} ${(cy + r).toFixed(1)}`,
    `C ${(cx - o).toFixed(1)} ${(cy + r).toFixed(1)} ${(cx - r).toFixed(1)} ${(cy + o).toFixed(1)} ${(cx - r).toFixed(1)} ${cy.toFixed(1)}`,
    `C ${(cx - r).toFixed(1)} ${(cy - o).toFixed(1)} ${(cx - o).toFixed(1)} ${(cy - r).toFixed(1)} ${cx.toFixed(1)} ${(cy - r).toFixed(1)}`,
    `C ${(cx + o).toFixed(1)} ${(cy - r).toFixed(1)} ${(cx + r).toFixed(1)} ${(cy - o).toFixed(1)} ${(cx + r).toFixed(1)} ${cy.toFixed(1)}`,
  ].join(" ");
}

function buildText(line: string, circumference: number, fontSize: number): string {
  const unit = `${line}   ·   `;
  const unitWidth = Math.max(unit.length * fontSize * 0.68, 1);
  const repeats = Math.max(3, Math.ceil(circumference / unitWidth) + 1);
  return unit.repeat(repeats);
}

type Ring = {
  d: string;
  cx: number;
  cy: number;
  strokeWidth: number;
  fontSize: number;
  text: string;
  duration: number;
  phase: number;
  reverse: boolean;
  // alternating colors: orchid or plum-light
  ribbonColor: string;
  textFill: string;
};

function buildRings(width: number, bandHeight: number, seed = 42): Ring[] {
  const rand = mulberry32(seed);
  const cx = width / 2;
  const cy = bandHeight;
  const strokePad = STROKE / 2 + 2;
  const outer = Math.max(
    Math.min(width / 2 - strokePad, bandHeight - strokePad),
    STROKE * 4
  );
  const radii = Array.from(
    { length: RING_COUNT },
    (_, i) => (outer * (i + 1)) / RING_COUNT
  );
  const fontSize = Math.min(20, Math.max(13, width * 0.018));

  // Alternating GSEI palette: orchid strokes ↔ soft plum strokes
  const ribbonColors = ["#9047cc", "#5c2e8a", "#9047cc", "#5c2e8a", "#9047cc"];
  const textFills   = ["#f0e6ff", "#d4b3ff", "#f0e6ff", "#d4b3ff", "#f0e6ff"];

  return radii.map((r, i) => {
    const line = GSEI_LINES[i % GSEI_LINES.length]!;
    const circumference = 2 * Math.PI * r;

    return {
      d: circlePath(cx, cy, r),
      cx, cy,
      strokeWidth: STROKE,
      fontSize,
      text: buildText(line, circumference, fontSize),
      duration: 44 + i * 9 + rand() * 12,
      phase: rand(),
      reverse: i % 2 === 1,
      ribbonColor: ribbonColors[i]!,
      textFill: textFills[i]!,
    };
  });
}

export default function GSEITangleFooter() {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPaused(!(entry?.isIntersecting ?? true)),
      { rootMargin: "64px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const bandHeight = width > 0 ? width / 2.2 : 0;
  const rings = useMemo(
    () => (width > 0 && bandHeight > 0 ? buildRings(width, bandHeight) : []),
    [width, bandHeight]
  );

  const spinName = `gsei-spin-${uid}`;

  return (
    <footer
      ref={rootRef}
      aria-label="GSEI site footer"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "var(--night, #0d0718)",
      }}
    >
      {/* ── Info strip ── */}
      <div
        className="shell"
        style={{
          paddingTop: "clamp(40px, 6vw, 72px)",
          paddingBottom: "24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div>
          <strong
            style={{
              display: "block",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              marginBottom: "10px",
            }}
          >
            GSEI
          </strong>
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Empowered Girls · Stronger Communities · Brighter Futures
          </p>
        </div>
        <div
          style={{
            textAlign: "right",
            color: "rgba(255,255,255,0.4)",
            fontSize: "13px",
            lineHeight: 1.8,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <p style={{ margin: 0 }}>Abuja, Nigeria</p>
          <p style={{ margin: 0 }}>
            <a
              href="mailto:info@girlsspring.org"
              style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
            >
              info@girlsspring.org
            </a>
          </p>
          <p style={{ margin: 0 }}>www.girlsspring.org</p>
        </div>
      </div>

      {/* ── Tangle ring animation ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: bandHeight > 0 ? bandHeight : "45vw",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        <style>{`@keyframes ${spinName}{to{transform:rotate(360deg)}}`}</style>

        {width > 0 && bandHeight > 0 && (
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            viewBox={`0 0 ${width} ${bandHeight}`}
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {rings.map((ring, i) => (
                <path key={`def-${i}`} id={`${uid}-path-${i}`} d={ring.d} fill="none" />
              ))}
            </defs>

            {rings.map((ring, i) => (
              <g
                key={`ring-${i}`}
                style={{
                  transformBox: "view-box",
                  transformOrigin: `${ring.cx}px ${ring.cy}px`,
                  animation: `${spinName} ${ring.duration}s linear infinite`,
                  animationDirection: ring.reverse ? "reverse" : "normal",
                  animationDelay: `${-ring.phase * ring.duration}s`,
                  animationPlayState: paused ? "paused" : "running",
                  willChange: "transform",
                }}
              >
                <use
                  href={`#${uid}-path-${i}`}
                  strokeWidth={ring.strokeWidth}
                  strokeLinecap="round"
                  fill="none"
                  stroke={ring.ribbonColor}
                />
                <text
                  fontSize={ring.fontSize}
                  fontFamily="'Inter', ui-sans-serif, system-ui, sans-serif"
                  fontWeight={700}
                  letterSpacing="0.05em"
                  dominantBaseline="central"
                  fill={ring.textFill}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  <textPath href={`#${uid}-path-${i}`} startOffset="0" method="align">
                    {ring.text}
                  </textPath>
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>

      {/* ── Copyright bar ── */}
      <div
        style={{
          textAlign: "center",
          padding: "16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.3)",
          fontSize: "12px",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.06em",
          position: "relative",
          zIndex: 2,
        }}
      >
        © {new Date().getFullYear()} Girls Spring Empowerment Initiative. All rights reserved.
      </div>
    </footer>
  );
}
