import { notFound } from "next/navigation";
import { ContactForm } from "@/app/contact-form";
import Link from "next/link";
import { programmes } from "@/lib/content";

/* ── Programmes ────────────────────────────────────────────────── */
function ProgrammesPage() {
  return (
    <main className="section">
      <div className="shell">
        <div className="route-index">GSEI / programmes</div>
        <p className="eyebrow">Our programmes</p>
        <h1>What we do</h1>
        <p className="listing-intro">
          Education, protection, empowerment and leadership are at the heart of
          everything GSEI does. Our four core programme pillars work in tandem to
          create lasting change for girls and women.
        </p>
        <div className="cards" style={{ marginTop: "clamp(40px,6vw,80px)" }}>
          {programmes.map(([title, text]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div style={{ marginTop: "clamp(48px,7vw,90px)", borderTop: "1px solid var(--line)", paddingTop: "clamp(48px,7vw,90px)" }}>
          <p className="eyebrow">Flagship programme</p>
          <h2>Spring Her Forward</h2>
          <p style={{ maxWidth: 700, fontSize: "clamp(17px,1.8vw,22px)", lineHeight: 1.5, color: "var(--muted)" }}>
            Our signature programme takes girls and young women from
            vulnerability to leadership — providing education, life skills,
            mentoring, and entrepreneurship support.
          </p>
          <Link className="button primary" href="/spring-her-forward" style={{ marginTop: 28, display: "inline-flex" }}>
            Learn about Spring Her Forward
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ── Spring Her Forward ─────────────────────────────────────────── */
function SpringHerForwardPage() {
  const pillars = [
    ["Education & Literacy", "Academic support, school retention, tutoring, and career guidance for girls at risk of dropping out."],
    ["Life Skills & Safety", "Practical skills to recognise exploitation, understand rights, and make informed decisions in challenging environments."],
    ["Mentoring & Coaching", "One-to-one and group mentoring with professionals who guide participants through education and early career steps."],
    ["Leadership Academy", "Public speaking, civic engagement, and community leadership training that turns participants into local advocates."],
    ["Entrepreneurship Support", "Business basics, financial literacy, and seed opportunities so young women can build sustainable livelihoods."],
    ["Ambassador Programme", "Graduates become Spring Her Forward Ambassadors, inspiring and guiding the next cohort of participants."],
  ];
  return (
    <main className="section">
      <div className="shell">
        <div className="route-index">GSEI / spring-her-forward</div>
        <p className="eyebrow">Flagship programme</p>
        <h1>Spring Her Forward</h1>
        <p className="listing-intro">
          From vulnerability to leadership. Spring Her Forward is GSEI&apos;s
          signature programme, supporting girls and young women at every step of
          their journey.
        </p>
        <div className="shf-pillars">
          {pillars.map(([title, text]) => (
            <div className="shf-pillar" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "clamp(48px,7vw,90px)" }}>
          <p className="eyebrow">Get involved</p>
          <h2>Support Spring Her Forward</h2>
          <div className="actions" style={{ marginTop: 28 }}>
            <Link className="button primary" href="/donate">Donate to the programme</Link>
            <Link className="button" href="/volunteer">Volunteer with us</Link>
            <Link className="button" href="/partner">Become a partner</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ── Donate ─────────────────────────────────────────────────────── */
function DonatePage() {
  return (
    <main className="section">
      <div className="shell route-frame">
        <div className="route-index">GSEI / donate</div>
        <p className="eyebrow">Support our work</p>
        <h1>Donate</h1>
        <p className="listing-intro">
          Every contribution helps provide education, skills training, leadership
          opportunities, and protection for girls and women across Nigeria.
        </p>

        <div className="impact-grid">
          {[
            ["₦10,000", "Funds one girl's school supplies for a term"],
            ["₦50,000", "Sponsors a participant in Spring Her Forward"],
            ["₦200,000", "Equips a community safeguarding workshop"],
            ["Your amount", "Every naira counts — give what you can"],
          ].map(([amount, label]) => (
            <div className="impact-card" key={amount}>
              <strong>{amount}</strong>
              <p>{label}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "clamp(48px,7vw,80px)" }}>
          <p className="eyebrow">Make a donation</p>
          <h2>Reach out to give</h2>
          <p style={{ color: "var(--muted)", maxWidth: 600 }}>
            Contact us directly and our team will guide you through the donation
            process and provide a receipt for your records.
          </p>
          <a
            className="button primary"
            href="mailto:info@girlsspring.org?subject=Donation%20enquiry&body=Hello%20GSEI%2C%0A%0AI%20would%20like%20to%20make%20a%20donation.%20Please%20send%20me%20your%20payment%20details.%0A%0AName%3A%20%0AAmount%3A%20%0AMessage%3A%20"
            style={{ marginTop: 28, display: "inline-flex" }}
          >
            Email us to donate
          </a>
        </div>
      </div>
    </main>
  );
}

/* ── Partner ─────────────────────────────────────────────────────── */
function PartnerPage() {
  const partnerTypes = [
    "Government institutions & agencies",
    "Development agencies & foundations",
    "Corporate organisations (CSR partnerships)",
    "Universities & schools",
    "Faith & community organisations",
    "Media & content partners",
    "Individual supporters & philanthropists",
  ];
  return (
    <main className="section">
      <div className="shell route-frame">
        <div className="route-index">GSEI / partner</div>
        <p className="eyebrow">Collaborate with us</p>
        <h1>Partner with us</h1>
        <p className="listing-intro">
          Creating lasting change requires collaboration. We partner with a wide
          range of organisations and individuals who share our mission.
        </p>
        <div className="partner-list">
          {partnerTypes.map((t) => (
            <Link key={t} href="/contact" className="partner-link">
              {t}
            </Link>
          ))}
        </div>
        <div style={{ marginTop: "clamp(48px,7vw,80px)" }}>
          <p className="eyebrow">Start a conversation</p>
          <h2>Get in touch</h2>
          <p style={{ color: "var(--muted)", maxWidth: 600 }}>
            Tell us about your organisation and how you&apos;d like to
            collaborate. We&apos;ll respond within 3 working days.
          </p>
          <Link
            className="button primary"
            href="/contact"
            style={{ marginTop: 28, display: "inline-flex" }}
          >
            Send a partnership enquiry
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ── Volunteer ───────────────────────────────────────────────────── */
function VolunteerPage() {
  const roles = [
    ["Programme delivery", "Help facilitate workshops, trainings, and community outreach events."],
    ["Mentoring", "Share your expertise by guiding young women through education and career decisions."],
    ["Communications & design", "Support our social media, content writing, photography, or graphic design."],
    ["Research & advocacy", "Contribute data analysis, policy research, or advocacy campaigning."],
    ["Fundraising & events", "Help organise fundraisers, community events, and partnership drives."],
  ];
  return (
    <main className="section">
      <div className="shell route-frame">
        <div className="route-index">GSEI / volunteer</div>
        <p className="eyebrow">Join the movement</p>
        <h1>Volunteer</h1>
        <p className="listing-intro">
          Become part of a growing movement dedicated to empowering girls and
          women. Contribute your time, skills, and passion.
        </p>
        <div className="volunteer-roles">
          {roles.map(([title, desc]) => (
            <div className="volunteer-role" key={title}>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "clamp(48px,7vw,80px)" }}>
          <p className="eyebrow">Ready to volunteer?</p>
          <h2>Express your interest</h2>
          <p style={{ color: "var(--muted)", maxWidth: 600 }}>
            Send us a short message about yourself and how you&apos;d like to
            contribute. We&apos;ll follow up with next steps.
          </p>
          <Link
            className="button primary"
            href="/contact"
            style={{ marginTop: 28, display: "inline-flex" }}
          >
            Apply to volunteer
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ── Contact ─────────────────────────────────────────────────────── */
function ContactPage() {
  return (
    <main className="section">
      <div className="shell route-frame">
        <div className="route-index">GSEI / contact</div>
        <p className="eyebrow">Get in touch</p>
        <h1>Contact us</h1>
        <p className="listing-intro">
          We&apos;d love to hear from you. Reach out with questions, partnership
          ideas, or general enquiries.
        </p>
        <div className="contact-grid">
          <div className="contact-details">
            <div className="contact-item">
              <p className="eyebrow">Location</p>
              <p>Abuja, Nigeria</p>
            </div>
            <div className="contact-item">
              <p className="eyebrow">Email</p>
              <p><a href="mailto:info@girlsspring.org">info@girlsspring.org</a></p>
            </div>
            <div className="contact-item">
              <p className="eyebrow">Website</p>
              <p>www.girlsspring.org</p>
            </div>
            <div className="contact-item">
              <p className="eyebrow">Follow us</p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer">X</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}

/* ── About ───────────────────────────────────────────────────────── */
function AboutPage() {
  return (
    <main className="section">
      <div className="shell route-frame">
        <div className="route-index">GSEI / about</div>
        <p className="eyebrow">Girls Spring Empowerment Initiative</p>
        <h1>About us</h1>
        <div className="about-copy route-copy" style={{ maxWidth: 840 }}>
          <p>
            Girls Spring Empowerment Initiative (GSEI) is a non-profit,
            non-governmental organisation committed to advancing the rights,
            safety, and wellbeing of girls and women.
          </p>
          <h2>Our Vision</h2>
          <p>
            A world where every girl and woman is empowered, protected, and free
            from trafficking, violence, discrimination, and exploitation.
          </p>
          <h2>Our Mission</h2>
          <p>
            To empower girls and women through education, leadership development,
            economic empowerment, advocacy, mentorship, and strategic partnerships
            that prevent human trafficking, gender-based violence, and other forms
            of exploitation.
          </p>
        </div>
        <div className="actions" style={{ marginTop: "clamp(36px,5vw,64px)" }}>
          <Link className="button primary" href="/programmes">Our programmes</Link>
          <Link className="button" href="/spring-her-forward">Spring Her Forward</Link>
          <Link className="button" href="/contact">Contact us</Link>
        </div>
      </div>
    </main>
  );
}

/* ── Router ──────────────────────────────────────────────────────── */
const pages: Record<string, React.FC> = {
  about: AboutPage,
  programmes: ProgrammesPage,
  "spring-her-forward": SpringHerForwardPage,
  partner: PartnerPage,
  volunteer: VolunteerPage,
  donate: DonatePage,
  contact: ContactPage,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const titles: Record<string, string> = {
    about: "About us",
    programmes: "Our programmes",
    "spring-her-forward": "Spring Her Forward",
    partner: "Partner with us",
    volunteer: "Volunteer",
    donate: "Donate",
    contact: "Contact us",
  };
  return { title: titles[page] ?? "GSEI" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const Component = pages[page];
  if (!Component) notFound();
  return <Component />;
}
