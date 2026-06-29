import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const tokens = {
  ink: "#0A0F0F",
  surface: "#0F1517",
  surfaceHover: "#141C1E",
  border: "#1E2A2B",
  borderHover: "#2A3A3B",
  teal: "#0D9488",
  tealLight: "#2DD4BF",
  tealDim: "#0A6B62",
  text: "#E8EDEC",
  muted: "#6B7F7E",
  mutedLight: "#8A9D9C",
  error: "#F87171",
};

// ─── Global Styles (injected once) ────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background: ${tokens.ink};
      color: ${tokens.text};
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    ::selection { background: ${tokens.teal}33; color: ${tokens.tealLight}; }

    :focus-visible {
      outline: 2px solid ${tokens.teal};
      outline-offset: 3px;
      border-radius: 3px;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${tokens.ink}; }
    ::-webkit-scrollbar-thumb { background: ${tokens.border}; border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: ${tokens.muted}; }
  `}</style>
);

// ─── Utility: useIntersection ─────────────────────────────────────────────────
function useIntersection(ref, options = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12, ...options }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

// ─── Animate In wrapper ───────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, children, style = {}, noPad = false }) {
  return (
    <section
      id={id}
      style={{
        padding: noPad ? "0" : "96px 24px",
        maxWidth: "100%",
        ...style,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{
      height: 1,
      background: `linear-gradient(90deg, transparent, ${tokens.border} 20%, ${tokens.border} 80%, transparent)`,
      maxWidth: 1120,
      margin: "0 auto",
    }} />
  );
}

// ─── Label / Eyebrow ─────────────────────────────────────────────────────────
function Eyebrow({ children }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: tokens.teal,
      marginBottom: 16,
    }}>
      <span style={{
        display: "inline-block", width: 16, height: 1,
        background: tokens.teal,
      }} />
      {children}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
function Button({ children, onClick, variant = "primary", size = "md", style = {}, disabled = false, type = "button" }) {
  const [hovered, setHovered] = useState(false);

  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "inherit",
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    borderRadius: 6,
    transition: "all 0.18s ease",
    opacity: disabled ? 0.45 : 1,
    letterSpacing: "-0.01em",
    type,
  };

  const sizes = {
    sm: { fontSize: 13, padding: "8px 16px" },
    md: { fontSize: 14, padding: "11px 22px" },
    lg: { fontSize: 15, padding: "14px 28px" },
  };

  const variants = {
    primary: {
      background: hovered ? tokens.tealLight : tokens.teal,
      color: "#fff",
      boxShadow: hovered ? `0 0 24px ${tokens.teal}44` : "none",
    },
    secondary: {
      background: hovered ? tokens.surfaceHover : "transparent",
      color: hovered ? tokens.text : tokens.mutedLight,
      border: `1px solid ${hovered ? tokens.borderHover : tokens.border}`,
    },
    ghost: {
      background: "transparent",
      color: hovered ? tokens.tealLight : tokens.muted,
      padding: "0",
      gap: 6,
    },
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Results", href: "#results" },
    { label: "Pricing", href: "#roi" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 24px",
        background: scrolled ? `${tokens.ink}EE` : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${tokens.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 64,
        }}>
          {/* Logo */}
          <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke={tokens.teal} strokeWidth="1.5" />
              <path d="M6 14 C8 8, 14 8, 16 14" stroke={tokens.teal} strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <circle cx="11" cy="11" r="2" fill={tokens.teal} />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: tokens.text, letterSpacing: "-0.02em" }}>
              Marina Solutions
            </span>
          </a>

          {/* Desktop Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="desktop-nav">
            {links.map(l => (
              <a key={l.href} href={l.href} style={{
                fontSize: 13, color: tokens.muted, textDecoration: "none",
                transition: "color 0.18s",
                fontWeight: 450,
              }}
                onMouseEnter={e => e.target.style.color = tokens.text}
                onMouseLeave={e => e.target.style.color = tokens.muted}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              size="sm"
              onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}
            >
              Apply Now
            </Button>
            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "none", background: "none", border: "none",
                cursor: "pointer", color: tokens.muted, padding: 4,
              }}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {menuOpen
                  ? <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  : <>
                    <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
          background: tokens.surface,
          borderBottom: `1px solid ${tokens.border}`,
          padding: "24px",
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block", fontSize: 15, color: tokens.text,
                textDecoration: "none", padding: "12px 0",
                borderBottom: `1px solid ${tokens.border}`,
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [lineDrawn, setLineDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLineDrawn(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <Section id="hero" style={{ padding: "168px 24px 96px" }}>
      {/* Signature line — the single motion moment */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 160,
        height: 1, overflow: "hidden", pointerEvents: "none",
      }}>
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${tokens.teal}66 30%, ${tokens.teal}44 70%, transparent)`,
          transform: lineDrawn ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left center",
          transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          maxWidth: 1440, margin: "0 auto",
        }} />
      </div>

      <div style={{ maxWidth: 780 }}>
        <div style={{
          opacity: 0,
          animation: "fadeUp 0.65s ease 0.2s forwards",
        }}>
          <Eyebrow>AI Automation Agency</Eyebrow>
        </div>

        <h1 style={{
          fontSize: "clamp(40px, 6vw, 72px)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.06,
          color: tokens.text,
          marginBottom: 28,
          opacity: 0,
          animation: "fadeUp 0.65s ease 0.35s forwards",
        }}>
          Your business runs on<br />
          <span style={{ color: tokens.teal }}>repetition.</span>
          {" "}We remove it.
        </h1>

        <p style={{
          fontSize: 18,
          lineHeight: 1.7,
          color: tokens.muted,
          maxWidth: 520,
          marginBottom: 40,
          opacity: 0,
          animation: "fadeUp 0.65s ease 0.5s forwards",
          fontWeight: 400,
        }}>
          Marina Solutions builds bespoke automation systems for established businesses.
          We connect your tools, eliminate manual work, and give your team back the hours they spend on process.
        </p>

        <div style={{
          display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center",
          opacity: 0,
          animation: "fadeUp 0.65s ease 0.65s forwards",
        }}>
          <Button
            size="lg"
            onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}
          >
            Apply for a consultation
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}
          >
            See how it works
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Metrics strip */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 0,
        marginTop: 96,
        borderTop: `1px solid ${tokens.border}`,
        borderLeft: `1px solid ${tokens.border}`,
        borderRadius: 8,
        overflow: "hidden",
        opacity: 0,
        animation: "fadeUp 0.65s ease 0.8s forwards",
      }}>
        {[
          { stat: "40+", label: "Automations deployed" },
          { stat: "14hrs", label: "Average weekly hours saved" },
          { stat: "97%", label: "Client retention rate" },
          { stat: "8 weeks", label: "Typical time to first result" },
        ].map((m, i) => (
          <div key={i} style={{
            padding: "28px 28px",
            borderRight: `1px solid ${tokens.border}`,
            borderBottom: `1px solid ${tokens.border}`,
          }}>
            <div style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: tokens.text,
              marginBottom: 4,
            }}>
              {m.stat}
            </div>
            <div style={{ fontSize: 13, color: tokens.muted, lineHeight: 1.4 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Section>
  );
}

// ─── Problem Statement ────────────────────────────────────────────────────────
function Problem() {
  return (
    <>
      <Divider />
      <Section id="problem" style={{ padding: "96px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <FadeIn>
            <Eyebrow>The problem</Eyebrow>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: tokens.text,
              marginBottom: 20,
            }}>
              Growth creates process.<br />Process creates drag.
            </h2>
            <p style={{ fontSize: 16, color: tokens.muted, lineHeight: 1.75, maxWidth: 420 }}>
              Every successful business reaches a point where the systems that once worked start holding it back.
              Your team spends hours on tasks that should happen automatically.
              Data sits in silos. Handoffs break down. Decisions get delayed because information is missing.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Manual data entry", desc: "Information copied between systems that should communicate automatically." },
                { label: "Broken handoffs", desc: "Work that stalls between departments because there is no reliable process." },
                { label: "Delayed decisions", desc: "Reports that take days to produce, made from data that already exists." },
                { label: "Repetitive communication", desc: "Emails, follow-ups, and updates sent manually on a fixed schedule." },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: "20px 24px",
                  background: tokens.surface,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 8,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: tokens.teal, flexShrink: 0, marginTop: 8,
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: tokens.text, marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13, color: tokens.muted, lineHeight: 1.55 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  const services = [
    {
      title: "Workflow Automation",
      desc: "We map your existing processes, identify every manual step, and rebuild them as automated systems. What currently takes hours runs in seconds.",
      outcome: "Hours reclaimed per week",
    },
    {
      title: "System Integration",
      desc: "Your tools should communicate. We connect CRMs, project management platforms, payment processors, and any other system your team relies on.",
      outcome: "Unified operational data",
    },
    {
      title: "AI-Powered Workflows",
      desc: "Where automation needs intelligence — drafting documents, classifying data, generating reports — we integrate AI that acts on real business logic.",
      outcome: "Human-quality output at scale",
    },
    {
      title: "Reporting & Visibility",
      desc: "Replace manual reporting with live dashboards. Your team sees what matters, when they need it, without asking anyone to compile a spreadsheet.",
      outcome: "Decisions made on current data",
    },
  ];

  return (
    <>
      <Divider />
      <Section id="services" style={{ padding: "96px 24px" }}>
        <FadeIn>
          <div style={{ marginBottom: 56 }}>
            <Eyebrow>What we build</Eyebrow>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: tokens.text,
              maxWidth: 560,
            }}>
              Four types of system.<br />One consistent outcome.
            </h2>
          </div>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 1,
          background: tokens.border,
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${tokens.border}`,
        }}>
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 60}>
              <ServiceCard {...s} />
            </FadeIn>
          ))}
        </div>
      </Section>
    </>
  );
}

function ServiceCard({ title, desc, outcome }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "36px 32px",
        background: hovered ? tokens.surfaceHover : tokens.surface,
        transition: "background 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minHeight: 240,
      }}
    >
      <div style={{
        fontSize: 16, fontWeight: 600,
        color: tokens.text, letterSpacing: "-0.02em",
      }}>
        {title}
      </div>
      <p style={{ fontSize: 14, color: tokens.muted, lineHeight: 1.7, flex: 1 }}>
        {desc}
      </p>
      <div style={{
        fontSize: 12, fontWeight: 600,
        color: hovered ? tokens.tealLight : tokens.teal,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        display: "flex", alignItems: "center", gap: 6,
        transition: "color 0.2s ease",
      }}>
        <span style={{
          display: "inline-block", width: 12, height: 1,
          background: "currentColor",
        }} />
        {outcome}
      </div>
    </div>
  );
}

// ─── Process ──────────────────────────────────────────────────────────────────
function Process() {
  const steps = [
    {
      n: "01",
      title: "Audit",
      desc: "We spend time understanding how your business actually operates. We identify every manual process, every broken handoff, and every integration that is missing. You receive a detailed map of where automation will have the highest impact.",
      duration: "Week 1–2",
    },
    {
      n: "02",
      title: "Build",
      desc: "We design and build your automation systems to a production standard. Every workflow is tested against real data before it touches your live operations. Nothing is rushed.",
      duration: "Week 3–6",
    },
    {
      n: "03",
      title: "Handover",
      desc: "Every system we build is documented and handed over to your team with full training. We do not create dependency. You own everything we build, and your team understands how it works.",
      duration: "Week 7–8",
    },
  ];

  return (
    <>
      <Divider />
      <Section id="process" style={{ padding: "96px 24px" }}>
        <FadeIn>
          <div style={{ marginBottom: 64 }}>
            <Eyebrow>How it works</Eyebrow>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: tokens.text,
              maxWidth: 520,
            }}>
              A structured process.<br />Predictable outcomes.
            </h2>
          </div>
        </FadeIn>

        <div style={{ position: "relative" }}>
          {/* Connecting line */}
          <div style={{
            position: "absolute",
            left: 27,
            top: 52,
            bottom: 52,
            width: 1,
            background: `linear-gradient(${tokens.teal}44, ${tokens.border} 90%)`,
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "56px 1fr",
                  gap: "0 40px",
                  padding: "0 0 56px",
                }}>
                  {/* Step number */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 56, height: 56,
                      borderRadius: "50%",
                      border: `1.5px solid ${tokens.teal}66`,
                      background: tokens.surface,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700,
                      color: tokens.teal,
                      letterSpacing: "0.05em",
                      flexShrink: 0,
                    }}>
                      {step.n}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ paddingTop: 14 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12 }}>
                      <h3 style={{
                        fontSize: 20, fontWeight: 700,
                        letterSpacing: "-0.02em", color: tokens.text,
                      }}>
                        {step.title}
                      </h3>
                      <span style={{
                        fontSize: 12, color: tokens.muted,
                        fontWeight: 500,
                      }}>
                        {step.duration}
                      </span>
                    </div>
                    <p style={{ fontSize: 15, color: tokens.muted, lineHeight: 1.75, maxWidth: 520 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

// ─── Case Studies ─────────────────────────────────────────────────────────────
function Results() {
  const cases = [
    {
      industry: "Professional Services",
      result: "23 hours saved per week",
      desc: "A 12-person consulting firm was manually producing client reports from four separate systems. We automated the entire reporting pipeline. Reports now generate on demand.",
      metrics: [
        { label: "Hours saved weekly", value: "23" },
        { label: "Report turnaround", value: "4 min" },
        { label: "Errors eliminated", value: "100%" },
      ],
    },
    {
      industry: "E-commerce",
      result: "4× faster order processing",
      desc: "An online retailer's fulfilment team was manually routing orders between supplier, warehouse, and customer service. We built a single automated flow that handles all three.",
      metrics: [
        { label: "Processing speed", value: "4×" },
        { label: "Team hours freed", value: "31/wk" },
        { label: "Customer complaints", value: "−68%" },
      ],
    },
    {
      industry: "Financial Services",
      result: "£140k in recovered revenue",
      desc: "A financial services provider had no automated follow-up for lapsed clients. We built a re-engagement workflow driven by account activity. It runs without human input.",
      metrics: [
        { label: "Revenue recovered", value: "£140k" },
        { label: "Engagement rate", value: "34%" },
        { label: "Time invested", value: "0 hrs" },
      ],
    },
  ];

  return (
    <>
      <Divider />
      <Section id="results" style={{ padding: "96px 24px" }}>
        <FadeIn>
          <div style={{ marginBottom: 56 }}>
            <Eyebrow>Results</Eyebrow>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: tokens.text,
              maxWidth: 520,
            }}>
              What automation looks like<br />in practice.
            </h2>
          </div>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {cases.map((c, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div style={{
                padding: "36px 32px",
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                height: "100%",
              }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: tokens.teal, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                    {c.industry}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: tokens.text, marginBottom: 12 }}>
                    {c.result}
                  </div>
                  <p style={{ fontSize: 14, color: tokens.muted, lineHeight: 1.7 }}>
                    {c.desc}
                  </p>
                </div>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12, paddingTop: 20,
                  borderTop: `1px solid ${tokens.border}`,
                }}>
                  {c.metrics.map((m, j) => (
                    <div key={j}>
                      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: tokens.tealLight, marginBottom: 2 }}>
                        {m.value}
                      </div>
                      <div style={{ fontSize: 11, color: tokens.muted, lineHeight: 1.4 }}>
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>
    </>
  );
}

// ─── ROI Calculator ───────────────────────────────────────────────────────────
function ROICalculator() {
  const [values, setValues] = useState({
    teamSize: 8,
    hoursWasted: 5,
    hourlyRate: 45,
    revenuePerHour: 120,
  });

  const weeklyCost = values.teamSize * values.hoursWasted * values.hourlyRate;
  const annualCost = weeklyCost * 52;
  const annualRevenue = values.teamSize * values.hoursWasted * values.revenuePerHour * 52;
  const totalAnnual = annualCost + annualRevenue;

  const sliders = [
    { key: "teamSize", label: "Team size", min: 1, max: 50, suffix: " people" },
    { key: "hoursWasted", label: "Manual hours per person per week", min: 1, max: 30, suffix: "h/wk" },
    { key: "hourlyRate", label: "Average staff hourly cost", min: 15, max: 150, prefix: "£", suffix: "/hr" },
    { key: "revenuePerHour", label: "Revenue generated per billable hour", min: 50, max: 500, prefix: "£", suffix: "/hr" },
  ];

  const fmt = (n) => n >= 1000 ? `£${(n / 1000).toFixed(0)}k` : `£${n}`;

  return (
    <>
      <Divider />
      <Section id="roi" style={{ padding: "96px 24px" }}>
        <FadeIn>
          <div style={{ marginBottom: 56 }}>
            <Eyebrow>ROI Calculator</Eyebrow>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: tokens.text,
              maxWidth: 560,
            }}>
              What is manual process<br />actually costing you?
            </h2>
            <p style={{ fontSize: 16, color: tokens.muted, marginTop: 16, maxWidth: 460, lineHeight: 1.7 }}>
              Adjust the values to reflect your business. The numbers update instantly.
            </p>
          </div>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 48,
          alignItems: "start",
        }}>
          {/* Sliders */}
          <FadeIn>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {sliders.map(s => (
                <div key={s.key}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "baseline", marginBottom: 12,
                  }}>
                    <label style={{ fontSize: 14, color: tokens.muted, fontWeight: 450 }}>
                      {s.label}
                    </label>
                    <span style={{
                      fontSize: 16, fontWeight: 700,
                      color: tokens.text, letterSpacing: "-0.02em",
                      minWidth: 80, textAlign: "right",
                    }}>
                      {s.prefix || ""}{values[s.key]}{s.suffix}
                    </span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      value={values[s.key]}
                      onChange={e => setValues(v => ({ ...v, [s.key]: Number(e.target.value) }))}
                      style={{ width: "100%", accentColor: tokens.teal, cursor: "pointer", height: 4 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Output */}
          <FadeIn delay={100}>
            <div style={{
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: 10,
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 28,
              position: "sticky",
              top: 88,
            }}>
              <div style={{ fontSize: 13, color: tokens.muted, fontWeight: 500 }}>
                Annual cost of manual process
              </div>

              {[
                { label: "Labour cost", value: annualCost, desc: "Staff time spent on manual work" },
                { label: "Lost revenue", value: annualRevenue, desc: "Billable hours displaced" },
                { label: "Total opportunity", value: totalAnnual, highlight: true, desc: "Combined annual impact" },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: item.highlight ? "20px 24px" : "0",
                  background: item.highlight ? `${tokens.teal}11` : "transparent",
                  border: item.highlight ? `1px solid ${tokens.teal}33` : "none",
                  borderRadius: item.highlight ? 8 : 0,
                  borderTop: !item.highlight && i > 0 ? `1px solid ${tokens.border}` : "none",
                  paddingTop: !item.highlight && i > 0 ? 24 : undefined,
                }}>
                  <div style={{ fontSize: 12, color: tokens.muted, marginBottom: 6 }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: item.highlight ? 32 : 24,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: item.highlight ? tokens.tealLight : tokens.text,
                    transition: "all 0.15s ease",
                    marginBottom: 4,
                  }}>
                    {fmt(item.value)}
                  </div>
                  <div style={{ fontSize: 12, color: tokens.muted }}>{item.desc}</div>
                </div>
              ))}

              <Button
                onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}
                style={{ width: "100%" }}
              >
                Apply for a consultation
              </Button>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}

// ─── Automation Planner ───────────────────────────────────────────────────────
function AutomationPlanner() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [complete, setComplete] = useState(false);

  const questions = [
    {
      key: "industry",
      q: "What industry does your business operate in?",
      hint: "This helps us identify the most relevant automation patterns.",
      options: ["Professional Services", "E-commerce & Retail", "Financial Services", "Healthcare & Wellness", "Technology & SaaS", "Manufacturing", "Real Estate", "Other"],
    },
    {
      key: "size",
      q: "How large is your team?",
      hint: "Team size shapes the scope and complexity of automation that makes sense.",
      options: ["1–5 people", "6–15 people", "16–50 people", "50+ people"],
    },
    {
      key: "problem",
      q: "Where is your biggest source of manual work?",
      hint: "Be honest about where your team spends time they shouldn't.",
      options: ["Data entry & reporting", "Client communication & follow-ups", "Internal handoffs & approvals", "Onboarding & offboarding", "Order & project management", "Multiple areas equally"],
    },
    {
      key: "tools",
      q: "Which systems does your team rely on most?",
      hint: "We need to work with what you already have.",
      options: ["CRM (HubSpot, Salesforce, etc.)", "Project management (Asana, Monday, etc.)", "Accounting (Xero, QuickBooks, etc.)", "Communication (Slack, Teams, etc.)", "Custom or legacy software", "Google Workspace / Microsoft 365"],
    },
    {
      key: "timeline",
      q: "What is your expected timeline for implementation?",
      hint: "This helps us assess whether we are the right fit right now.",
      options: ["As soon as possible", "Within 3 months", "Within 6 months", "Exploring options, no fixed timeline"],
    },
  ];

  const q = questions[step];
  const progress = (step / questions.length) * 100;

  const select = (option) => {
    const newAnswers = { ...answers, [q.key]: option };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(s => s + 1), 200);
    } else {
      setTimeout(() => setComplete(true), 200);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setComplete(false);
  };

  // Calculate a basic score
  const getSummary = () => {
    const map = {
      "1–5 people": "focused engagement",
      "6–15 people": "team-wide automation",
      "16–50 people": "departmental integration",
      "50+ people": "enterprise-scale automation",
    };
    const size = map[answers.size] || "a bespoke engagement";
    return `Based on your answers, we'd recommend ${size} beginning with your ${answers.problem?.toLowerCase() || "operational"} processes.`;
  };

  return (
    <>
      <Divider />
      <Section id="planner" style={{ padding: "96px 24px" }}>
        <FadeIn>
          <div style={{ marginBottom: 56 }}>
            <Eyebrow>Automation Planner</Eyebrow>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: tokens.text,
              maxWidth: 560,
            }}>
              Understand what automation<br />looks like for your business.
            </h2>
            <p style={{ fontSize: 16, color: tokens.muted, marginTop: 16, maxWidth: 440, lineHeight: 1.7 }}>
              Five questions. Two minutes. A clear picture of where to start.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div style={{
            maxWidth: 680,
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 12,
            overflow: "hidden",
          }}>
            {/* Progress bar */}
            <div style={{ height: 2, background: tokens.border }}>
              <div style={{
                height: "100%",
                width: complete ? "100%" : `${progress}%`,
                background: tokens.teal,
                transition: "width 0.4s ease",
              }} />
            </div>

            <div style={{ padding: "48px 48px" }}>
              {!complete ? (
                <>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: tokens.muted,
                    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24,
                  }}>
                    {step + 1} / {questions.length}
                  </div>

                  <h3 style={{
                    fontSize: 20, fontWeight: 700,
                    letterSpacing: "-0.02em", color: tokens.text,
                    marginBottom: 8, lineHeight: 1.3,
                  }}>
                    {q.q}
                  </h3>
                  <p style={{ fontSize: 13, color: tokens.muted, marginBottom: 32, lineHeight: 1.6 }}>
                    {q.hint}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {q.options.map((opt, i) => (
                      <PlannerOption
                        key={i}
                        label={opt}
                        selected={answers[q.key] === opt}
                        onSelect={() => select(opt)}
                      />
                    ))}
                  </div>

                  {step > 0 && (
                    <button
                      onClick={() => setStep(s => s - 1)}
                      style={{
                        marginTop: 24, background: "none", border: "none",
                        cursor: "pointer", fontSize: 13, color: tokens.muted,
                        display: "flex", alignItems: "center", gap: 6,
                        fontFamily: "inherit",
                        transition: "color 0.18s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = tokens.text}
                      onMouseLeave={e => e.currentTarget.style.color = tokens.muted}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 6H3M5 4L3 6l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Back
                    </button>
                  )}
                </>
              ) : (
                <PlannerComplete answers={answers} summary={getSummary()} onReset={reset} />
              )}
            </div>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}

function PlannerOption({ label, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "14px 18px",
        background: selected ? `${tokens.teal}18` : hovered ? tokens.surfaceHover : "transparent",
        border: `1px solid ${selected ? tokens.teal : hovered ? tokens.borderHover : tokens.border}`,
        borderRadius: 7,
        cursor: "pointer",
        fontSize: 14,
        color: selected ? tokens.tealLight : hovered ? tokens.text : tokens.muted,
        fontFamily: "inherit",
        transition: "all 0.15s ease",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span style={{
        width: 16, height: 16,
        borderRadius: "50%",
        border: `1.5px solid ${selected ? tokens.teal : hovered ? tokens.borderHover : tokens.border}`,
        background: selected ? tokens.teal : "transparent",
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s ease",
      }}>
        {selected && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l2 2 3-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

function PlannerComplete({ answers, summary, onReset }) {
  return (
    <div>
      <div style={{
        width: 48, height: 48,
        borderRadius: "50%",
        background: `${tokens.teal}22`,
        border: `1px solid ${tokens.teal}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 24,
      }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 11l5 5 9-9" stroke={tokens.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 style={{
        fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em",
        color: tokens.text, marginBottom: 12,
      }}>
        Here is what we'd recommend
      </h3>
      <p style={{ fontSize: 15, color: tokens.muted, lineHeight: 1.7, marginBottom: 28 }}>
        {summary}
      </p>

      <div style={{
        background: `${tokens.teal}0D`,
        border: `1px solid ${tokens.teal}22`,
        borderRadius: 8,
        padding: "20px 24px",
        marginBottom: 32,
      }}>
        {Object.entries(answers).map(([key, val]) => (
          <div key={key} style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 13, padding: "6px 0",
            borderBottom: `1px solid ${tokens.border}`,
          }}>
            <span style={{ color: tokens.muted, textTransform: "capitalize" }}>{key}</span>
            <span style={{ color: tokens.text, fontWeight: 500 }}>{val}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}>
          Apply now
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
        <Button variant="secondary" onClick={onReset}>
          Start over
        </Button>
      </div>
    </div>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const [support, setSupport] = useState(false);

  const tiers = [
    {
      name: "Foundation",
      price: 4800,
      supportPrice: 490,
      desc: "One core automation system. Ideal for a single process with high manual overhead.",
      features: [
        "Process audit (up to 3 workflows)",
        "1 automated workflow built",
        "Integration with up to 3 tools",
        "Testing & documentation",
        "1 hour team training",
      ],
    },
    {
      name: "Systems",
      price: 9500,
      supportPrice: 890,
      featured: true,
      desc: "Multiple interconnected automations across your core operations. Our most common engagement.",
      features: [
        "Full process audit",
        "Up to 4 automated workflows",
        "Integration with up to 8 tools",
        "AI-powered workflow included",
        "Live dashboard & reporting",
        "2 hours team training",
      ],
    },
    {
      name: "Operations",
      price: 18000,
      supportPrice: 1490,
      desc: "A complete operational automation strategy across every department, built to scale.",
      features: [
        "Comprehensive operations audit",
        "Unlimited workflow builds",
        "Full system integration",
        "Custom AI models included",
        "Dashboards per department",
        "Ongoing optimisation support",
        "Quarterly review sessions",
      ],
    },
  ];

  return (
    <>
      <Divider />
      <Section id="pricing" style={{ padding: "96px 24px" }}>
        <FadeIn>
          <div style={{ marginBottom: 48 }}>
            <Eyebrow>Pricing</Eyebrow>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: tokens.text,
              maxWidth: 520,
              marginBottom: 24,
            }}>
              Fixed-scope projects.<br />No surprises.
            </h2>
            <p style={{ fontSize: 15, color: tokens.muted, maxWidth: 400, lineHeight: 1.7, marginBottom: 24 }}>
              All projects are priced upfront. Optional monthly support retainers are available once your systems are live.
            </p>

            {/* Support toggle */}
            <button
              onClick={() => setSupport(s => !s)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: tokens.surface, border: `1px solid ${tokens.border}`,
                borderRadius: 24, padding: "8px 16px",
                cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                color: tokens.muted,
              }}
            >
              <span style={{
                width: 32, height: 18, borderRadius: 9,
                background: support ? tokens.teal : tokens.border,
                position: "relative",
                transition: "background 0.2s ease",
              }}>
                <span style={{
                  position: "absolute", width: 14, height: 14,
                  borderRadius: "50%", background: "#fff",
                  top: 2, left: support ? 16 : 2,
                  transition: "left 0.2s ease",
                }} />
              </span>
              Show monthly support pricing
            </button>
          </div>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {tiers.map((tier, i) => (
            <FadeIn key={i} delay={i * 80}>
              <PricingCard tier={tier} support={support} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={200}>
          <p style={{
            textAlign: "center", fontSize: 13, color: tokens.muted,
            marginTop: 36, lineHeight: 1.6,
          }}>
            All projects include a discovery call, detailed proposal, and fixed scope before any commitment is made.
            <br />Not sure which tier is right? Apply for a consultation and we will recommend the right fit.
          </p>
        </FadeIn>
      </Section>
    </>
  );
}

function PricingCard({ tier, support }) {
  const fmt = (n) => `£${n.toLocaleString()}`;

  return (
    <div style={{
      padding: "36px 32px",
      background: tier.featured ? `${tokens.teal}0C` : tokens.surface,
      border: `1px solid ${tier.featured ? tokens.teal + "44" : tokens.border}`,
      borderRadius: 10,
      display: "flex", flexDirection: "column", gap: 24,
      position: "relative",
    }}>
      {tier.featured && (
        <div style={{
          position: "absolute", top: -1, left: 32,
          background: tokens.teal, borderRadius: "0 0 6px 6px",
          padding: "3px 12px", fontSize: 11, fontWeight: 600,
          color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase",
        }}>
          Most popular
        </div>
      )}

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: tokens.muted, marginBottom: 8 }}>
          {tier.name}
        </div>
        <div style={{
          fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em",
          color: tokens.text, lineHeight: 1,
        }}>
          {fmt(tier.price)}
        </div>
        {support && (
          <div style={{ fontSize: 13, color: tokens.tealLight, marginTop: 6 }}>
            + {fmt(tier.supportPrice)}/mo support
          </div>
        )}
        <p style={{ fontSize: 13, color: tokens.muted, marginTop: 12, lineHeight: 1.6 }}>
          {tier.desc}
        </p>
      </div>

      <div style={{ flex: 1 }}>
        {tier.features.map((f, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "8px 0",
            borderBottom: i < tier.features.length - 1 ? `1px solid ${tokens.border}` : "none",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M2 7l3.5 3.5 6.5-7" stroke={tokens.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 13, color: tokens.muted, lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>

      <Button
        variant={tier.featured ? "primary" : "secondary"}
        onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}
        style={{ width: "100%" }}
      >
        Apply for this tier
      </Button>
    </div>
  );
}

// ─── Application Form ─────────────────────────────────────────────────────────
function Apply() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", revenue: "", problem: "", tier: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (!form.problem.trim()) e.problem = "Required";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
  };

  const inputStyle = (key) => ({
    width: "100%",
    background: tokens.ink,
    border: `1px solid ${errors[key] ? tokens.error : tokens.border}`,
    borderRadius: 7,
    padding: "12px 16px",
    fontSize: 14,
    color: tokens.text,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.18s",
  });

  const labelStyle = {
    fontSize: 13,
    fontWeight: 500,
    color: tokens.muted,
    display: "block",
    marginBottom: 8,
  };

  return (
    <>
      <Divider />
      <Section id="apply" style={{ padding: "96px 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "start",
        }}>
          <FadeIn>
            <Eyebrow>Apply</Eyebrow>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: tokens.text,
              marginBottom: 20,
            }}>
              We take on a small number<br />of clients each quarter.
            </h2>
            <p style={{ fontSize: 15, color: tokens.muted, lineHeight: 1.75, maxWidth: 380, marginBottom: 36 }}>
              Applications help us understand whether we are the right fit before either party invests time.
              Qualified applicants receive a personal response within two business days.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "We only work with", value: "Established businesses with an existing operations challenge" },
                { label: "We do not work with", value: "Early-stage ideas or businesses seeking product development" },
                { label: "Typical engagement", value: "6–10 weeks, fixed scope, clear deliverables" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 1, background: tokens.teal, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: tokens.teal, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 14, color: tokens.muted, lineHeight: 1.6 }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Form */}
          <FadeIn delay={120}>
            {!submitted ? (
              <div style={{
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: 12,
                padding: "40px 40px",
                display: "flex", flexDirection: "column", gap: 24,
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <label style={labelStyle}>Full name</label>
                    <input
                      value={form.name}
                      onChange={e => set("name", e.target.value)}
                      onFocus={e => e.target.style.borderColor = tokens.teal}
                      onBlur={e => e.target.style.borderColor = errors.name ? tokens.error : tokens.border}
                      placeholder="Jane Smith"
                      style={inputStyle("name")}
                    />
                    {errors.name && <div style={{ fontSize: 11, color: tokens.error, marginTop: 4 }}>{errors.name}</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>Company</label>
                    <input
                      value={form.company}
                      onChange={e => set("company", e.target.value)}
                      onFocus={e => e.target.style.borderColor = tokens.teal}
                      onBlur={e => e.target.style.borderColor = errors.company ? tokens.error : tokens.border}
                      placeholder="Acme Ltd"
                      style={inputStyle("company")}
                    />
                    {errors.company && <div style={{ fontSize: 11, color: tokens.error, marginTop: 4 }}>{errors.company}</div>}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Business email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    onFocus={e => e.target.style.borderColor = tokens.teal}
                    onBlur={e => e.target.style.borderColor = errors.email ? tokens.error : tokens.border}
                    placeholder="jane@acmeltd.com"
                    style={inputStyle("email")}
                  />
                  {errors.email && <div style={{ fontSize: 11, color: tokens.error, marginTop: 4 }}>{errors.email}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Annual revenue (approximate)</label>
                  <select
                    value={form.revenue}
                    onChange={e => set("revenue", e.target.value)}
                    style={{ ...inputStyle("revenue"), cursor: "pointer" }}
                  >
                    <option value="" style={{ background: tokens.surface }}>Select a range</option>
                    {["Under £500k", "£500k – £2m", "£2m – £10m", "£10m+"].map(r => (
                      <option key={r} value={r} style={{ background: tokens.surface }}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Describe your biggest operational challenge</label>
                  <textarea
                    value={form.problem}
                    onChange={e => set("problem", e.target.value)}
                    onFocus={e => e.target.style.borderColor = tokens.teal}
                    onBlur={e => e.target.style.borderColor = errors.problem ? tokens.error : tokens.border}
                    placeholder="Where is your team losing the most time? What breaks down most often?"
                    rows={4}
                    style={{ ...inputStyle("problem"), resize: "vertical", lineHeight: 1.6 }}
                  />
                  {errors.problem && <div style={{ fontSize: 11, color: tokens.error, marginTop: 4 }}>{errors.problem}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Which engagement tier interests you?</label>
                  <select
                    value={form.tier}
                    onChange={e => set("tier", e.target.value)}
                    style={{ ...inputStyle("tier"), cursor: "pointer" }}
                  >
                    <option value="" style={{ background: tokens.surface }}>Not sure yet</option>
                    {["Foundation — £4,800", "Systems — £9,500", "Operations — £18,000"].map(t => (
                      <option key={t} value={t} style={{ background: tokens.surface }}>{t}</option>
                    ))}
                  </select>
                </div>

                <Button onClick={submit} style={{ width: "100%", justifyContent: "center" }} size="lg">
                  Submit application
                </Button>

                <p style={{ fontSize: 12, color: tokens.muted, textAlign: "center", lineHeight: 1.6 }}>
                  Qualified applicants receive a personal response within two business days.
                  No automated replies.
                </p>
              </div>
            ) : (
              <div style={{
                background: tokens.surface,
                border: `1px solid ${tokens.teal}44`,
                borderRadius: 12,
                padding: "64px 40px",
                textAlign: "center",
              }}>
                <div style={{
                  width: 56, height: 56,
                  borderRadius: "50%",
                  background: `${tokens.teal}22`,
                  border: `1px solid ${tokens.teal}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l4.5 4.5 9.5-9" stroke={tokens.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: tokens.text, letterSpacing: "-0.02em", marginBottom: 12 }}>
                  Application received
                </h3>
                <p style={{ fontSize: 15, color: tokens.muted, lineHeight: 1.7, maxWidth: 320, margin: "0 auto" }}>
                  Thank you, {form.name}. We will review your application and respond personally within two business days.
                </p>
              </div>
            )}
          </FadeIn>
        </div>
      </Section>
    </>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${tokens.border}`,
      padding: "48px 24px",
    }}>
      <div style={{
        maxWidth: 1120, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke={tokens.teal} strokeWidth="1.5" />
            <path d="M6 14 C8 8, 14 8, 16 14" stroke={tokens.teal} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="11" cy="11" r="2" fill={tokens.teal} />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: tokens.muted, letterSpacing: "-0.01em" }}>
            Marina Solutions
          </span>
        </div>

        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {["Services", "Process", "Results", "Pricing", "Apply"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              fontSize: 13, color: tokens.muted, textDecoration: "none",
              transition: "color 0.18s",
            }}
              onMouseEnter={e => e.target.style.color = tokens.text}
              onMouseLeave={e => e.target.style.color = tokens.muted}
            >
              {l}
            </a>
          ))}
        </div>

        <div style={{ fontSize: 12, color: tokens.border }}>
          © {new Date().getFullYear()} Marina Solutions
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function MarinaSolutions() {
  return (
    <>
      <GlobalStyles />
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Services />
        <Process />
        <Results />
        <ROICalculator />
        <AutomationPlanner />
        <Pricing />
        <Apply />
      </main>
      <Footer />
    </>
  );
}