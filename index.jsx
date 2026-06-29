import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  ink: "#0A0F0F",
  surface: "#0F1517",
  surfaceHover: "#141C1E",
  border: "#1E2A2B",
  borderHover: "#2A3A3B",
  teal: "#0D9488",
  tealLight: "#2DD4BF",
  text: "#E8EDEC",
  muted: "#6B7F7E",
  mutedLight: "#8A9D9C",
  error: "#F87171",
};

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: ${T.ink}; color: ${T.text};
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 16px; line-height: 1.6;
      -webkit-font-smoothing: antialiased; overflow-x: hidden;
    }
    ::selection { background: ${T.teal}33; color: ${T.tealLight}; }
    :focus-visible { outline: 2px solid ${T.teal}; outline-offset: 3px; border-radius: 3px; }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${T.ink}; }
    ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: ${T.muted}; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cursorBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes marqueeScroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes marqueeReverse {
      from { transform: translateX(-50%); }
      to   { transform: translateX(0); }
    }
    @media (max-width: 900px) {
      .desktop-nav { display: none !important; }
      .mobile-btn { display: flex !important; }
      .two-col { grid-template-columns: 1fr !important; }
      .three-col { grid-template-columns: 1fr !important; }
      .roi-grid { grid-template-columns: 1fr !important; }
      .caps-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .tab-strip { overflow-x: auto !important; flex-wrap: nowrap !important; width: 100% !important; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
      .tab-strip::-webkit-scrollbar { display: none; }
      .metrics-strip { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 480px) {
      .caps-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

// ─── Shared primitives ────────────────────────────────────────────────────────
function useVisible(ref, threshold = 0.1) {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return v;
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const v = useVisible(ref);
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(18px)",
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Section({ id, children, pad = "96px 24px", style = {} }) {
  return (
    <section id={id} style={{ padding: pad, ...style }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function Divider() {
  return <div style={{ height: 1, maxWidth: 1120, margin: "0 auto", background: `linear-gradient(90deg, transparent, ${T.border} 20%, ${T.border} 80%, transparent)` }} />;
}

function Eyebrow({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.teal, marginBottom: 16 }}>
      <span style={{ display: "inline-block", width: 16, height: 1, background: T.teal }} />
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", style: sx = {} }) {
  const [h, setH] = useState(false);
  const sz = { sm: { fontSize: 13, padding: "8px 16px" }, md: { fontSize: 14, padding: "11px 22px" }, lg: { fontSize: 15, padding: "14px 28px" } }[size];
  const vStyle = {
    primary:   { background: h ? T.tealLight : T.teal, color: "#fff", boxShadow: h ? `0 0 24px ${T.teal}44` : "none", border: "none" },
    secondary: { background: h ? T.surfaceHover : "transparent", color: h ? T.text : T.mutedLight, border: `1px solid ${h ? T.borderHover : T.border}` },
    ghost:     { background: "transparent", color: h ? T.tealLight : T.muted, border: "none", padding: 0 },
  }[variant];
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit", fontWeight: 500, cursor: "pointer", borderRadius: 6, transition: "all 0.18s ease", letterSpacing: "-0.01em", ...sz, ...vStyle, ...sx }}>
      {children}
    </button>
  );
}

const ArrowR = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M2 7l3.5 3.5 6.5-7" stroke={T.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [["Services", "#services"], ["Process", "#process"], ["Results", "#use-cases"], ["Pricing", "#pricing"]];
  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 24px", background: scrolled ? `${T.ink}EE` : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent", transition: "all 0.3s ease" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke={T.teal} strokeWidth="1.5" />
              <path d="M6 14 C8 8, 14 8, 16 14" stroke={T.teal} strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <circle cx="11" cy="11" r="2" fill={T.teal} />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: T.text, letterSpacing: "-0.02em" }}>Marina</span>
          </a>
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {links.map(([l, h]) => (
              <a key={h} href={h} style={{ fontSize: 13, color: T.muted, textDecoration: "none", fontWeight: 450, transition: "color 0.18s" }}
                onMouseEnter={e => e.target.style.color = T.text} onMouseLeave={e => e.target.style.color = T.muted}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Btn size="sm" onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}>Apply Now</Btn>
            <button className="mobile-btn" onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 4 }} aria-label="Menu">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {open ? <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      : <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
        </div>
      </nav>
      {open && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: T.surface, borderBottom: `1px solid ${T.border}`, padding: 24 }}>
          {links.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} style={{ display: "block", fontSize: 15, color: T.text, textDecoration: "none", padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>{l}</a>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const TYPEWRITER_WORDS = ["invoice chasing", "client onboarding", "weekly reporting", "lead follow-up", "manual data entry", "approval workflows"];

function useTypewriter(words) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState("typing"); // typing | pausing | deleting
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout;
    if (phase === "typing") {
      if (charIdx < word.length) {
        timeout = setTimeout(() => setCharIdx(c => c + 1), 60);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), 1800);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 200);
    } else if (phase === "deleting") {
      if (charIdx > 0) {
        timeout = setTimeout(() => setCharIdx(c => c - 1), 35);
      } else {
        setWordIdx(i => (i + 1) % words.length);
        setPhase("typing");
      }
    }
    setDisplay(word.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [phase, charIdx, wordIdx, words]);

  return display;
}

function Hero() {
  const [lineDrawn, setLineDrawn] = useState(false);
  const typed = useTypewriter(TYPEWRITER_WORDS);
  useEffect(() => { const t = setTimeout(() => setLineDrawn(true), 400); return () => clearTimeout(t); }, []);

  const CODE_LINES = [
    { t: "comment", v: "# Step 1 — Discovery" },
    { t: "cmd",     v: "$ marina enquiry.received --source website" },
    { t: "success", v: "✓ Application reviewed — call booked" },
    { t: "blank",   v: "" },
    { t: "comment", v: "# Step 2 — Proposal" },
    { t: "cmd",     v: "$ marina proposal.send \\" },
    { t: "arg",     v: "  --scope audit + 3 workflows \\" },
    { t: "arg",     v: "  --fixed-price £3500" },
    { t: "success", v: "✓ Proposal accepted — project starts" },
    { t: "blank",   v: "" },
    { t: "comment", v: "# Step 3 — Build (weeks 3–6)" },
    { t: "cmd",     v: "$ marina build --test against:live-data" },
    { t: "success", v: "✓ All workflows passing" },
    { t: "blank",   v: "" },
    { t: "comment", v: "# Step 4 — Handover" },
    { t: "cmd",     v: "$ marina deploy --notify slack:#ops \\" },
    { t: "arg",     v: "  --docs true --training true" },
    { t: "success", v: "✓ System live — 0 manual steps remaining" },
    { t: "blank",   v: "" },
    { t: "comment", v: "# Step 5 — Ongoing support" },
    { t: "cmd",     v: "$ marina support.start --retainer £490/mo" },
    { t: "success", v: "✓ Monitoring active — you're covered" },
  ];

  return (
    <Section id="hero" pad="140px 24px 64px">
      {/* Signature line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, height: 1, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${T.teal}55 30%, ${T.teal}33 70%, transparent)`, transform: lineDrawn ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center", transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </div>

      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 56, alignItems: "center" }}>
        {/* Left: headline + CTAs */}
        <div>
          <div style={{ opacity: 0, animation: "fadeUp 0.65s ease 0.2s forwards" }}><Eyebrow>AI Automation Agency</Eyebrow></div>

          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.08, color: T.text, opacity: 0, animation: "fadeUp 0.65s ease 0.35s forwards", marginBottom: 0 }}>
            Your business<br />runs on
          </h1>

          {/* Typewriter line */}
          <div style={{ opacity: 0, animation: "fadeUp 0.65s ease 0.42s forwards" }}>
            <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.08, color: T.teal, marginBottom: 0, minHeight: "1.08em" }}>
              {typed}
              <span style={{ display: "inline-block", width: 3, height: "0.85em", background: T.teal, marginLeft: 2, verticalAlign: "middle", animation: "cursorBlink 0.9s step-end infinite", borderRadius: 1 }} />
            </h1>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.08, color: T.text, marginBottom: 24, opacity: 0, animation: "fadeUp 0.65s ease 0.49s forwards" }}>
            We remove it.
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.7, color: T.muted, maxWidth: 480, marginBottom: 36, opacity: 0, animation: "fadeUp 0.65s ease 0.56s forwards" }}>
            Marina builds bespoke automation systems for established businesses.
            We connect your tools, eliminate manual work, and give your team back the hours they spend on process.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", opacity: 0, animation: "fadeUp 0.65s ease 0.65s forwards" }}>
            <Btn size="lg" onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}>
              Apply for a consultation <ArrowR />
            </Btn>
            <Btn variant="ghost" size="lg" onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}>
              See how it works
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Btn>
          </div>
        </div>

        {/* Right: terminal code block */}
        <div style={{ opacity: 0, animation: "fadeUp 0.65s ease 0.55s forwards" }}>
          <div style={{ background: "#0C1614", border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace" }}>
            {/* Terminal chrome */}
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57", display: "inline-block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E", display: "inline-block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28CA41", display: "inline-block" }} />
              <span style={{ marginLeft: "auto", fontSize: 11, color: T.muted }}>marina-workflow</span>
            </div>
            {/* Code lines */}
            <div style={{ padding: "20px 20px" }}>
              {CODE_LINES.map((line, i) => (
                <div key={i} style={{ fontSize: 12, lineHeight: 1.9, whiteSpace: "pre", color: line.t === "comment" ? T.muted : line.t === "success" ? T.tealLight : line.t === "arg" ? "#8FB5B0" : T.text }}>
                  {line.v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics strip */}
      <div className="metrics-strip" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginTop: 56, borderTop: `1px solid ${T.border}`, borderLeft: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", opacity: 0, animation: "fadeUp 0.65s ease 0.8s forwards" }}>
        {[
          { stat: "40+",    label: "Automations deployed" },
          { stat: "14 hrs", label: "Average weekly hours saved" },
          { stat: "97%",    label: "Client retention rate" },
          { stat: "8 wks",  label: "Typical time to first result" },
        ].map((m, i) => (
          <div key={i} style={{ padding: "20px 24px", borderRight: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: T.text, marginBottom: 4 }}>{m.stat}</div>
            <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.4 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── Integration Marquee ──────────────────────────────────────────────────────
// Two rows: top scrolls left→right, bottom scrolls right→left
const TOOLS_ROW1 = ["HubSpot","Salesforce","Xero","QuickBooks","Slack","Notion","Airtable","Monday.com","Asana","Zapier"];
const TOOLS_ROW2 = ["Stripe","Google Workspace","Microsoft 365","Pipedrive","Intercom","Typeform","Shopify","WooCommerce","Jira","Linear"];

function MarqueeRow({ tools, reverse = false }) {
  const items = [...tools, ...tools, ...tools];
  const pill = (tool, i) => (
    <div key={i} style={{ padding: "6px 20px", margin: "0 6px", border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, fontWeight: 500, color: T.muted, whiteSpace: "nowrap", background: T.surface, letterSpacing: "-0.01em", flexShrink: 0 }}>
      {tool}
    </div>
  );
  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", width: "max-content", animation: `${reverse ? "marqueeReverse" : "marqueeScroll"} 40s linear infinite` }}>
        {items.map((t, i) => pill(t, i))}
      </div>
    </div>
  );
}

function Marquee() {
  return (
    <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, overflow: "hidden", padding: "16px 0", position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(90deg, ${T.ink}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(270deg, ${T.ink}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
      <MarqueeRow tools={TOOLS_ROW1} reverse={false} />
      <MarqueeRow tools={TOOLS_ROW2} reverse={true} />
    </div>
  );
}

// ─── Use-case Switcher ────────────────────────────────────────────────────────
// Pattern 3: Tab strip that changes the content panel — each industry gets its own story + diagram

const teal = T.teal;
const tealL = T.tealLight;
const surf = T.surface;
const brd = T.border;
const mut = T.muted;
const txt = T.text;

const USE_CASES = [
  {
    label: "Professional Services",
    headline: "Your team shouldn't spend Fridays writing reports.",
    body: "Consulting firms and agencies lose dozens of hours weekly compiling information that already exists in their systems. We automate report generation, client communication, and project tracking — so your team delivers work, not admin around it.",
    metrics: [{ v: "23 hrs", l: "Saved weekly" }, { v: "4 min", l: "Report turnaround" }, { v: "£0", l: "Extra headcount" }],
    diagram: (
      <svg viewBox="0 0 360 160" fill="none" style={{ width: "100%" }}>
        <text x="180" y="18" textAnchor="middle" fill={mut} fontSize="10" fontFamily="Inter">Every Friday at 9am — zero human input</text>
        {[
          { x: 10,  label: "CRM",       sub: "HubSpot", hi: false },
          { x: 94,  label: "Trigger",   sub: "weekly",  hi: true  },
          { x: 178, label: "Build",     sub: "report",  hi: false },
          { x: 262, label: "Send",      sub: "email",   hi: false },
        ].map(({ x, label, sub, hi }, i) => (
          <g key={i}>
            <rect x={x} y={50} width={74} height={60} rx={8} fill={surf} stroke={hi ? teal : brd} strokeWidth={hi ? 1.5 : 1} />
            <text x={x + 37} y={76} textAnchor="middle" fill={hi ? txt : mut} fontSize="10" fontFamily="Inter" fontWeight={hi ? 600 : 400}>{label}</text>
            <text x={x + 37} y={92} textAnchor="middle" fill={teal} fontSize="9" fontFamily="Inter">{sub}</text>
            {i < 3 && <path d={`M${x + 74} 80 h14`} stroke={brd} strokeWidth="1.5" strokeDasharray="3 3" />}
            {i < 3 && <polygon points={`${x + 88},76 ${x + 96},80 ${x + 88},84`} fill={teal} />}
          </g>
        ))}
        <circle cx={180} cy={140} r={3} fill={teal} opacity={0.5} />
        <path d="M180 110 v20" stroke={`${teal}44`} strokeWidth={1} strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    label: "E-commerce",
    headline: "Orders should fulfil themselves.",
    body: "Every manual step between a customer clicking 'buy' and their order arriving is a liability. We connect your storefront, warehouse, and customer service into a single automated flow. Exceptions get flagged. Everything else runs.",
    metrics: [{ v: "4×", l: "Faster fulfilment" }, { v: "31 hrs", l: "Team time freed" }, { v: "−68%", l: "Complaints" }],
    diagram: (
      <svg viewBox="0 0 360 160" fill="none" style={{ width: "100%" }}>
        <text x="180" y="18" textAnchor="middle" fill={mut} fontSize="10" fontFamily="Inter">One order triggers three automated actions</text>
        <rect x={10} y={55} width={74} height={50} rx={8} fill={surf} stroke={brd} />
        <text x={47} y={77} textAnchor="middle" fill={mut} fontSize="10" fontFamily="Inter">Order</text>
        <text x={47} y={91} textAnchor="middle" fill={teal} fontSize="9" fontFamily="Inter">Shopify</text>
        <path d="M84 80 h14" stroke={brd} strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="98,76 106,80 98,84" fill={teal} />
        <rect x={106} y={48} width={74} height={64} rx={8} fill={surf} stroke={teal} strokeWidth={1.5} />
        <text x={143} y={74} textAnchor="middle" fill={txt} fontSize="10" fontFamily="Inter" fontWeight={600}>Route</text>
        <text x={143} y={88} textAnchor="middle" fill={teal} fontSize="9" fontFamily="Inter">& assign</text>
        <path d="M180 70 h16" stroke={brd} strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="196,66 204,70 196,74" fill={teal} />
        <path d="M180 92 h16" stroke={brd} strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="196,88 204,92 196,96" fill={brd} />
        <rect x={204} y={44} width={74} height={44} rx={8} fill={surf} stroke={brd} />
        <text x={241} y={68} textAnchor="middle" fill={mut} fontSize="9" fontFamily="Inter">Warehouse</text>
        <text x={241} y={80} textAnchor="middle" fill={teal} fontSize="8" fontFamily="Inter">notified</text>
        <rect x={204} y={94} width={74} height={44} rx={8} fill={surf} stroke={brd} />
        <text x={241} y={118} textAnchor="middle" fill={mut} fontSize="9" fontFamily="Inter">Customer</text>
        <text x={241} y={130} textAnchor="middle" fill={teal} fontSize="8" fontFamily="Inter">confirmation</text>
      </svg>
    ),
  },
  {
    label: "Financial Services",
    headline: "Your pipeline shouldn't go cold while you're busy.",
    body: "Lapsed clients, unread proposals, dormant accounts — these represent revenue your business has already earned the right to recover. We build re-engagement workflows driven by account activity, not someone remembering to send an email.",
    metrics: [{ v: "£140k", l: "Revenue recovered" }, { v: "34%", l: "Re-engagement rate" }, { v: "0 hrs", l: "Staff time" }],
    diagram: (
      <svg viewBox="0 0 360 160" fill="none" style={{ width: "100%" }}>
        <text x="180" y="18" textAnchor="middle" fill={mut} fontSize="10" fontFamily="Inter">Re-engagement runs without a human trigger</text>
        <rect x={10} y={55} width={80} height={50} rx={8} fill={surf} stroke={brd} />
        <text x={50} y={77} textAnchor="middle" fill={mut} fontSize="10" fontFamily="Inter">Account</text>
        <text x={50} y={91} textAnchor="middle" fill={teal} fontSize="9" fontFamily="Inter">goes quiet</text>
        <path d="M90 80 h20" stroke={brd} strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="110,76 118,80 110,84" fill={teal} />
        <rect x={118} y={44} width={84} height={72} rx={8} fill={surf} stroke={teal} strokeWidth={1.5} />
        <text x={160} y={74} textAnchor="middle" fill={txt} fontSize="10" fontFamily="Inter" fontWeight={600}>30-day</text>
        <text x={160} y={88} textAnchor="middle" fill={txt} fontSize="10" fontFamily="Inter" fontWeight={600}>trigger</text>
        <text x={160} y={102} textAnchor="middle" fill={teal} fontSize="8" fontFamily="Inter">automated</text>
        <path d="M202 70 h18" stroke={brd} strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="220,66 228,70 220,74" fill={teal} />
        <path d="M202 92 h18" stroke={brd} strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="220,88 228,92 220,96" fill={brd} />
        <rect x={228} y={44} width={80} height={44} rx={8} fill={surf} stroke={brd} />
        <text x={268} y={64} textAnchor="middle" fill={mut} fontSize="9" fontFamily="Inter">Personal</text>
        <text x={268} y={78} textAnchor="middle" fill={teal} fontSize="8" fontFamily="Inter">email sent</text>
        <rect x={228} y={94} width={80} height={44} rx={8} fill={surf} stroke={brd} />
        <text x={268} y={114} textAnchor="middle" fill={mut} fontSize="9" fontFamily="Inter">CRM task</text>
        <text x={268} y={128} textAnchor="middle" fill={teal} fontSize="8" fontFamily="Inter">created</text>
      </svg>
    ),
  },
  {
    label: "Healthcare & Wellness",
    headline: "Admin shouldn't compete with patient care.",
    body: "Appointment scheduling, intake forms, follow-up reminders, referral tracking — all of it can run automatically. We build workflows that handle the repetitive side of practice management so your team focuses on the clinical work.",
    metrics: [{ v: "18 hrs", l: "Admin saved weekly" }, { v: "−40%", l: "No-shows" }, { v: "2×", l: "Follow-up rate" }],
    diagram: (
      <svg viewBox="0 0 360 160" fill="none" style={{ width: "100%" }}>
        <text x="180" y="18" textAnchor="middle" fill={mut} fontSize="10" fontFamily="Inter">Patient journey runs automatically end-to-end</text>
        <rect x={10} y={55} width={80} height={50} rx={8} fill={surf} stroke={brd} />
        <text x={50} y={77} textAnchor="middle" fill={mut} fontSize="10" fontFamily="Inter">Booking</text>
        <text x={50} y={91} textAnchor="middle" fill={teal} fontSize="9" fontFamily="Inter">confirmed</text>
        <path d="M90 80 h20" stroke={brd} strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="110,76 118,80 110,84" fill={teal} />
        <rect x={118} y={48} width={80} height={64} rx={8} fill={surf} stroke={teal} strokeWidth={1.5} />
        <text x={158} y={74} textAnchor="middle" fill={txt} fontSize="10" fontFamily="Inter" fontWeight={600}>Intake</text>
        <text x={158} y={88} textAnchor="middle" fill={teal} fontSize="9" fontFamily="Inter">form sent</text>
        <path d="M198 70 h20" stroke={brd} strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="218,66 226,70 218,74" fill={teal} />
        <rect x={226} y={44} width={80} height={40} rx={8} fill={surf} stroke={brd} />
        <text x={266} y={68} textAnchor="middle" fill={mut} fontSize="9" fontFamily="Inter">24hr reminder</text>
        <rect x={226} y={92} width={80} height={40} rx={8} fill={surf} stroke={brd} />
        <text x={266} y={110} textAnchor="middle" fill={mut} fontSize="9" fontFamily="Inter">Post-visit</text>
        <text x={266} y={122} textAnchor="middle" fill={teal} fontSize="8" fontFamily="Inter">follow-up</text>
        <path d="M198 92 h20" stroke={brd} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <polygon points="218,88 226,92 218,96" fill={brd} />
      </svg>
    ),
  },
];

function UseCaseSwitcher() {
  const [active, setActive] = useState(0);
  const uc = USE_CASES[active];
  return (
    <>
      <Divider />
      <Section id="use-cases" pad="64px 24px">
        <FadeIn>
          <Eyebrow>By industry</Eyebrow>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: T.text, maxWidth: 560, marginBottom: 32 }}>
            What automation looks like<br />for your business.
          </h2>
        </FadeIn>

        {/* Tab strip */}
        <FadeIn delay={80}>
          <div className="tab-strip" style={{ display: "flex", gap: 4, marginBottom: 32, padding: 4, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, maxWidth: "100%", flexWrap: "nowrap", width: "fit-content" }}>
            {USE_CASES.map((u, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ padding: "8px 18px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: active === i ? T.teal : "transparent", color: active === i ? "#fff" : T.muted, transition: "all 0.18s ease" }}>
                {u.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Text */}
          <div key={`t-${active}`} style={{ opacity: 0, animation: "fadeUp 0.38s ease forwards" }}>
            <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", color: T.text, marginBottom: 16, lineHeight: 1.2 }}>{uc.headline}</h3>
            <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, marginBottom: 32 }}>{uc.body}</p>
            <div style={{ display: "flex", gap: 36 }}>
              {uc.metrics.map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em", color: T.tealLight }}>{m.v}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagram */}
          <div key={`d-${active}`} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 180, opacity: 0, animation: "fadeUp 0.38s ease 0.08s forwards" }}>
            {uc.diagram}
          </div>
        </div>
      </Section>
    </>
  );
}

// ─── Services — Illustrated cards ────────────────────────────────────────────
// Pattern 2: Each card has its own purposeful SVG illustration
function WorkflowIllustration() {
  return (
    <svg viewBox="0 0 260 100" fill="none" style={{ width: "100%", marginBottom: 20 }}>
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <rect x={8 + i*50} y={28} width={42} height={44} rx={7} fill={T.surface} stroke={i===2?T.teal:T.border} strokeWidth={i===2?1.5:1} />
          <circle cx={29 + i*50} cy={50} r={7} fill={i===2?`${T.teal}33`:T.ink} stroke={i===2?T.teal:T.border} />
          {i<4 && <path d={`M${50 + i*50} 50 h8`} stroke={T.border} strokeWidth={1} strokeDasharray="2 2" />}
          {i<4 && <polygon points={`${58+i*50},46 ${64+i*50},50 ${58+i*50},54`} fill={T.teal} opacity={0.6} />}
        </g>
      ))}
      <path d="M29 82 h202" stroke={`${T.teal}22`} strokeWidth={1} />
      <circle cx={130} cy={82} r={3} fill={T.teal} opacity={0.5} />
    </svg>
  );
}

function IntegrationIllustration() {
  const spokes = [[60,24],[200,24],[24,68],[236,68],[60,100],[200,100]];
  return (
    <svg viewBox="0 0 260 120" fill="none" style={{ width: "100%", marginBottom: 20 }}>
      {spokes.map(([x,y], i) => (
        <g key={i}>
          <line x1={130} y1={60} x2={x} y2={y} stroke={T.border} strokeWidth={1} strokeDasharray="3 3" />
          <rect x={x-16} y={y-12} width={32} height={24} rx={5} fill={T.surface} stroke={T.border} />
          <circle cx={x} cy={y} r={3.5} fill={T.teal} opacity={0.65} />
        </g>
      ))}
      <circle cx={130} cy={60} r={18} fill={`${T.teal}18`} stroke={T.teal} strokeWidth={1.5} />
      <text x={130} y={65} textAnchor="middle" fill={T.teal} fontSize="9" fontFamily="Inter">hub</text>
    </svg>
  );
}

function AIIllustration() {
  return (
    <svg viewBox="0 0 260 100" fill="none" style={{ width: "100%", marginBottom: 20 }}>
      <rect x={8} y={18} width={70} height={64} rx={8} fill={T.surface} stroke={T.border} />
      {[28,40,52,64].map((y,i) => <rect key={i} x={18} y={y} width={36-i*2} height={6} rx={2} fill={T.border} opacity={0.7} />)}
      <path d="M78 50 h24" stroke={T.border} strokeWidth="1.5" strokeDasharray="3 3" />
      <polygon points="102,46 110,50 102,54" fill={T.teal} />
      <rect x={110} y={24} width={80} height={52} rx={8} fill={`${T.teal}11`} stroke={T.teal} strokeWidth={1.5} />
      <text x={150} y={46} textAnchor="middle" fill={T.teal} fontSize="11" fontFamily="Inter" fontWeight={600}>AI</text>
      <text x={150} y={60} textAnchor="middle" fill={T.muted} fontSize="9" fontFamily="Inter">process</text>
      <path d="M190 50 h24" stroke={T.border} strokeWidth="1.5" strokeDasharray="3 3" />
      <polygon points="214,46 222,50 214,54" fill={T.teal} />
      <rect x={222} y={32} width={30} height={36} rx={6} fill={T.surface} stroke={T.border} />
      <text x={237} y={54} textAnchor="middle" fill={T.teal} fontSize="8" fontFamily="Inter">out</text>
    </svg>
  );
}

function DashboardIllustration() {
  const bars = [50,70,38,82,58,90,48];
  const lineY = [68,52,78,34,58,26,46];
  return (
    <svg viewBox="0 0 260 100" fill="none" style={{ width: "100%", marginBottom: 20 }}>
      <rect x={8} y={8} width={244} height={84} rx={8} fill={T.surface} stroke={T.border} />
      {bars.map((h,i) => <rect key={i} x={20+i*28} y={92-h} width={18} height={h-16} rx={2} fill={i===5?T.teal:`${T.teal}33`} />)}
      <polyline points={bars.map((_,i)=>`${29+i*28},${lineY[i]}`).join(" ")} stroke={T.tealLight} strokeWidth={1.5} fill="none" strokeLinejoin="round" />
      {lineY.map((y,i) => <circle key={i} cx={29+i*28} cy={y} r={2.5} fill={T.tealLight} />)}
    </svg>
  );
}

const SERVICES = [
  { title: "Workflow Automation", desc: "We map your existing processes, identify every manual step, and rebuild them as automated systems. What currently takes hours runs in seconds.", outcome: "Hours reclaimed per week", Illus: WorkflowIllustration },
  { title: "System Integration", desc: "Your tools should communicate. We connect CRMs, project management platforms, payment processors, and any other system your team relies on.", outcome: "Unified operational data", Illus: IntegrationIllustration },
  { title: "AI-Powered Workflows", desc: "Where automation needs intelligence — drafting documents, classifying data, generating reports — we integrate AI that acts on real business logic.", outcome: "Human-quality output at scale", Illus: AIIllustration },
  { title: "Reporting & Visibility", desc: "Replace manual reporting with live dashboards. Your team sees what matters, when they need it, without asking anyone to compile a spreadsheet.", outcome: "Decisions made on current data", Illus: DashboardIllustration },
];

function Services() {
  return (
    <>
      <Divider />
      <Section id="services" pad="64px 24px">
        <FadeIn>
          <div style={{ marginBottom: 36 }}>
            <Eyebrow>What we build</Eyebrow>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: T.text, maxWidth: 560 }}>
              Four types of system.<br />One consistent outcome.
            </h2>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, background: T.border, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
          {SERVICES.map((s, i) => <FadeIn key={i} delay={i * 55}><SvcCard {...s} /></FadeIn>)}
        </div>
      </Section>
    </>
  );
}

function SvcCard({ title, desc, outcome, Illus }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: "24px 22px", background: h ? T.surfaceHover : T.surface, transition: "background 0.2s ease", display: "flex", flexDirection: "column", minHeight: 260 }}>
      <Illus />
      <div style={{ fontSize: 15, fontWeight: 600, color: T.text, letterSpacing: "-0.02em", marginBottom: 10 }}>{title}</div>
      <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, flex: 1 }}>{desc}</p>
      <div style={{ fontSize: 11, fontWeight: 600, color: h ? T.tealLight : T.teal, letterSpacing: "0.04em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s ease", marginTop: 16 }}>
        <span style={{ display: "inline-block", width: 12, height: 1, background: "currentColor" }} />{outcome}
      </div>
    </div>
  );
}

// ─── Capabilities grid ────────────────────────────────────────────────────────
// Pattern 6: Dense mini-card grid showing completeness
const CAPS = [
  { label: "n8n workflows",      desc: "Visual automation builder" },
  { label: "API integrations",   desc: "Connect any modern tool" },
  { label: "Webhook triggers",   desc: "Real-time event handling" },
  { label: "AI models",          desc: "Claude, GPT, and custom" },
  { label: "CRM sync",           desc: "Live bi-directional data" },
  { label: "Email sequences",    desc: "Triggered, not scheduled" },
  { label: "PDF generation",     desc: "Reports on demand" },
  { label: "Database ops",       desc: "Airtable, Supabase, Sheets" },
  { label: "Slack bots",         desc: "Internal workflow alerts" },
  { label: "Form automation",    desc: "Typeform, Tally, HubSpot" },
  { label: "Stripe triggers",    desc: "Payment-driven workflows" },
  { label: "Error handling",     desc: "Every flow has a fallback" },
];

function Capabilities() {
  return (
    <>
      <Divider />
      <Section id="capabilities" pad="56px 24px">
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
            <div>
              <Eyebrow>Under the hood</Eyebrow>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, letterSpacing: "-0.03em", color: T.text }}>Everything we use to build your system.</h2>
            </div>
            <p style={{ fontSize: 13, color: T.muted, maxWidth: 280, lineHeight: 1.6 }}>Every capability listed is available from the first engagement. We use what fits, not what's fashionable.</p>
          </div>
        </FadeIn>
        <div className="caps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {CAPS.map((c, i) => <FadeIn key={i} delay={i * 25}><CapCard {...c} /></FadeIn>)}
        </div>
      </Section>
    </>
  );
}

function CapCard({ label, desc }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: "14px 16px", background: h ? T.surfaceHover : T.surface, border: `1px solid ${h ? T.borderHover : T.border}`, borderRadius: 8, transition: "all 0.18s ease" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 11, color: T.muted }}>{desc}</div>
    </div>
  );
}

// ─── Tool Icon Grid ───────────────────────────────────────────────────────────
// Two rows of icon cards — top scrolls left, bottom scrolls right
const ICONS_ROW1 = [
  { name: "HubSpot",    color: "#FF7A59", icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="14" r="5" fill="currentColor" opacity="0.9"/><circle cx="20" cy="14" r="2" fill="#0C1614"/><path d="M8 28c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/><circle cx="8" cy="28" r="2" fill="currentColor"/><circle cx="32" cy="28" r="2" fill="currentColor"/></svg> },
  { name: "Xero",       color: "#13B5EA", icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2.5"/><path d="M14 20h12M20 14v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> },
  { name: "Slack",      color: "#E01E5A", icon: <svg viewBox="0 0 40 40" fill="none"><rect x="10" y="10" width="7" height="7" rx="2" fill="currentColor"/><rect x="23" y="10" width="7" height="7" rx="2" fill="currentColor" opacity="0.6"/><rect x="10" y="23" width="7" height="7" rx="2" fill="currentColor" opacity="0.6"/><rect x="23" y="23" width="7" height="7" rx="2" fill="currentColor"/></svg> },
  { name: "Stripe",     color: "#635BFF", icon: <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="16" width="24" height="4" rx="2" fill="currentColor"/><rect x="8" y="23" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.6"/><rect x="8" y="10" width="24" height="3" rx="1.5" fill="currentColor" opacity="0.4"/></svg> },
  { name: "Notion",     color: "#FFFFFF", icon: <svg viewBox="0 0 40 40" fill="none"><rect x="10" y="8" width="20" height="24" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M15 15h10M15 20h8M15 25h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { name: "Airtable",   color: "#FCB400", icon: <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="14" width="24" height="7" rx="2" fill="currentColor" opacity="0.9"/><rect x="8" y="24" width="10" height="6" rx="2" fill="currentColor" opacity="0.6"/><rect x="22" y="24" width="10" height="6" rx="2" fill="currentColor" opacity="0.6"/><path d="M8 10h10l6 4H8V10z" fill="currentColor" opacity="0.4"/></svg> },
  { name: "Asana",      color: "#F06A6A", icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="14" r="5" fill="currentColor"/><circle cx="11" cy="26" r="4" fill="currentColor" opacity="0.7"/><circle cx="29" cy="26" r="4" fill="currentColor" opacity="0.7"/></svg> },
  { name: "Zapier",     color: "#FF4A00", icon: <svg viewBox="0 0 40 40" fill="none"><path d="M20 8v10M20 22v10M8 20h10M22 20h10M11.5 11.5l7 7M21.5 21.5l7 7M11.5 28.5l7-7M21.5 18.5l7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> },
  { name: "QuickBooks", color: "#2CA01C", icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2.5"/><path d="M15 16h6a4 4 0 0 1 0 8h-6v-8z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/></svg> },
  { name: "Salesforce", color: "#00A1E0", icon: <svg viewBox="0 0 40 40" fill="none"><path d="M17 15a5 5 0 0 1 9.5 1.5A4.5 4.5 0 0 1 28 25H13a4 4 0 0 1 0-8 4 4 0 0 1 4-2z" stroke="currentColor" strokeWidth="2" fill="none"/></svg> },
];

const ICONS_ROW2 = [
  { name: "Shopify",    color: "#96BF48", icon: <svg viewBox="0 0 40 40" fill="none"><path d="M26 12s-1-3-6-3c-3 0-5 2-5 2L13 28l14 3 3-16-4-3z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M19 11v17M15 27l10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { name: "Pipedrive",  color: "#1CC551", icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2.5"/><path d="M20 13v7l5 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { name: "Typeform",   color: "#6CE0B6", icon: <svg viewBox="0 0 40 40" fill="none"><rect x="9" y="12" width="22" height="16" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M14 18h12M14 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { name: "Monday",     color: "#FF3D57", icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="12" cy="20" r="5" fill="currentColor"/><circle cx="22" cy="20" r="5" fill="currentColor" opacity="0.6"/><circle cx="32" cy="20" r="5" fill="currentColor" opacity="0.3"/></svg> },
  { name: "Intercom",   color: "#1F8DED", icon: <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="10" width="24" height="18" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M14 22l3-3 3 3 3-5 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 28l3-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { name: "Linear",     color: "#5E6AD2", icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="2.5"/><path d="M13 27L27 13M20 13v14M13 20h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/></svg> },
  { name: "Jira",       color: "#0052CC", icon: <svg viewBox="0 0 40 40" fill="none"><path d="M20 8L8 20l12 12 12-12L20 8z" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M20 14v12M14 20h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6"/></svg> },
  { name: "WooCommerce",color: "#96588A", icon: <svg viewBox="0 0 40 40" fill="none"><rect x="7" y="12" width="26" height="18" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M12 20h4M20 20h4M12 24h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { name: "Pipedrive",  color: "#1CC551", icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2.5"/><path d="M20 13v7l5 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { name: "Google",     color: "#4285F4", icon: <svg viewBox="0 0 40 40" fill="none"><path d="M32 20c0-6.6-5.4-12-12-12a12 12 0 0 0-11.5 8.5h11.5v7H14a12 12 0 0 0 18-3.5z" stroke="currentColor" strokeWidth="2" fill="none"/></svg> },
];

function IconMarqueeRow({ icons, reverse = false }) {
  const items = [...icons, ...icons, ...icons];
  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", gap: 12, width: "max-content", animation: `${reverse ? "marqueeReverse" : "marqueeScroll"} 45s linear infinite` }}>
        {items.map((icon, i) => (
          <div key={i} style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
            width: 120, height: 110, flexShrink: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "border-color 0.18s ease", cursor: "default",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
          >
            <div style={{ width: 36, height: 36, color: icon.color }}>{icon.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: T.muted, letterSpacing: "0.01em" }}>{icon.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolIconGrid() {
  return (
    <>
      <Divider />
      <Section id="integrations" pad="64px 24px">
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <Eyebrow>Integrations</Eyebrow>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, letterSpacing: "-0.03em", color: T.text }}>We work with the tools<br />you already use.</h2>
            </div>
            <p style={{ fontSize: 13, color: T.muted, maxWidth: 260, lineHeight: 1.6 }}>No ripping out existing systems. We automate around your current stack.</p>
          </div>
        </FadeIn>

        <div style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: 12, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 0" }}>
          {/* Fade edges */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(90deg, ${T.surface}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(270deg, ${T.surface}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
          <IconMarqueeRow icons={ICONS_ROW1} reverse={false} />
          <IconMarqueeRow icons={ICONS_ROW2} reverse={true} />
        </div>
      </Section>
    </>
  );
}


function Process() {
  const steps = [
    { n: "01", title: "Audit", duration: "Week 1–2", desc: "We spend time understanding how your business actually operates. We identify every manual process, every broken handoff, and every missing integration. You receive a detailed map of where automation will have the highest impact." },
    { n: "02", title: "Build", duration: "Week 3–6", desc: "We design and build your automation systems to a production standard. Every workflow is tested against real data before it touches your live operations. Nothing ships until it works." },
    { n: "03", title: "Handover", duration: "Week 7–8", desc: "Every system is documented and handed over with full training. We do not create dependency. You own everything we build, and your team understands exactly how it works." },
  ];
  return (
    <>
      <Divider />
      <Section id="process" pad="64px 24px">
        <FadeIn>
          <div style={{ marginBottom: 44 }}>
            <Eyebrow>How it works</Eyebrow>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: T.text, maxWidth: 520 }}>A structured process.<br />Predictable outcomes.</h2>
          </div>
        </FadeIn>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 27, top: 52, bottom: 52, width: 1, background: `linear-gradient(${T.teal}44, ${T.border} 90%)` }} />
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "0 40px", paddingBottom: 36 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1.5px solid ${T.teal}66`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T.teal, letterSpacing: "0.05em", flexShrink: 0 }}>{s.n}</div>
                </div>
                <div style={{ paddingTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: T.text }}>{s.title}</h3>
                    <span style={{ fontSize: 12, color: T.muted }}>{s.duration}</span>
                  </div>
                  <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, maxWidth: 520 }}>{s.desc}</p>
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
  const [v, setV] = useState({ teamSize: 8, hoursWasted: 5, hourlyRate: 45, revenuePerHour: 120 });
  const annualCost = v.teamSize * v.hoursWasted * v.hourlyRate * 52;
  const annualRev  = v.teamSize * v.hoursWasted * v.revenuePerHour * 52;
  const total      = annualCost + annualRev;
  const fmt = n => n >= 1000 ? `£${(n/1000).toFixed(0)}k` : `£${n}`;
  const sliders = [
    { key: "teamSize",       label: "Team size",                          min: 1,  max: 50,  suffix: " people" },
    { key: "hoursWasted",    label: "Manual hours per person / week",     min: 1,  max: 30,  suffix: "h/wk" },
    { key: "hourlyRate",     label: "Average staff hourly cost",          min: 15, max: 150, prefix: "£", suffix: "/hr" },
    { key: "revenuePerHour", label: "Revenue generated per billable hour",min: 50, max: 500, prefix: "£", suffix: "/hr" },
  ];
  return (
    <>
      <Divider />
      <Section id="roi" pad="64px 24px">
        <FadeIn>
          <div style={{ marginBottom: 36 }}>
            <Eyebrow>ROI Calculator</Eyebrow>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: T.text, maxWidth: 560 }}>What is manual process<br />actually costing you?</h2>
            <p style={{ fontSize: 16, color: T.muted, marginTop: 16, maxWidth: 440, lineHeight: 1.7 }}>Adjust the values to reflect your business. The numbers update instantly.</p>
          </div>
        </FadeIn>
        <div className="roi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 48, alignItems: "start" }}>
          <FadeIn>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {sliders.map(s => (
                <div key={s.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                    <label style={{ fontSize: 14, color: T.muted }}>{s.label}</label>
                    <span style={{ fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>{s.prefix||""}{v[s.key]}{s.suffix}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} value={v[s.key]} onChange={e => setV(p => ({ ...p, [s.key]: Number(e.target.value) }))}
                    style={{ width: "100%", accentColor: T.teal, cursor: "pointer" }} />
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 18, position: "sticky", top: 88 }}>
              {[
                { label: "Labour cost",       value: annualCost, desc: "Staff time on manual work",   hi: false },
                { label: "Lost revenue",       value: annualRev,  desc: "Billable hours displaced",    hi: false },
                { label: "Total opportunity",  value: total,      desc: "Combined annual impact",      hi: true  },
              ].map((item, i) => (
                <div key={i} style={{ padding: item.hi ? "20px 24px" : 0, background: item.hi ? `${T.teal}11` : "transparent", border: item.hi ? `1px solid ${T.teal}33` : "none", borderRadius: item.hi ? 8 : 0, borderTop: !item.hi && i>0 ? `1px solid ${T.border}` : "none", paddingTop: !item.hi && i>0 ? 20 : undefined }}>
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: item.hi ? 32 : 24, fontWeight: 700, letterSpacing: "-0.03em", color: item.hi ? T.tealLight : T.text, transition: "all 0.15s ease", marginBottom: 2 }}>{fmt(item.value)}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{item.desc}</div>
                </div>
              ))}
              <Btn onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })} sx={{ width: "100%", justifyContent: "center" }}>Apply for a consultation</Btn>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}

// ─── Automation Planner ───────────────────────────────────────────────────────
const Qs = [
  { key: "industry", q: "What industry does your business operate in?",   hint: "This helps us identify the most relevant automation patterns.",                options: ["Professional Services","E-commerce & Retail","Financial Services","Healthcare & Wellness","Technology & SaaS","Manufacturing","Real Estate","Other"] },
  { key: "size",     q: "How large is your team?",                         hint: "Team size shapes the scope and complexity of automation that makes sense.",   options: ["1–5 people","6–15 people","16–50 people","50+ people"] },
  { key: "problem",  q: "Where is your biggest source of manual work?",    hint: "Be honest about where your team spends time they shouldn't.",                 options: ["Data entry & reporting","Client communication & follow-ups","Internal handoffs & approvals","Onboarding & offboarding","Order & project management","Multiple areas equally"] },
  { key: "tools",    q: "Which systems does your team rely on most?",       hint: "We need to work with what you already have.",                                 options: ["CRM (HubSpot, Salesforce, etc.)","Project management (Asana, Monday, etc.)","Accounting (Xero, QuickBooks, etc.)","Communication (Slack, Teams, etc.)","Custom or legacy software","Google Workspace / Microsoft 365"] },
  { key: "timeline", q: "What is your expected timeline for implementation?", hint: "This helps us assess whether we are the right fit right now.",              options: ["As soon as possible","Within 3 months","Within 6 months","Exploring options, no fixed timeline"] },
];

function AutomationPlanner() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const q = Qs[step];
  const select = opt => {
    const a = { ...answers, [q.key]: opt };
    setAnswers(a);
    if (step < Qs.length-1) setTimeout(() => setStep(s => s+1), 180);
    else setTimeout(() => setDone(true), 180);
  };
  const reset = () => { setStep(0); setAnswers({}); setDone(false); };
  const summary = () => {
    const m = { "1–5 people":"a focused single-system engagement","6–15 people":"a team-wide automation programme","16–50 people":"a multi-department integration","50+ people":"an enterprise-scale automation rollout" };
    return `Based on your answers, we'd recommend ${m[answers.size]||"a bespoke engagement"} starting with your ${answers.problem?.toLowerCase()||"core operational"} processes.`;
  };
  return (
    <>
      <Divider />
      <Section id="planner" pad="64px 24px">
        <FadeIn>
          <div style={{ marginBottom: 36 }}>
            <Eyebrow>Automation Planner</Eyebrow>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: T.text, maxWidth: 560 }}>Understand what automation<br />looks like for your business.</h2>
            <p style={{ fontSize: 16, color: T.muted, marginTop: 16, maxWidth: 400, lineHeight: 1.7 }}>Five questions. Two minutes. A clear starting point.</p>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div style={{ maxWidth: 680, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ height: 2, background: T.border }}>
              <div style={{ height: "100%", width: done ? "100%" : `${(step/Qs.length)*100}%`, background: T.teal, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ padding: "36px" }}>
              {!done ? (
                <>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>{step+1} / {Qs.length}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: T.text, marginBottom: 8, lineHeight: 1.3 }}>{q.q}</h3>
                  <p style={{ fontSize: 13, color: T.muted, marginBottom: 32, lineHeight: 1.6 }}>{q.hint}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {q.options.map((opt, i) => <POpt key={i} label={opt} selected={answers[q.key]===opt} onSelect={() => select(opt)} />)}
                  </div>
                  {step > 0 && (
                    <button onClick={() => setStep(s => s-1)} style={{ marginTop: 24, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: T.muted, display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}
                      onMouseEnter={e => e.currentTarget.style.color=T.text} onMouseLeave={e => e.currentTarget.style.color=T.muted}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 6H3M5 4L3 6l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Back
                    </button>
                  )}
                </>
              ) : (
                <div>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${T.teal}22`, border: `1px solid ${T.teal}44`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11l5 5 9-9" stroke={T.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: T.text, marginBottom: 12 }}>Here is what we'd recommend</h3>
                  <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.7, marginBottom: 28 }}>{summary()}</p>
                  <div style={{ background: `${T.teal}0D`, border: `1px solid ${T.teal}22`, borderRadius: 8, padding: "20px 24px", marginBottom: 32 }}>
                    {Object.entries(answers).map(([key, val]) => (
                      <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
                        <span style={{ color: T.muted, textTransform: "capitalize" }}>{key}</span>
                        <span style={{ color: T.text, fontWeight: 500 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <Btn onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}>Apply now <ArrowR /></Btn>
                    <Btn variant="secondary" onClick={reset}>Start over</Btn>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}

function POpt({ label, selected, onSelect }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onSelect} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: "100%", textAlign: "left", padding: "13px 18px", background: selected ? `${T.teal}18` : h ? T.surfaceHover : "transparent", border: `1px solid ${selected ? T.teal : h ? T.borderHover : T.border}`, borderRadius: 7, cursor: "pointer", fontSize: 14, color: selected ? T.tealLight : h ? T.text : T.muted, fontFamily: "inherit", transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${selected ? T.teal : T.border}`, background: selected ? T.teal : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease" }}>
        {selected && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      {label}
    </button>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const [support, setSupport] = useState(false);
  const tiers = [
    { name: "Foundation", price: 2200, sPrice: 290,  desc: "One core automation. Ideal for a single high-overhead process.", features: ["Process audit (up to 3 workflows)","1 automated workflow","Integration with up to 3 tools","Testing & documentation","1 hour team training"] },
    { name: "Systems",    price: 3500, sPrice: 490,  featured: true, desc: "Multiple interconnected automations across your core operations.", features: ["Full process audit","Up to 4 automated workflows","Integration with up to 8 tools","AI-powered workflow included","Live dashboard & reporting","2 hours team training"] },
    { name: "Operations", price: 8500, sPrice: 790, desc: "A complete operational automation strategy across every department.", features: ["Comprehensive operations audit","Unlimited workflow builds","Full system integration","Custom AI models included","Dashboards per department","Ongoing optimisation support","Quarterly review sessions"] },
  ];
  const fmt = n => `£${n.toLocaleString()}`;
  return (
    <>
      <Divider />
      <Section id="pricing" pad="64px 24px">
        <FadeIn>
          <div style={{ marginBottom: 32 }}>
            <Eyebrow>Pricing</Eyebrow>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: T.text, maxWidth: 520, marginBottom: 20 }}>Fixed-scope projects.<br />No surprises.</h2>
            <p style={{ fontSize: 15, color: T.muted, maxWidth: 420, lineHeight: 1.7, marginBottom: 24 }}>All projects priced upfront. Optional monthly support retainers available after delivery.</p>
            <button onClick={() => setSupport(s => !s)} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 24, padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: T.muted }}>
              <span style={{ width: 32, height: 18, borderRadius: 9, background: support ? T.teal : T.border, position: "relative", transition: "background 0.2s ease", flexShrink: 0 }}>
                <span style={{ position: "absolute", width: 14, height: 14, borderRadius: "50%", background: "#fff", top: 2, left: support ? 16 : 2, transition: "left 0.2s ease" }} />
              </span>
              Show monthly support pricing
            </button>
          </div>
        </FadeIn>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {tiers.map((t, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div style={{ padding: "28px 24px", background: t.featured ? `${T.teal}0C` : T.surface, border: `1px solid ${t.featured ? T.teal+"44" : T.border}`, borderRadius: 10, display: "flex", flexDirection: "column", gap: 20, position: "relative", height: "100%" }}>
                {t.featured && <div style={{ position: "absolute", top: -1, left: 32, background: T.teal, borderRadius: "0 0 6px 6px", padding: "3px 12px", fontSize: 11, fontWeight: 600, color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase" }}>Most popular</div>}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.muted, marginBottom: 8 }}>{t.name}</div>
                  <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", color: T.text, lineHeight: 1 }}>{fmt(t.price)}</div>
                  {support && <div style={{ fontSize: 13, color: T.tealLight, marginTop: 6 }}>+ {fmt(t.sPrice)}/mo support</div>}
                  <p style={{ fontSize: 13, color: T.muted, marginTop: 12, lineHeight: 1.6 }}>{t.desc}</p>
                </div>
                <div style={{ flex: 1 }}>
                  {t.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: j < t.features.length-1 ? `1px solid ${T.border}` : "none" }}>
                      <CheckIcon /><span style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Btn variant={t.featured ? "primary" : "secondary"} onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })} sx={{ width: "100%", justifyContent: "center" }}>Apply for this tier</Btn>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={200}>
          <p style={{ textAlign: "center", fontSize: 13, color: T.muted, marginTop: 36, lineHeight: 1.6 }}>
            All projects include a discovery call, detailed proposal, and fixed scope before any commitment.<br />
            Not sure which tier fits? Apply and we will recommend the right one.
          </p>
        </FadeIn>
      </Section>
    </>
  );
}

// ─── Apply ────────────────────────────────────────────────────────────────────
function Apply() {
  const [form, setForm] = useState({ name:"", company:"", email:"", revenue:"", problem:"", tier:"" });
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
  const submit = () => { const e = validate(); if (Object.keys(e).length) { setErrors(e); return; } setSubmitted(true); };
  const inp = k => ({ width:"100%", background:T.ink, border:`1px solid ${errors[k]?T.error:T.border}`, borderRadius:7, padding:"12px 16px", fontSize:14, color:T.text, fontFamily:"inherit", outline:"none", transition:"border-color 0.18s" });
  const lbl = { fontSize:13, fontWeight:500, color:T.muted, display:"block", marginBottom:8 };
  return (
    <>
      <Divider />
      <Section id="apply" pad="64px 24px">
        <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
          <FadeIn>
            <Eyebrow>Apply</Eyebrow>
            <h2 style={{ fontSize:"clamp(28px, 4vw, 42px)", fontWeight:700, letterSpacing:"-0.03em", lineHeight:1.15, color:T.text, marginBottom:20 }}>We take on a small number<br />of clients each quarter.</h2>
            <p style={{ fontSize:15, color:T.muted, lineHeight:1.75, maxWidth:380, marginBottom:36 }}>Applications help us understand whether we are the right fit before either party invests time. Qualified applicants receive a personal response within two business days.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {[
                { label:"We only work with",   value:"Established businesses with an existing operations challenge" },
                { label:"We do not work with", value:"Early-stage ideas or businesses seeking product development" },
                { label:"Typical engagement",  value:"6–10 weeks, fixed scope, clear deliverables" },
              ].map((item, i) => (
                <div key={i} style={{ display:"flex", gap:12 }}>
                  <div style={{ width:1, background:T.teal, flexShrink:0 }} />
                  <div>
                    <div style={{ fontSize:11, color:T.teal, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>{item.label}</div>
                    <div style={{ fontSize:14, color:T.muted, lineHeight:1.6 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            {!submitted ? (
              <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:32, display:"flex", flexDirection:"column", gap:20 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                  <div>
                    <label style={lbl}>Full name</label>
                    <input value={form.name} onChange={e => set("name", e.target.value)} onFocus={e => e.target.style.borderColor=T.teal} onBlur={e => e.target.style.borderColor=errors.name?T.error:T.border} placeholder="Jane Smith" style={inp("name")} />
                    {errors.name && <div style={{ fontSize:11, color:T.error, marginTop:4 }}>{errors.name}</div>}
                  </div>
                  <div>
                    <label style={lbl}>Company</label>
                    <input value={form.company} onChange={e => set("company", e.target.value)} onFocus={e => e.target.style.borderColor=T.teal} onBlur={e => e.target.style.borderColor=errors.company?T.error:T.border} placeholder="Acme Ltd" style={inp("company")} />
                    {errors.company && <div style={{ fontSize:11, color:T.error, marginTop:4 }}>{errors.company}</div>}
                  </div>
                </div>
                <div>
                  <label style={lbl}>Business email</label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)} onFocus={e => e.target.style.borderColor=T.teal} onBlur={e => e.target.style.borderColor=errors.email?T.error:T.border} placeholder="jane@acmeltd.com" style={inp("email")} />
                  {errors.email && <div style={{ fontSize:11, color:T.error, marginTop:4 }}>{errors.email}</div>}
                </div>
                <div>
                  <label style={lbl}>Annual revenue (approximate)</label>
                  <select value={form.revenue} onChange={e => set("revenue", e.target.value)} style={{ ...inp("revenue"), cursor:"pointer" }}>
                    <option value="" style={{ background:T.surface }}>Select a range</option>
                    {["Under £500k","£500k – £2m","£2m – £10m","£10m+"].map(r => <option key={r} value={r} style={{ background:T.surface }}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Describe your biggest operational challenge</label>
                  <textarea value={form.problem} onChange={e => set("problem", e.target.value)} onFocus={e => e.target.style.borderColor=T.teal} onBlur={e => e.target.style.borderColor=errors.problem?T.error:T.border} placeholder="Where is your team losing the most time? What breaks down most often?" rows={4} style={{ ...inp("problem"), resize:"vertical", lineHeight:1.6 }} />
                  {errors.problem && <div style={{ fontSize:11, color:T.error, marginTop:4 }}>{errors.problem}</div>}
                </div>
                <div>
                  <label style={lbl}>Which engagement tier interests you?</label>
                  <select value={form.tier} onChange={e => set("tier", e.target.value)} style={{ ...inp("tier"), cursor:"pointer" }}>
                    <option value="" style={{ background:T.surface }}>Not sure yet</option>
                    {["Foundation — £2,200","Systems — £3,500","Operations — £8,500"].map(t => <option key={t} value={t} style={{ background:T.surface }}>{t}</option>)}
                  </select>
                </div>
                <Btn onClick={submit} sx={{ width:"100%", justifyContent:"center" }} size="lg">Submit application</Btn>
                <p style={{ fontSize:12, color:T.muted, textAlign:"center", lineHeight:1.6 }}>Qualified applicants receive a personal response within two business days. No automated replies.</p>
              </div>
            ) : (
              <div style={{ background:T.surface, border:`1px solid ${T.teal}44`, borderRadius:12, padding:"48px 32px", textAlign:"center" }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:`${T.teal}22`, border:`1px solid ${T.teal}55`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5 9.5-9" stroke={T.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em", marginBottom:12 }}>Application received</h3>
                <p style={{ fontSize:15, color:T.muted, lineHeight:1.7, maxWidth:320, margin:"0 auto" }}>Thank you, {form.name}. We will review your application and respond personally within two business days.</p>
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
    <footer style={{ borderTop:`1px solid ${T.border}`, padding:"32px 24px" }}>
      <div style={{ maxWidth:1120, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke={T.teal} strokeWidth="1.5" />
            <path d="M6 14 C8 8, 14 8, 16 14" stroke={T.teal} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="11" cy="11" r="2" fill={T.teal} />
          </svg>
          <span style={{ fontSize:14, fontWeight:600, color:T.muted, letterSpacing:"-0.01em" }}>Marina</span>
        </div>
        <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
          {["Services","Process","Results","Pricing","Apply"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize:13, color:T.muted, textDecoration:"none", transition:"color 0.18s" }}
              onMouseEnter={e => e.target.style.color=T.text} onMouseLeave={e => e.target.style.color=T.muted}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize:12, color:T.border }}>© {new Date().getFullYear()} Marina</div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MarinaSolutions() {
  return (
    <>
      <GlobalStyles />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <UseCaseSwitcher />
        <Services />
        <Capabilities />
        <ToolIconGrid />
        <Process />
        <ROICalculator />
        <AutomationPlanner />
        <Pricing />
        <Apply />
      </main>
      <Footer />
    </>
  );
}