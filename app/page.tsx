import Link from "next/link";
import { programmes } from "@/lib/content";
import AetherRibbonMesh from "@/components/ui/aether-ribbon-mesh";
import AboutBento from "@/components/about-bento";

export default function Home() {
  return <>
    <section 
      style={{ 
        position: 'relative',
        width: '100%',
        minHeight: 'calc(100vh - 86px)',
        overflow: 'hidden',
        background: 'transparent',
        border: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      {/* Ribbon fills the entire section as background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <AetherRibbonMesh />
      </div>

      {/* Text layered on top — snug against navbar */}
      <div className="shell" style={{ position: 'relative', zIndex: 10, width: '100%', paddingTop: '20px', paddingBottom: '40px' }}>
        {/* Two-column: [eyebrow + title] left, [description + CTA] right */}
        <div className="hero-two-col" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '64px', alignItems: 'center' }}>
          {/* Left: Eyebrow directly above Title */}
          <div>
            <p className="eyebrow" style={{ marginBottom: '20px', marginTop: 0 }}>Girls Spring Empowerment Initiative</p>
            <h1 className="hero-title" style={{ fontSize: 'clamp(64px, 8vw, 110px)', lineHeight: 1.0 }}>
              <span>Empowering <em>Girls.</em></span>
              <span>Protecting <i>Futures.</i></span>
            </h1>
          </div>
          {/* Right: Description + 2 Buttons */}
          <div style={{ paddingTop: '16px' }}>
            <p className="lead" style={{ color: '#ffffff', marginTop: 0, fontSize: 'clamp(18px, 1.8vw, 24px)', lineHeight: 1.5 }}>
              Every girl deserves the chance to learn, lead, and live free from violence and exploitation.
            </p>
            <div className="actions" style={{ marginTop: '36px' }}>
              <Link className="button primary" href="/donate">Donate</Link>
              <Link className="button" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} href="/partner">Partner With Us</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="section founder-section"><div className="shell founder-frame"><div className="founder-image"><img src="/images/victoria-boma-daniel.jpeg" alt="Victoria Boma Daniel, Founder of Girls Spring Empowerment Initiative" /></div><div className="founder-copy"><p className="eyebrow">Meet the founder</p><h2>Victoria<br /><em>Boma Daniel</em></h2><p className="founder-role">Founder, Girls Spring Empowerment Initiative (GSEI)</p><blockquote>“My mission is simple: to empower girls and women with knowledge, skills, and opportunities that unlock their potential and create lasting change in our society.”</blockquote></div></div></section>
    <AboutBento />
    <section className="section alt"><div className="shell"><p className="eyebrow">Our programmes</p><div className="cards">{programmes.map(([title,text])=><article className="card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section"><div className="shell"><p className="eyebrow">GSEI Voices</p><h2>Ideas, observations and advocacy for safer futures.</h2><Link className="button primary" href="/gsei-voices">Explore GSEI Voices</Link></div></section>
  </>;
}
