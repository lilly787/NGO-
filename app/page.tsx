import Link from "next/link";
import { programmes } from "@/lib/content";

export default function Home() {
  return <>
    <section className="hero"><div className="shell">
      <p className="eyebrow">Girls Spring Empowerment Initiative</p>
      <h1 className="hero-title"><span>Empowering <em>Girls.</em></span><span>Protecting <i>Futures.</i></span></h1>
      <p className="lead">Every girl deserves the chance to learn, lead, and live free from violence and exploitation.</p>
      <p>Girls Spring Empowerment Initiative (GSEI) is a Nigerian non-profit organization working to ensure that girls and women are safe, educated, empowered, and equipped to build better futures.</p>
      <div className="actions"><Link className="button primary" href="/donate">Donate</Link><Link className="button" href="/partner">Partner With Us</Link><Link className="button" href="/volunteer">Volunteer</Link></div>
    </div></section>
    <section className="section founder-section"><div className="shell founder-frame"><div className="founder-image"><img src="/images/victoria-boma-daniel.jpeg" alt="Victoria Boma Daniel, Founder of Girls Spring Empowerment Initiative" /></div><div className="founder-copy"><p className="eyebrow">Meet the founder</p><h2>Victoria<br /><em>Boma Daniel</em></h2><p className="founder-role">Founder, Girls Spring Empowerment Initiative (GSEI)</p><blockquote>“My mission is simple: to empower girls and women with knowledge, skills, and opportunities that unlock their potential and create lasting change in our society.”</blockquote></div></div></section>
    <section className="section about-section"><div className="shell about-frame"><p className="eyebrow">Who we are</p><span className="about-watermark" aria-hidden="true">GSEI</span><div className="about-orbit" aria-hidden="true"><span /><span /><span /></div><h2>Every girl deserves safety, opportunity, and the freedom to dream.</h2><div className="grid about-copy"><p>Girls Spring Empowerment Initiative (GSEI) is a non-profit, non-governmental organization committed to advancing the rights, safety, and wellbeing of girls and women.</p><p>Our work is grounded in the belief that lasting change begins with prevention, community ownership, and equal opportunities for every girl.</p></div></div></section>
    <section className="section alt"><div className="shell"><p className="eyebrow">Our programmes</p><div className="cards">{programmes.map(([title,text])=><article className="card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section"><div className="shell"><p className="eyebrow">GSEI Voices</p><h2>Ideas, observations and advocacy for safer futures.</h2><Link className="button primary" href="/gsei-voices">Explore GSEI Voices</Link></div></section>
  </>;
}
