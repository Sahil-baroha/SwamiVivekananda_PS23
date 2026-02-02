import { useState } from "react";

// ──────────────────────────────────────────────
// EYE ICON (password toggle)
// ──────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ──────────────────────────────────────────────
// MAIN AUTH PAGE
// ──────────────────────────────────────────────
export default function AuthPage() {
  // mode: "signup" | "login"
  const [mode, setMode] = useState("signup");
  const [showPass, setShowPass] = useState(false);
  const [termsChecked, setTermsChecked] = useState(true);

  // Form state
  const [form, setForm] = useState({
    username: "",
    lastName: "",
    email: "",
    password: "",
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // ── INPUT COMPONENT ──
  const Input = ({ placeholder, value, onChange, type = "text", showToggle, toggleState, onToggle, half = false }) => {
    const [focused, setFocused] = useState(false);
    return (
      <div style={{
        position: "relative",
        width: half ? "calc(50% - 6px)" : "100%",
        flexShrink: half ? 0 : undefined,
      }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${focused ? "rgba(139,92,246,0.55)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "10px",
            padding: "13px 16px",
            paddingRight: showToggle ? "42px" : "16px",
            color: "#ffffff",
            fontSize: "14px",
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 200ms ease, box-shadow 200ms ease",
            boxShadow: focused ? "0 0 0 3px rgba(139,92,246,0.12)" : "none",
          }}
        />
        {/* Placeholder styling override via CSS */}
        {showToggle && (
          <button
            onClick={onToggle}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 200ms",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <EyeIcon open={toggleState} />
          </button>
        )}
      </div>
    );
  };

  // ── SLIDE TOGGLE ──
  const SlideToggle = () => {
    const signupActive = mode === "signup";
    return (
      <div style={{
        display: "flex",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "10px",
        padding: "4px",
        position: "relative",
        marginBottom: "32px",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        {/* Sliding background pill */}
        <div style={{
          position: "absolute",
          top: "4px",
          left: signupActive ? "4px" : "calc(50%)",
          width: "calc(50% - 4px)",
          height: "calc(100% - 8px)",
          background: "rgba(139,92,246,0.25)",
          borderRadius: "7px",
          transition: "left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 0,
        }} />

        {/* Buttons */}
        {["signup", "login"].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setShowPass(false); }}
            style={{
              position: "relative",
              zIndex: 1,
              flex: 1,
              background: "transparent",
              border: "none",
              borderRadius: "7px",
              padding: "9px 0",
              cursor: "pointer",
              color: mode === m ? "#ffffff" : "rgba(255,255,255,0.42)",
              fontSize: "13.5px",
              fontWeight: mode === m ? 600 : 500,
              fontFamily: "inherit",
              transition: "color 300ms ease",
              textTransform: "capitalize",
            }}
          >
            {m === "signup" ? "Sign Up" : "Log In"}
          </button>
        ))}
      </div>
    );
  };

  // ── SIGNUP FORM ──
  const SignupForm = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Username + Last name row */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Input placeholder="Username" value={form.username} onChange={update("username")} half />
        <Input placeholder="Last name" value={form.lastName} onChange={update("lastName")} half />
      </div>
      <Input placeholder="Email" value={form.email} onChange={update("email")} type="email" />
      <Input
        placeholder="Enter your password"
        value={form.password}
        onChange={update("password")}
        type={showPass ? "text" : "password"}
        showToggle
        toggleState={showPass}
        onToggle={() => setShowPass(!showPass)}
      />

      {/* Terms checkbox */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2px" }}>
        <div
          onClick={() => setTermsChecked(!termsChecked)}
          style={{
            width: "20px",
            height: "20px",
            minWidth: "20px",
            borderRadius: "5px",
            background: termsChecked ? "#7c3aed" : "rgba(255,255,255,0.06)",
            border: termsChecked ? "none" : "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 200ms ease",
          }}
        >
          {termsChecked && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2 6 5 9 10 3" />
            </svg>
          )}
        </div>
        <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", lineHeight: 1.4 }}>
          I agree to the{" "}
          <a href="#" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 500, transition: "color 200ms" }}
            onMouseEnter={e => e.target.style.color = "#a78bfa"}
            onMouseLeave={e => e.target.style.color = "#7c3aed"}
          >
            Terms &amp; Conditions
          </a>
        </span>
      </div>

      {/* CTA */}
      <button style={{
        marginTop: "8px",
        width: "100%",
        background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
        border: "none",
        borderRadius: "10px",
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: 600,
        padding: "13px 0",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 200ms ease",
        boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.45)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(124,58,237,0.3)"; }}
      >
        Create account
      </button>
    </div>
  );

  // ── LOGIN FORM ──
  const LoginForm = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <Input placeholder="Username" value={form.username} onChange={update("username")} />
      <Input
        placeholder="Enter your password"
        value={form.password}
        onChange={update("password")}
        type={showPass ? "text" : "password"}
        showToggle
        toggleState={showPass}
        onToggle={() => setShowPass(!showPass)}
      />

      {/* Forgot password */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-6px" }}>
        <a href="#" style={{ color: "rgba(255,255,255,0.38)", fontSize: "12.5px", textDecoration: "none", transition: "color 200ms" }}
          onMouseEnter={e => e.target.style.color = "#a78bfa"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.38)"}
        >
          Forgot password?
        </a>
      </div>

      {/* CTA */}
      <button style={{
        marginTop: "4px",
        width: "100%",
        background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
        border: "none",
        borderRadius: "10px",
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: 600,
        padding: "13px 0",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 200ms ease",
        boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.45)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(124,58,237,0.3)"; }}
      >
        Log in
      </button>
    </div>
  );

  // ── RENDER ──
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#1a1625",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflow: "hidden",
    }}>

      {/* ═══ LEFT PANEL — Image / Atmosphere ═══ */}
      <div className="left-panel" style={{
        width: "46%",
        minWidth: "46%",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Deep purple atmospheric gradient (replaces image) */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(
              180deg,
              #1a1030 0%,
              #2d1b4e 15%,
              #3d2260 28%,
              #4a2d72 38%,
              #5c3a8a 48%,
              #4a3580 55%,
              #2e2458 65%,
              #1e1840 75%,
              #141030 88%,
              #0f0d22 100%
            )
          `,
        }} />

        {/* Sand-dune silhouette shape */}
        <svg style={{ position: "absolute", bottom: "28%", left: 0, width: "100%", height: "55%", zIndex: 1 }} viewBox="0 0 500 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="duneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b2955" />
              <stop offset="60%" stopColor="#221a3a" />
              <stop offset="100%" stopColor="#151028" />
            </linearGradient>
          </defs>
          <path d="M0,180 C60,160 120,80 200,100 C260,115 300,60 380,90 C430,105 470,70 500,85 L500,300 L0,300 Z" fill="url(#duneGrad)" />
          <path d="M0,200 C80,185 150,140 240,155 C310,165 360,130 420,148 C460,158 490,140 500,145 L500,300 L0,300 Z" fill="#1a1330" opacity="0.7" />
        </svg>

        {/* Subtle light ray from top */}
        <div style={{
          position: "absolute",
          top: "-10%",
          left: "30%",
          width: "60%",
          height: "65%",
          background: "radial-gradient(ellipse at 50% 0%, rgba(100,60,180,0.25) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }} />

        {/* Logo top-left */}
        <div style={{ position: "absolute", top: "28px", left: "28px", zIndex: 5 }}>
          <span style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "inherit" }}>
            CampusAI
          </span>
        </div>

        {/* Back to website pill — top right */}
        <div style={{ position: "absolute", top: "24px", right: "24px", zIndex: 5 }}>
          <a href="#" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "999px", padding: "7px 16px",
            color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: 500,
            textDecoration: "none", transition: "all 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
          >
            Back to website
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* Bottom tagline */}
        <div style={{ position: "absolute", bottom: "60px", left: "32px", zIndex: 5 }}>
          <h2 style={{
            color: "#ffffff", fontSize: "24px", fontWeight: 600,
            lineHeight: 1.35, margin: 0, letterSpacing: "-0.01em",
          }}>
            Your questions,<br />answered instantly.
          </h2>
        </div>

        {/* Carousel dots */}
        <div style={{ position: "absolute", bottom: "32px", left: "32px", zIndex: 5, display: "flex", gap: "8px", alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: i === 2 ? "24px" : "8px",
              height: "8px",
              borderRadius: "999px",
              background: i === 2 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
              transition: "all 300ms ease",
            }} />
          ))}
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Auth Form ═══ */}
      <div className="right-panel" style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 48px",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          {/* Heading */}
          <h1 style={{
            color: "#ffffff",
            fontSize: "32px",
            fontWeight: 700,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}>
            {mode === "signup" ? "Create an account" : "Welcome back"}
          </h1>

          {/* Sub text */}
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "13.5px",
            margin: "0 0 28px",
            fontWeight: 400,
          }}>
            {mode === "signup" ? (
              <>Already have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); }} style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 500, transition: "color 200ms" }}
                  onMouseEnter={e => e.target.style.color = "#a78bfa"}
                  onMouseLeave={e => e.target.style.color = "#7c3aed"}
                >Log in</a>
              </>
            ) : (
              <>Don't have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("signup"); }} style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 500, transition: "color 200ms" }}
                  onMouseEnter={e => e.target.style.color = "#a78bfa"}
                  onMouseLeave={e => e.target.style.color = "#7c3aed"}
                >Sign up</a>
              </>
            )}
          </p>

          {/* Slide Toggle */}
          <SlideToggle />

          {/* Form (animated swap) */}
          <div style={{ transition: "opacity 250ms ease", opacity: 1 }}>
            {mode === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
        </div>
      </div>

      {/* ═══ RESPONSIVE ═══ */}
      <style>{`
        input::placeholder { color: rgba(255,255,255,0.32) !important; }

        /* Tablet */
        @media (max-width: 900px) {
          .left-panel { width: 38% !important; min-width: 38% !important; }
        }

        /* Mobile: left panel becomes a top strip */
        @media (max-width: 640px) {
          .left-panel {
            width: 100% !important;
            min-width: 100% !important;
            height: 200px !important;
            position: fixed !important;
            top: 0; left: 0; right: 0;
            z-index: 0;
          }
          .right-panel {
            position: relative !important;
            z-index: 1;
            margin-top: 200px !important;
            padding: 32px 24px !important;
            min-height: calc(100vh - 200px) !important;
            align-items: flex-start !important;
          }
        }

        /* Force two-column name row to stack on very small */
        @media (max-width: 420px) {
          .left-panel { height: 160px !important; }
          .right-panel { margin-top: 160px !important; min-height: calc(100vh - 160px) !important; }
        }
      `}</style>
    </div>
  );
}
