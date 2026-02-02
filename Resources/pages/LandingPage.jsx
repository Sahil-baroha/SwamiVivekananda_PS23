import { useState } from "react";

// ──────────────────────────────────────────────────────────
// LOGO ICON — radial dot-circle SVG replicating the template
// ──────────────────────────────────────────────────────────
function LogoIcon() {
  const dots = [];
  const rings = [
    { count: 1, radius: 0, size: 2.2 },
    { count: 6, radius: 4.5, size: 1.6 },
    { count: 12, radius: 8.2, size: 1.3 },
    { count: 18, radius: 11.8, size: 1.0 },
  ];
  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * Math.PI * 2 - Math.PI / 2;
      dots.push(
        <circle
          key={`${ri}-${i}`}
          cx={16 + Math.cos(angle) * ring.radius}
          cy={16 + Math.sin(angle) * ring.radius}
          r={ring.size}
          fill="rgba(255,255,255,0.75)"
        />
      );
    }
  });
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      {dots}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// MAIN LANDING PAGE
// ──────────────────────────────────────────────────────────
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#05050a", overflow: "hidden", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ─── LAYER 1: Radial Blue Bloom ─── */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        background: "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(25,35,75,0.45) 0%, rgba(20,28,60,0.18) 40%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ─── LAYER 2: Grid Overlay ─── */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      {/* ─── CONTENT (above layers) ─── */}
      <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ═══════════ NAVBAR ═══════════ */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
          position: "relative",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <LogoIcon />
            <span style={{ color: "#ffffff", fontSize: "18px", fontWeight: 500, letterSpacing: "-0.01em" }}>
              CampusAI
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "30px", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            {["Features", "About", "FAQ"].map((link) => (
              <a
                key={link}
                href="#"
                style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", fontWeight: 400, textDecoration: "none", transition: "color 200ms ease" }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,1)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Desktop Sign Up */}
          <button
            className="desktop-signup"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 500,
              padding: "7px 18px",
              borderRadius: "7px",
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
            onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.42)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.22)"; e.target.style.background = "transparent"; }}
          >
            Sign Up
          </button>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="mobile-menu" style={{
            position: "absolute", top: "62px", left: 0, right: 0, zIndex: 50,
            background: "rgba(10,10,18,0.92)", backdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: "18px",
          }}>
            {["Features", "About", "FAQ"].map((link) => (
              <a key={link} href="#" style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", textDecoration: "none", fontWeight: 400 }}>
                {link}
              </a>
            ))}
            <button style={{
              marginTop: "6px", background: "transparent", border: "1px solid rgba(255,255,255,0.22)",
              color: "#fff", fontSize: "14px", fontWeight: 500, padding: "9px 0", borderRadius: "7px", cursor: "pointer",
            }}>
              Sign Up
            </button>
          </div>
        )}

        {/* ═══════════ HERO SECTION ═══════════ */}
        <main style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
          paddingBottom: "60px",
        }}>

          {/* Announcement Pill */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.055)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "999px",
            padding: "6px 16px",
            marginBottom: "44px",
          }}>
            <span style={{ color: "rgba(255,255,255,0.48)", fontSize: "13px", fontWeight: 400, whiteSpace: "nowrap" }}>
              Your college, answered instantly.
            </span>
            <a
              href="#"
              style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", transition: "color 200ms ease" }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.9)"}
            >
              Learn More →
            </a>
          </div>

          {/* Headline */}
          <h1 style={{
            color: "#ffffff",
            fontSize: "clamp(34px, 6.5vw, 70px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "720px",
            margin: "0 0 22px 0",
          }}>
            Ask anything about<br />your college life.
          </h1>

          {/* Sub-headline */}
          <p style={{
            color: "rgba(255,255,255,0.42)",
            fontSize: "clamp(13px, 1.6vw, 15.5px)",
            fontWeight: 400,
            lineHeight: 1.65,
            maxWidth: "480px",
            margin: "0 0 38px 0",
          }}>
            Admissions, timetables, scholarships — get instant, accurate answers powered by AI. No waiting in line, no guessing.
          </p>

          {/* CTA Buttons */}
          <div className="cta-row" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>

            {/* Primary */}
            <button
              style={{
                background: "#3b82f6",
                border: "none",
                color: "#ffffff",
                fontSize: "14.5px",
                fontWeight: 600,
                padding: "10px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 200ms ease",
                boxShadow: "none",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#5a9cf5"; e.currentTarget.style.boxShadow = "0 0 18px rgba(59,130,246,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#3b82f6"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Get Started — Free
            </button>

            {/* Secondary */}
            <button
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#ffffff",
                fontSize: "14.5px",
                fontWeight: 500,
                padding: "10px 22px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 200ms ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "transparent"; }}
            >
              {/* Play triangle */}
              <svg width="11" height="11" viewBox="0 0 12 12" fill="white">
                <polygon points="2,1 11,6 2,11" />
              </svg>
              Watch Video
            </button>
          </div>
        </main>
      </div>

      {/* ═══════════ RESPONSIVE STYLES ═══════════ */}
      <style>{`
        /* Tablet: ≤ 1024px */
        @media (max-width: 1024px) {
          .desktop-nav a { font-size: 13px !important; }
        }

        /* Mobile: ≤ 767px */
        @media (max-width: 767px) {
          .desktop-nav   { display: none !important; }
          .desktop-signup { display: none !important; }
          .mobile-menu-btn { display: block !important; }

          .cta-row {
            flex-direction: column !important;
            width: 100%;
            max-width: 260px;
          }
          .cta-row button {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}
