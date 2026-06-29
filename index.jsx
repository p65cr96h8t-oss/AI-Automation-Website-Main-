import { useState, useEffect, useRef } from "react";

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────────
const C = {
  bg:       "#080E0E",
  surface:  "#0D1616",
  card:     "#101C1C",
  border:   "#162424",
  borderHi: "#1F3636",
  primary:  "#0D9488",
  primaryL: "#2DD4BF",
  primaryD: "#0F766E",
  text:     "#F0FAFA",
  muted:    "#7FA8A8",
  subtle:   "#3D6060",
};

// ── FONT IMPORT (injected once) ────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700&family=Inter:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
}

// ── GLOBAL STYLES ──────────────────────────────────────────────────────────────
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: ${C.bg};
    color: ${C.text};
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  ::selection { background: ${C.primary}44; color: ${C.text}; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }

  .display { font-family: 'Bricolage Grotesque', sans-serif; }
  .grad-text {
    background: linear-gradient(135deg, ${C.text} 0%, ${C.primaryL} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .grad-border {
    position: relative;
  }
  .grad-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${C.borderHi}, transparent 60%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .hover-lift {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .hover-lift:hover {
    transform: translateY(-3px);
    border-color: ${C.borderHi} !important;
    box-shadow: 0 12px 40px rgba(99,102,241,0.12);
  }
  .btn-primary {
    background: ${C.primary};
    color: white;
    border: none;
    padding: 13px 28px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    letter-spacing: 0.01em;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary:hover {
    background: ${C.primaryL};
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(99,102,241,0.35);
  }
  .btn-ghost {
    background: transparent;
    color: ${C.muted};
    border: 1px solid ${C.border};
    padding: 12px 24px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .btn-ghost:hover {
    color: ${C.text};
    border-color: ${C.borderHi};
    background: ${C.surface};
  }
  .section-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${C.primary};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-label::before {
    content: '';
    width: 20px;
    height: 1px;
    background: ${C.primary};
  }
  input, textarea, select {
    background: ${C.surface};
    border: 1px solid ${C.border};
    color: ${C.text};
    border-radius: 8px;
    padding: 12px 16px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    outline: none;
    width: 100%;
    transition: border-color 0.2s;
  }
  input:focus, textarea:focus, select:focus {
    border-color: ${C.primary};
  }
  input::placeholder, textarea::placeholder {
    color: ${C.subtle};
  }
  select option { background: ${C.card}; color: ${C.text}; }
  label {
    font-size: 13px;
    color: ${C.muted};
    margin-bottom: 6px;
    display: block;
    font-weight: 400;
  }
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .mobile-col { flex-direction: column !important; }
    .mobile-full { width: 100% !important; }
  }
`;

// ── ICONS ──────────────────────────────────────────────────────────────────────
const Icon = {
  Zap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Bot: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/>
      <path d="M8 15h.01M16 15h.01"/>
    </svg>
  ),
  Workflow: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="6" height="6" rx="1"/>
      <rect x="16" y="2" width="6" height="6" rx="1"/>
      <rect x="9" y="16" width="6" height="6" rx="1"/>
      <path d="M5 8v2a2 2 0 002 2h10a2 2 0 002-2V8"/>
      <path d="M12 12v4"/>
    </svg>
  ),
  Database: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-10 7L2 7"/>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Link: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  ),
  Brain: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-3.03 3 3 0 01-.34-5.58 2.5 2.5 0 013.87-3.43z"/>
      <path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-3.03 3 3 0 00.34-5.58 2.5 2.5 0 00-3.87-3.43z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/>
      <path d="M5 3l.8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8Z"/>
    </svg>
  ),
};

// ── INTERSECTION OBSERVER HOOK ─────────────────────────────────────────────────
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

// ── NAV ────────────────────────────────────────────────────────────────────────
function Nav({ onApply }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 32px",
      background: scrolled ? `${C.bg}E8` : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
      transition: "all 0.3s ease",
      height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: `linear-gradient(135deg, ${C.primary}, ${C.primaryD})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span className="display" style={{ fontWeight: 600, fontSize: 17, letterSpacing: "-0.02em" }}>Marina Solutions</span>
      </div>
      <div className="hide-mobile" style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {["Services", "How it Works", "Pricing", "Planner"].map(item => (
          <a key={item}
            href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
            style={{ color: C.muted, fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = C.text}
            onMouseLeave={e => e.target.style.color = C.muted}>
            {item}
          </a>
        ))}
      </div>
      <button className="btn-primary" onClick={onApply} style={{ padding: "10px 20px", fontSize: 13 }}>
        Apply for Free Plan <Icon.ArrowRight />
      </button>
    </nav>
  );
}

// ── HERO ───────────────────────────────────────────────────────────────────────
function Hero({ onApply, onPlanner }) {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "120px 32px 80px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 400,
        background: `radial-gradient(ellipse, ${C.primary}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${C.border}30 1px, transparent 1px), linear-gradient(90deg, ${C.border}30 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px",
          borderRadius: 100, border: `1px solid ${C.border}`,
          background: `${C.surface}80`, backdropFilter: "blur(10px)",
          marginBottom: 40, fontSize: 12, color: C.muted, letterSpacing: "0.04em" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
          Taking new clients — 2 spots remaining
        </div>

        <h1 className="display" style={{
          fontSize: "clamp(44px, 7vw, 84px)", fontWeight: 700,
          lineHeight: 1.05, letterSpacing: "-0.035em",
          marginBottom: 28, maxWidth: 820,
        }}>
          Your operations,
          <br /><span className="grad-text">without the overhead.</span>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2vw, 19px)", color: C.muted, fontWeight: 300,
          lineHeight: 1.65, maxWidth: 560, marginBottom: 48,
        }}>
          Marina Solutions builds bespoke AI automation systems for businesses that are ready to stop doing the same tasks twice. We replace repetitive workflows with intelligent infrastructure that runs itself.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={onApply} style={{ padding: "14px 32px", fontSize: 15 }}>
            Apply for a Free Automation Plan <Icon.ArrowRight />
          </button>
          <button className="btn-ghost" onClick={onPlanner}>
            See the Automation Planner →
          </button>
        </div>

        {/* Social proof bar */}
        <div style={{
          marginTop: 72, paddingTop: 40,
          borderTop: `1px solid ${C.border}`,
          display: "flex", gap: 48, flexWrap: "wrap", alignItems: "center",
        }}>
          {[
            { val: "40+", label: "hours saved per client, per month" },
            { val: "£0", label: "in unnecessary hires" },
            { val: "72h", label: "average first automation live" },
          ].map(s => (
            <div key={s.val}>
              <div className="display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: C.text }}>
                {s.val}
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PROBLEM ────────────────────────────────────────────────────────────────────
function Problem() {
  const ref = useFadeIn();
  const problems = [
    "Manually moving data between tools every day",
    "Following up with leads because nothing is tracked",
    "Answering the same support questions repeatedly",
    "Spending Friday afternoons on admin that could be automated",
    "Hiring staff just to manage processes, not grow the business",
  ];
  return (
    <section style={{ padding: "100px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div ref={ref} className="fade-in" style={{ display: "flex", gap: 80, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 380px" }}>
          <div className="section-label">The Problem</div>
          <h2 className="display" style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 20 }}>
            Growth stalls when your team is the automation.
          </h2>
          <p style={{ color: C.muted, lineHeight: 1.7, fontSize: 15 }}>
            Most businesses hit a ceiling — not because they lack customers, but because their operations don't scale. Every new client adds more admin, more chasing, more hours. The answer isn't another hire.
          </p>
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {problems.map((p, i) => (
              <div key={i} className="hover-lift" style={{
                padding: "18px 24px", border: `1px solid ${C.border}`,
                borderRadius: 10, background: C.surface, cursor: "default",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: "#EF444414", border: "1px solid #EF444430",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon.X />
                </div>
                <span style={{ fontSize: 14, color: C.muted, lineHeight: 1.4 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SERVICES ───────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Icon.Bot, title: "AI Chatbots", desc: "Trained on your business, deployed on your site or platform. Handles enquiries, qualifies leads, and escalates when needed." },
  { icon: Icon.Workflow, title: "Workflow Automation", desc: "n8n, Make, and Zapier systems that connect your stack and eliminate manual data movement between tools." },
  { icon: Icon.Database, title: "CRM Integrations", desc: "Your CRM talking to your inbox, your calendar, your forms. One source of truth, automatically maintained." },
  { icon: Icon.Users, title: "Lead Capture & Qualification", desc: "Systems that capture, score, and route leads without anyone touching a spreadsheet." },
  { icon: Icon.Mail, title: "Email Automation", desc: "Sequences that respond to behaviour, not schedules. The right message, to the right person, at the right moment." },
  { icon: Icon.Brain, title: "AI Knowledge Bases", desc: "Your documentation, your processes, your SOPs — turned into an AI your team can query like a person." },
  { icon: Icon.Link, title: "API Integrations", desc: "When your tools don't talk to each other, we build the bridge. Custom integrations that make your stack coherent." },
  { icon: Icon.Sparkle, title: "Custom AI Solutions", desc: "Beyond off-the-shelf. Bespoke models, pipelines, and systems designed around your specific operational needs." },
];

function Services() {
  const ref = useFadeIn();
  return (
    <section id="services" style={{ padding: "100px 32px", background: `${C.surface}50` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div ref={ref} className="fade-in" style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>What We Build</div>
          <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Every system, built to remove a bottleneck.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 2 }}>
          {SERVICES.map((s, i) => (
            <ServiceCard key={i} {...s} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon: IconComp, title, desc, delay }) {
  const ref = useFadeIn(0.1);
  return (
    <div ref={ref} className="fade-in hover-lift grad-border" style={{
      padding: "28px 24px", background: C.card,
      borderRadius: 12, border: `1px solid ${C.border}`,
      transitionDelay: `${delay}ms`,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${C.primary}18`, border: `1px solid ${C.primary}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16, color: C.primaryL,
      }}>
        <IconComp />
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>{title}</h3>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

// ── HOW IT WORKS ───────────────────────────────────────────────────────────────
function HowItWorks() {
  const ref = useFadeIn();
  const steps = [
    { n: "01", title: "You apply", desc: "Tell us about your business, what you want automated, and what you're currently spending time on. No calls required." },
    { n: "02", title: "We scope it", desc: "We review your application and map out the exact automation architecture. You receive a clear plan before anything is agreed." },
    { n: "03", title: "We build it", desc: "Your system is built, tested, and documented. Most first automations are live within 72 hours of kickoff." },
    { n: "04", title: "It runs itself", desc: "Your automation handles the work. Ongoing optimisation keeps it accurate and expanding as your business grows." },
  ];
  return (
    <section id="how-it-works" style={{ padding: "100px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div ref={ref} className="fade-in" style={{ textAlign: "center", marginBottom: 72 }}>
        <div className="section-label" style={{ justifyContent: "center" }}>The Process</div>
        <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
          From application to live system in days.
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24, position: "relative" }}>
        {steps.map((s, i) => (
          <StepCard key={i} {...s} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}

function StepCard({ n, title, desc, delay }) {
  const ref = useFadeIn(0.1);
  return (
    <div ref={ref} className="fade-in" style={{ transitionDelay: `${delay}ms` }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
        color: C.primary, marginBottom: 16, fontFamily: "monospace",
      }}>{n}</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

// ── CASE STUDIES ───────────────────────────────────────────────────────────────
function CaseStudies() {
  const ref = useFadeIn();
  const cases = [
    {
      label: "Property Management Agency",
      headline: "Eliminated 22 hours of weekly admin by automating tenant onboarding, maintenance ticketing, and contractor communication.",
      metrics: [
        { val: "22h/wk", label: "saved in admin" },
        { val: "4 days", label: "to go live" },
        { val: "£0", label: "in new hires" },
      ],
      stack: ["n8n", "HubSpot", "Notion", "Gmail"],
    },
    {
      label: "E-Commerce Brand",
      headline: "Built a full post-purchase automation sequence that cut support tickets by 60% and increased repeat purchase rate.",
      metrics: [
        { val: "60%", label: "fewer support tickets" },
        { val: "3.2×", label: "repeat purchase rate" },
        { val: "7 days", label: "full build" },
      ],
      stack: ["Make", "Klaviyo", "Shopify", "Gorgias"],
    },
    {
      label: "B2B Consultancy",
      headline: "Replaced manual lead qualification with an AI intake system that scores, routes, and follows up with prospects automatically.",
      metrics: [
        { val: "8h/wk", label: "lead admin eliminated" },
        { val: "2×", label: "qualified leads actioned" },
        { val: "£2,400", label: "build cost" },
      ],
      stack: ["n8n", "HubSpot", "Typeform", "Claude AI"],
    },
  ];
  return (
    <section id="case-studies" style={{ padding: "100px 32px", background: `${C.surface}40` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div ref={ref} className="fade-in" style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Results</div>
          <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Real systems. Real outcomes.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {cases.map((c, i) => <CaseCard key={i} {...c} delay={i * 100} />)}
        </div>
      </div>
    </section>
  );
}

function CaseCard({ label, headline, metrics, stack, delay }) {
  const ref = useFadeIn(0.1);
  return (
    <div ref={ref} className="fade-in hover-lift grad-border" style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: 32, transitionDelay: `${delay}ms`,
    }}>
      <div style={{ fontSize: 11, color: C.primary, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
        {label}
      </div>
      <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 28, color: C.text }}>{headline}</p>
      <div style={{ display: "flex", gap: 20, marginBottom: 28, flexWrap: "wrap" }}>
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: C.primaryL }}>{m.val}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {stack.map(t => (
          <span key={t} style={{
            fontSize: 11, padding: "4px 10px", borderRadius: 100,
            background: `${C.primary}14`, border: `1px solid ${C.primary}25`,
            color: C.primaryL, fontWeight: 500,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ── PRICING ────────────────────────────────────────────────────────────────────
function Pricing({ onApply }) {
  const ref = useFadeIn();
  const tiers = [
    {
      name: "Starter Automation",
      range: "£500 – £1,500",
      desc: "For businesses that have one clear process that needs automating. A single, well-scoped workflow.",
      features: ["Single automation build", "Up to 3 tools connected", "Documentation included", "2-week delivery", "Optional monthly support"],
      monthly: "£150/month support",
      highlight: false,
    },
    {
      name: "Business System",
      range: "£2,000 – £5,000",
      desc: "Multiple interconnected automations across your operations. Built as a system, not a collection of scripts.",
      features: ["Multi-workflow architecture", "Full stack integration", "CRM + email + data sync", "4-week delivery", "Monthly optimisation included"],
      monthly: "£300/month support",
      highlight: true,
    },
    {
      name: "Enterprise Automation",
      range: "£5,000+",
      desc: "A complete AI automation infrastructure. Custom-built for complex operations at scale.",
      features: ["Full operational audit", "Custom AI integrations", "Unlimited integrations", "Ongoing build phases", "Dedicated partnership"],
      monthly: "£500/month support",
      highlight: false,
    },
  ];
  return (
    <section id="pricing" style={{ padding: "100px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div ref={ref} className="fade-in" style={{ textAlign: "center", marginBottom: 64 }}>
        <div className="section-label" style={{ justifyContent: "center" }}>Indicative Pricing</div>
        <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
          Scoped to what you actually need.
        </h2>
        <p style={{ color: C.muted, marginTop: 16, fontSize: 15, maxWidth: 500, margin: "16px auto 0" }}>
          Every system is priced after scoping. These ranges give you a realistic expectation before we talk.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {tiers.map((t, i) => (
          <PricingCard key={i} {...t} onApply={onApply} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}

function PricingCard({ name, range, desc, features, monthly, highlight, onApply, delay }) {
  const ref = useFadeIn(0.1);
  return (
    <div ref={ref} className="fade-in hover-lift" style={{
      background: highlight ? `linear-gradient(160deg, ${C.primary}22 0%, ${C.card} 60%)` : C.card,
      border: `1px solid ${highlight ? C.primary + "60" : C.border}`,
      borderRadius: 14, padding: "32px 28px",
      position: "relative", transitionDelay: `${delay}ms`,
    }}>
      {highlight && (
        <div style={{
          position: "absolute", top: -1, left: 32,
          background: C.primary, padding: "3px 12px", borderRadius: "0 0 8px 8px",
          fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "white",
        }}>MOST POPULAR</div>
      )}
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 400 }}>{name}</div>
      <div className="display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 12, color: highlight ? C.primaryL : C.text }}>
        {range}
      </div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 28 }}>{desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {features.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 5,
              background: `${C.primary}20`, display: "flex", alignItems: "center", justifyContent: "center",
              color: C.primaryL, flexShrink: 0,
            }}>
              <Icon.Check />
            </div>
            <span style={{ fontSize: 13, color: C.muted }}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: C.subtle, marginBottom: 24 }}>{monthly}</div>
      <button className={highlight ? "btn-primary" : "btn-ghost"} onClick={onApply} style={{ width: "100%", justifyContent: "center" }}>
        Apply Now
      </button>
    </div>
  );
}

// ── AUTOMATION PLANNER ─────────────────────────────────────────────────────────
const PLANNER_NEEDS = [
  { id: "leads", label: "Lead capture & automation", score: 1.2, hours: 4 },
  { id: "crm", label: "CRM integration", score: 1.5, hours: 3 },
  { id: "email", label: "Email automation workflows", score: 1.0, hours: 5 },
  { id: "support", label: "Customer support automation", score: 1.3, hours: 6 },
  { id: "internal", label: "Internal business workflows", score: 1.4, hours: 4 },
  { id: "knowledge", label: "AI knowledge base", score: 1.8, hours: 2 },
  { id: "data", label: "Data syncing between tools", score: 1.1, hours: 3 },
  { id: "booking", label: "Appointment booking system", score: 1.0, hours: 3 },
];

const COMPLEXITY_LEVELS = [
  { id: "simple", label: "Simple", sub: "Single workflow", mult: 1.0, scoreMult: 1 },
  { id: "business", label: "Business System", sub: "Multiple workflows + integrations", mult: 2.5, scoreMult: 2.2 },
  { id: "enterprise", label: "Full Ecosystem", sub: "Complete AI automation infrastructure", mult: 5.0, scoreMult: 4 },
];

const TOOLS = ["HubSpot", "Salesforce", "Notion", "Airtable", "Google Sheets", "Shopify", "WordPress", "Slack", "Gmail", "Stripe", "Custom/Bespoke", "None yet"];

function AutomationPlanner() {
  const [step, setStep] = useState(1);
  const [needs, setNeeds] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const [tools, setTools] = useState([]);
  const [result, setResult] = useState(null);
  const ref = useFadeIn();

  const toggleNeed = (id) => setNeeds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleTool = (t) => setTools(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const calculate = () => {
    const selectedNeeds = PLANNER_NEEDS.filter(n => needs.includes(n.id));
    const comp = COMPLEXITY_LEVELS.find(c => c.id === complexity);
    if (!comp || selectedNeeds.length === 0) return;

    const baseScore = selectedNeeds.reduce((acc, n) => acc + n.score, 0);
    const rawScore = Math.min(10, Math.round(baseScore * comp.scoreMult));
    const baseUpfront = selectedNeeds.length * 600 * comp.mult;
    const upfrontMin = Math.round(baseUpfront * 0.85 / 100) * 100;
    const upfrontMax = Math.round(baseUpfront * 1.4 / 100) * 100;
    const monthlyMin = comp.mult === 1 ? 150 : comp.mult === 2.5 ? 300 : 500;
    const monthlyMax = comp.mult === 1 ? 250 : comp.mult === 2.5 ? 500 : 1000;
    const hoursMin = selectedNeeds.reduce((acc, n) => acc + n.hours, 0);
    const hoursMax = Math.round(hoursMin * 1.6);

    const stacks = {
      simple: ["n8n", "Zapier"],
      business: ["n8n", "Make", tools.includes("HubSpot") ? "HubSpot" : "Airtable"],
      enterprise: ["n8n", "Make", "Claude AI", "Custom APIs"],
    };

    setResult({ rawScore, upfrontMin, upfrontMax, monthlyMin, monthlyMax, hoursMin, hoursMax, stack: stacks[complexity] });
    setStep(4);
  };

  const reset = () => { setStep(1); setNeeds([]); setComplexity(null); setTools([]); setResult(null); };

  return (
    <section id="planner" style={{ padding: "100px 32px", background: `${C.surface}30` }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div ref={ref} className="fade-in" style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Automation Planner</div>
          <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Design your automation system.
          </h2>
          <p style={{ color: C.muted, marginTop: 16, fontSize: 15 }}>
            Tell us what you need. We'll estimate the cost, complexity, and time you'll reclaim.
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 48 }}>
          {["Needs", "Scale", "Tools", "Results"].map((label, i) => {
            const active = step === i + 1;
            const done = step > i + 1;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: done ? C.primary : active ? `${C.primary}30` : C.surface,
                  border: `1px solid ${done || active ? C.primary : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 600, color: done ? "white" : active ? C.primaryL : C.subtle,
                  transition: "all 0.3s",
                }}>
                  {done ? <Icon.Check /> : i + 1}
                </div>
                <span style={{ fontSize: 12, color: active ? C.text : C.subtle, display: window.innerWidth > 480 ? "block" : "none" }}>{label}</span>
                {i < 3 && <div style={{ width: 24, height: 1, background: done ? C.primary : C.border, transition: "background 0.3s" }} />}
              </div>
            );
          })}
        </div>

        {/* Planner card */}
        <div className="grad-border" style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: "40px 40px",
          minHeight: 380,
        }}>
          {step === 1 && (
            <PlannerStep1 needs={needs} onToggle={toggleNeed} onNext={() => needs.length > 0 && setStep(2)} />
          )}
          {step === 2 && (
            <PlannerStep2 complexity={complexity} onSelect={setComplexity} onBack={() => setStep(1)} onNext={() => complexity && setStep(3)} />
          )}
          {step === 3 && (
            <PlannerStep3 tools={tools} onToggle={toggleTool} onBack={() => setStep(2)} onCalc={calculate} />
          )}
          {step === 4 && result && (
            <PlannerResults result={result} needs={needs} onReset={reset} />
          )}
        </div>
      </div>
    </section>
  );
}

function PlannerStep1({ needs, onToggle, onNext }) {
  return (
    <div>
      <h3 className="display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
        What do you need automated?
      </h3>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>Select all that apply — you can add more later.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 32 }}>
        {PLANNER_NEEDS.map(n => {
          const sel = needs.includes(n.id);
          return (
            <div key={n.id} onClick={() => onToggle(n.id)} style={{
              padding: "14px 18px", borderRadius: 10,
              border: `1px solid ${sel ? C.primary : C.border}`,
              background: sel ? `${C.primary}14` : C.surface,
              cursor: "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 5,
                background: sel ? C.primary : C.surface,
                border: `1px solid ${sel ? C.primary : C.borderHi}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.2s",
              }}>
                {sel && <Icon.Check />}
              </div>
              <span style={{ fontSize: 13, color: sel ? C.text : C.muted }}>{n.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-primary" onClick={onNext} disabled={needs.length === 0}
          style={{ opacity: needs.length === 0 ? 0.4 : 1, cursor: needs.length === 0 ? "not-allowed" : "pointer" }}>
          Next: Choose Scale <Icon.ChevronRight />
        </button>
      </div>
    </div>
  );
}

function PlannerStep2({ complexity, onSelect, onBack, onNext }) {
  return (
    <div>
      <h3 className="display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
        What scale of system are you building?
      </h3>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>This shapes the architecture and investment level.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {COMPLEXITY_LEVELS.map(c => {
          const sel = complexity === c.id;
          return (
            <div key={c.id} onClick={() => onSelect(c.id)} style={{
              padding: "20px 24px", borderRadius: 10,
              border: `1px solid ${sel ? C.primary : C.border}`,
              background: sel ? `${C.primary}12` : C.surface,
              cursor: "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: sel ? C.text : C.muted, marginBottom: 3 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: C.subtle }}>{c.sub}</div>
              </div>
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                border: `2px solid ${sel ? C.primary : C.border}`,
                background: sel ? C.primary : "transparent",
                transition: "all 0.2s", flexShrink: 0,
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onNext} disabled={!complexity}
          style={{ opacity: !complexity ? 0.4 : 1, cursor: !complexity ? "not-allowed" : "pointer" }}>
          Next: Tools <Icon.ChevronRight />
        </button>
      </div>
    </div>
  );
}

function PlannerStep3({ tools, onToggle, onBack, onCalc }) {
  return (
    <div>
      <h3 className="display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
        What tools do you currently use?
      </h3>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>Helps us estimate integration complexity. Select all that apply.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
        {TOOLS.map(t => {
          const sel = tools.includes(t);
          return (
            <div key={t} onClick={() => onToggle(t)} style={{
              padding: "9px 18px", borderRadius: 100,
              border: `1px solid ${sel ? C.primary : C.border}`,
              background: sel ? `${C.primary}16` : C.surface,
              color: sel ? C.primaryL : C.muted,
              cursor: "pointer", fontSize: 13, fontWeight: 500,
              transition: "all 0.2s",
            }}>
              {t}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onCalc}>
          <Icon.Sparkle /> Generate My Plan
        </button>
      </div>
    </div>
  );
}

function PlannerResults({ result, needs, onReset }) {
  const { rawScore, upfrontMin, upfrontMax, monthlyMin, monthlyMax, hoursMin, hoursMax, stack } = result;
  const selectedNeeds = PLANNER_NEEDS.filter(n => needs.includes(n.id));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div className="section-label" style={{ marginBottom: 6 }}>Your Automation Blueprint</div>
          <h3 className="display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>System estimate generated.</h3>
        </div>
        <button className="btn-ghost" onClick={onReset} style={{ fontSize: 12 }}>Start over</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 32 }}>
        {[
          { label: "Estimated investment", val: `£${upfrontMin.toLocaleString()} – £${upfrontMax.toLocaleString()}`, color: C.primaryL },
          { label: "Monthly optimisation", val: `£${monthlyMin} – £${monthlyMax}/mo`, color: C.text },
          { label: "Complexity score", val: `${rawScore} / 10`, color: rawScore >= 7 ? "#F59E0B" : rawScore >= 4 ? C.primaryL : "#10B981" },
          { label: "Time reclaimed", val: `${hoursMin}–${hoursMax} hrs/wk`, color: "#10B981" },
        ].map(m => (
          <div key={m.label} style={{
            padding: "20px 20px", borderRadius: 10,
            background: C.surface, border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>{m.label}</div>
            <div className="display" style={{ fontSize: 20, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 28 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Automation needs identified</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {selectedNeeds.map(n => (
              <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: C.muted }}>{n.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Suggested stack</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {stack.map(s => (
              <span key={s} style={{
                fontSize: 12, padding: "4px 12px", borderRadius: 100,
                background: `${C.primary}18`, border: `1px solid ${C.primary}30`,
                color: C.primaryL,
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        padding: "16px 20px", borderRadius: 10,
        background: `${C.primary}10`, border: `1px solid ${C.primary}25`,
        fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 24,
      }}>
        <strong style={{ color: C.primaryL }}>Next step:</strong> Apply for your free automation plan. We'll review your requirements and send you a precise scoping proposal — no obligation.
      </div>

      <button className="btn-primary" onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}
        style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: 15 }}>
        Apply for a Free Automation Plan <Icon.ArrowRight />
      </button>
    </div>
  );
}

// ── APPLICATION FORM ───────────────────────────────────────────────────────────
function ApplicationForm() {
  const ref = useFadeIn();
  const [form, setForm] = useState({
    business: "", website: "", industry: "",
    problem: "", automate: "", tools: "",
    budget: "", timeline: "", contact: "email", email: "", whatsapp: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.business || !form.problem || !form.budget) return;
    setSubmitted(true);
  };

  return (
    <section id="apply" style={{ padding: "100px 32px", background: `${C.surface}30` }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div ref={ref} className="fade-in" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Apply</div>
          <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Apply for a Free Automation Plan
          </h2>
          <p style={{ color: C.muted, marginTop: 14, fontSize: 15, lineHeight: 1.6 }}>
            We review every application personally. If there's a fit, you'll hear from us within 24 hours via your preferred channel.
          </p>
        </div>

        {submitted ? (
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "60px 40px", textAlign: "center",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#10B98120", border: "1px solid #10B98140",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px", color: "#10B981",
            }}>
              <Icon.Check />
            </div>
            <h3 className="display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em" }}>Application received.</h3>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.65 }}>
              We'll review your details and be in touch within 24 hours. If we're a good fit, we'll reach out via {form.contact === "email" ? `email at ${form.email}` : `WhatsApp`} with next steps.
            </p>
          </div>
        ) : (
          <div className="grad-border" style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "40px 36px",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label>Business name *</label>
                <input value={form.business} onChange={set("business")} placeholder="Acme Ltd" />
              </div>
              <div>
                <label>Website</label>
                <input value={form.website} onChange={set("website")} placeholder="acme.com" />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>Industry *</label>
              <select value={form.industry} onChange={set("industry")}>
                <option value="">Select your industry</option>
                {["E-Commerce", "Professional Services", "Healthcare", "Property", "Finance", "Marketing Agency", "SaaS / Tech", "Retail", "Construction", "Other"].map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>What's your biggest operational bottleneck? *</label>
              <textarea value={form.problem} onChange={set("problem")} rows={3}
                placeholder="e.g. We spend 15 hours a week manually moving lead data between our CRM and spreadsheets..."
                style={{ resize: "vertical" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>What do you want automated?</label>
              <textarea value={form.automate} onChange={set("automate")} rows={2}
                placeholder="e.g. Lead qualification, email follow-up, customer onboarding..."
                style={{ resize: "vertical" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>Tools you currently use</label>
              <input value={form.tools} onChange={set("tools")} placeholder="HubSpot, Notion, Shopify, Gmail..." />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label>Budget range *</label>
                <select value={form.budget} onChange={set("budget")}>
                  <option value="">Select a range</option>
                  {["£500 – £1,500", "£1,500 – £3,000", "£3,000 – £5,000", "£5,000 – £10,000", "£10,000+"].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Timeline</label>
                <select value={form.timeline} onChange={set("timeline")}>
                  <option value="">When do you need this?</option>
                  {["As soon as possible", "Within a month", "1–3 months", "Flexible"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>Preferred contact method</label>
              <div style={{ display: "flex", gap: 10 }}>
                {["email", "whatsapp"].map(c => (
                  <div key={c} onClick={() => setForm(p => ({ ...p, contact: c }))} style={{
                    padding: "10px 20px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${form.contact === c ? C.primary : C.border}`,
                    background: form.contact === c ? `${C.primary}14` : C.surface,
                    color: form.contact === c ? C.primaryL : C.muted,
                    fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                    textTransform: "capitalize",
                  }}>{c}</div>
                ))}
              </div>
            </div>
            {form.contact === "email" ? (
              <div style={{ marginBottom: 28 }}>
                <label>Email address *</label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="you@yourbusiness.com" />
              </div>
            ) : (
              <div style={{ marginBottom: 28 }}>
                <label>WhatsApp number *</label>
                <input type="tel" value={form.whatsapp} onChange={set("whatsapp")} placeholder="+44 7700 000000" />
              </div>
            )}
            <button className="btn-primary" onClick={handleSubmit}
              disabled={!form.business || !form.problem || !form.budget}
              style={{
                width: "100%", justifyContent: "center", padding: "15px",
                fontSize: 15, opacity: (!form.business || !form.problem || !form.budget) ? 0.5 : 1,
                cursor: (!form.business || !form.problem || !form.budget) ? "not-allowed" : "pointer",
              }}>
              Submit Application <Icon.ArrowRight />
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: C.subtle, marginTop: 16 }}>
              We review all applications within 24 hours. No commitment required.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── BENEFITS ───────────────────────────────────────────────────────────────────
function Benefits() {
  const ref = useFadeIn();
  const benefits = [
    { icon: Icon.Clock, title: "Time you actually get back", desc: "Not hours saved on paper. Systems that eliminate entire categories of work from your week." },
    { icon: Icon.TrendUp, title: "Scale without more headcount", desc: "Grow revenue without proportionally growing your team or your workload." },
    { icon: Icon.Shield, title: "Built to last", desc: "Every system is documented, tested, and stable. Not fragile scripts that break when something changes." },
    { icon: Icon.Sparkle, title: "Selective by design", desc: "We take 2–3 clients per month. Your project gets the full focus it deserves, not a conveyor belt." },
  ];
  return (
    <section style={{ padding: "80px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div ref={ref} className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 32 }}>
        {benefits.map((b, i) => (
          <div key={i}>
            <div style={{ color: C.primaryL, marginBottom: 14 }}><b.icon /></div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>{b.title}</h3>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────────
function Footer({ onApply }) {
  return (
    <footer style={{
      padding: "80px 32px 40px",
      borderTop: `1px solid ${C.border}`,
      background: C.surface,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* CTA banner */}
        <div style={{
          textAlign: "center", padding: "64px 32px",
          background: `linear-gradient(160deg, ${C.primary}18 0%, transparent 60%)`,
          border: `1px solid ${C.primary}25`, borderRadius: 20, marginBottom: 64,
        }}>
          <h2 className="display" style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Ready to stop doing it manually?
          </h2>
          <p style={{ color: C.muted, fontSize: 15, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
            Apply for a free automation plan. No calls, no obligation — just a clear picture of what's possible for your business.
          </p>
          <button className="btn-primary" onClick={onApply} style={{ padding: "14px 32px", fontSize: 15 }}>
            Apply Now <Icon.ArrowRight />
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryD})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span className="display" style={{ fontWeight: 600, fontSize: 15 }}>Marina Solutions</span>
          </div>
          <p style={{ fontSize: 12, color: C.subtle }}>© {new Date().getFullYear()} Marina Solutions. AI Automation Agency.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms"].map(l => (
              <span key={l} style={{ fontSize: 12, color: C.subtle, cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── ROI CALCULATOR ─────────────────────────────────────────────────────────────
function ROICalculator({ onApply }) {
  const ref = useFadeIn();
  const [vals, setVals] = useState({
    hourlyRate: 35,
    hoursWasted: 10,
    teamSize: 3,
    avgDealValue: 2000,
    leadsLost: 4,
    errorCost: 500,
  });
  const [investmentTier, setInvestmentTier] = useState("business");

  const set = (k) => (e) => setVals(p => ({ ...p, [k]: Number(e.target.value) }));

  const tiers = {
    simple:     { label: "Starter", cost: 1000,  monthly: 150 },
    business:   { label: "Business System", cost: 3500, monthly: 300 },
    enterprise: { label: "Enterprise", cost: 7500, monthly: 500 },
  };

  const tier = tiers[investmentTier];

  // Calculations
  const weeklyHoursSaved   = vals.hoursWasted * vals.teamSize * 0.75; // 75% of wasted hours recovered
  const annualHoursSaved   = weeklyHoursSaved * 52;
  const labourSaved        = Math.round(annualHoursSaved * vals.hourlyRate);
  const revenueRecovered   = vals.leadsLost * vals.avgDealValue * 12 * 0.4; // 40% of lost leads recovered
  const errorSaved         = vals.errorCost * 12 * 0.8; // 80% error reduction
  const totalAnnualBenefit = labourSaved + revenueRecovered + errorSaved;
  const totalCost          = tier.cost + tier.monthly * 12;
  const netROI             = totalAnnualBenefit - totalCost;
  const roiPercent         = totalCost > 0 ? Math.round((netROI / totalCost) * 100) : 0;
  const paybackWeeks       = totalCost > 0 && weeklyHoursSaved > 0
    ? Math.round(totalCost / (totalAnnualBenefit / 52))
    : 0;

  const fmt = (n) => n >= 1000 ? `£${(n / 1000).toFixed(1)}k` : `£${Math.round(n)}`;

  const sliders = [
    { key: "hourlyRate",   label: "Average hourly staff cost",    min: 10,  max: 150, step: 5,  suffix: "/hr",   prefix: "£" },
    { key: "hoursWasted",  label: "Hours lost to manual tasks (per person/wk)", min: 1, max: 40, step: 1, suffix: "hrs/wk", prefix: "" },
    { key: "teamSize",     label: "Number of people affected",    min: 1,   max: 50,  step: 1,  suffix: " people", prefix: "" },
    { key: "avgDealValue", label: "Average deal / order value",   min: 100, max: 50000, step: 100, suffix: "",  prefix: "£" },
    { key: "leadsLost",    label: "Leads lost monthly due to slow follow-up", min: 0, max: 50, step: 1, suffix: "/mo", prefix: "" },
    { key: "errorCost",    label: "Monthly cost of manual errors", min: 0,  max: 10000, step: 100, suffix: "/mo", prefix: "£" },
  ];

  return (
    <section id="roi" style={{ padding: "100px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div ref={ref} className="fade-in" style={{ textAlign: "center", marginBottom: 64 }}>
        <div className="section-label" style={{ justifyContent: "center" }}>ROI Calculator</div>
        <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
          What is manual work actually costing you?
        </h2>
        <p style={{ color: C.muted, marginTop: 14, fontSize: 15, maxWidth: 520, margin: "14px auto 0" }}>
          Adjust the inputs to match your business. The numbers update in real time.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

        {/* Left: inputs */}
        <div className="grad-border" style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: "36px 32px",
        }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.muted, marginBottom: 28, letterSpacing: "0.02em" }}>
            Your current situation
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {sliders.map(s => (
              <div key={s.key}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <label style={{ fontSize: 13, color: C.muted, marginBottom: 0 }}>{s.label}</label>
                  <span style={{
                    fontSize: 15, fontWeight: 600, color: C.primaryL,
                    fontFamily: "monospace", minWidth: 70, textAlign: "right",
                  }}>
                    {s.prefix}{vals[s.key].toLocaleString()}{s.suffix}
                  </span>
                </div>
                <div style={{ position: "relative", height: 4, background: C.border, borderRadius: 2 }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, height: "100%",
                    width: `${((vals[s.key] - s.min) / (s.max - s.min)) * 100}%`,
                    background: `linear-gradient(90deg, ${C.primaryD}, ${C.primaryL})`,
                    borderRadius: 2, transition: "width 0.15s",
                  }} />
                  <input type="range" min={s.min} max={s.max} step={s.step}
                    value={vals[s.key]} onChange={set(s.key)}
                    style={{
                      position: "absolute", inset: 0, width: "100%", height: "100%",
                      opacity: 0, cursor: "pointer", margin: 0, padding: 0,
                      WebkitAppearance: "none",
                    }} />
                  {/* thumb visual */}
                  <div style={{
                    position: "absolute", top: "50%", transform: "translateY(-50%)",
                    left: `calc(${((vals[s.key] - s.min) / (s.max - s.min)) * 100}% - 8px)`,
                    width: 16, height: 16, borderRadius: "50%",
                    background: C.primaryL, border: `2px solid ${C.card}`,
                    boxShadow: `0 0 0 2px ${C.primary}`,
                    transition: "left 0.15s", pointerEvents: "none",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Investment tier picker */}
          <div style={{ marginTop: 36, paddingTop: 28, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>Automation investment level</div>
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(tiers).map(([id, t]) => (
                <div key={id} onClick={() => setInvestmentTier(id)} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 8, cursor: "pointer", textAlign: "center",
                  border: `1px solid ${investmentTier === id ? C.primary : C.border}`,
                  background: investmentTier === id ? `${C.primary}14` : C.surface,
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: investmentTier === id ? C.primaryL : C.muted }}>{t.label}</div>
                  <div style={{ fontSize: 10, color: C.subtle, marginTop: 2 }}>£{t.cost.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Big ROI number */}
          <div style={{
            background: `linear-gradient(135deg, ${C.primary}22 0%, ${C.card} 70%)`,
            border: `1px solid ${C.primary}40`, borderRadius: 16,
            padding: "32px 28px", textAlign: "center",
          }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              First-year net return
            </div>
            <div className="display" style={{
              fontSize: "clamp(44px, 6vw, 64px)", fontWeight: 700,
              letterSpacing: "-0.04em", lineHeight: 1,
              color: netROI > 0 ? C.primaryL : "#EF4444",
              transition: "color 0.3s",
            }}>
              {netROI >= 0 ? "+" : ""}{fmt(netROI)}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>
              {roiPercent > 0 ? `${roiPercent}% ROI` : "Adjust inputs above"} · payback in {paybackWeeks > 0 ? `${paybackWeeks} weeks` : "—"}
            </div>
          </div>

          {/* Breakdown cards */}
          {[
            { label: "Labour time recovered", val: fmt(labourSaved), sub: `${Math.round(annualHoursSaved)} hours/yr at ${fmt(vals.hourlyRate)}/hr`, color: C.primaryL },
            { label: "Revenue from recovered leads", val: fmt(revenueRecovered), sub: `~40% of ${vals.leadsLost} lost leads/mo recaptured`, color: "#34D399" },
            { label: "Error & rework costs eliminated", val: fmt(errorSaved), sub: "80% reduction in manual errors", color: "#FBBF24" },
          ].map(r => (
            <div key={r.label} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "20px 22px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: C.subtle }}>{r.sub}</div>
              </div>
              <div className="display" style={{ fontSize: 22, fontWeight: 700, color: r.color, letterSpacing: "-0.02em", flexShrink: 0, marginLeft: 16 }}>
                {r.val}
              </div>
            </div>
          ))}

          {/* Cost vs benefit */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "20px 22px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted }}>Annual benefit</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.primaryL }}>{fmt(totalAnnualBenefit)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: C.muted }}>Total investment (build + 12mo support)</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>−{fmt(totalCost)}</span>
            </div>
            <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>Net year-one return</span>
              <span className="display" style={{ fontSize: 16, fontWeight: 700, color: netROI >= 0 ? C.primaryL : "#EF4444" }}>
                {netROI >= 0 ? "+" : ""}{fmt(netROI)}
              </span>
            </div>
          </div>

          <button className="btn-primary" onClick={onApply} style={{ justifyContent: "center", padding: "14px", fontSize: 14 }}>
            Get My Free Automation Plan <Icon.ArrowRight />
          </button>
        </div>
      </div>

      {/* Mobile stacking fix */}
      <style>{`
        @media (max-width: 768px) {
          #roi > div > div:last-child { grid-column: 1; }
          #roi > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function MarinaSolutionsSite() {
  const scrollToApply = () => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  const scrollToPlanner = () => document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <FontLoader />
      <style>{globalCSS}</style>
      <Nav onApply={scrollToApply} />
      <main>
        <Hero onApply={scrollToApply} onPlanner={scrollToPlanner} />
        <Problem />
        <Services />
        <HowItWorks />
        <CaseStudies />
        <Benefits />
        <Pricing onApply={scrollToApply} />
        <AutomationPlanner />
        <ROICalculator onApply={scrollToApply} />
        <ApplicationForm />
      </main>
      <Footer onApply={scrollToApply} />
    </>
  );
}