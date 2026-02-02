import { useState, useRef, useEffect } from "react";

// ──────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────
const HISTORY = [
  { id: 1, title: "What are the admission requirements?" },
  { id: 2, title: "Bus schedule for North Campus" },
  { id: 3, title: "Merit scholarship eligibility criteria" },
  { id: 4, title: "Exam pattern for 3rd semester" },
  { id: 5, title: "Library and lab operating hours" },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "user",
    text: "How to use the college help desk?",
    time: "at: 02:12 am",
  },
  {
    id: 2,
    role: "ai",
    responseTime: "response time: 1.2s",
    title: "How to use the College Help Desk?",
    content: [
      {
        type: "intro",
        text: "The College Help Desk is an AI-powered assistant designed to answer your questions instantly based on official college data. Here's how to get the most out of it:",
      },
      {
        type: "list",
        items: [
          {
            bold: "Ask Naturally:",
            text: "You can type your question in plain English — for example, \"What are the admission deadlines?\" or \"Is there a scholarship for SC/ST students?\" The system understands your intent and routes it to the correct knowledge base automatically.",
          },
          {
            bold: "Topics Covered:",
            text: "The Help Desk covers Admissions, Academics & Timetables, Exam Patterns, College Norms, Scholarships, and Campus Facilities. Each topic is backed by official college documents.",
          },
          {
            bold: "Accurate Answers Only:",
            text: "The system is built with a zero-hallucination policy. It will only respond with information sourced directly from the college's official knowledge base — no guessing, no fabrication.",
          },
          {
            bold: "Chat History:",
            text: "Every conversation you have is saved in your personal history. You can revisit past chats at any time from the sidebar on the left.",
          },
          {
            bold: "Need More Help?:",
            text: "If the system cannot find an answer, it will let you know and suggest contacting the relevant department directly. You can also use the feedback buttons below any response.",
          },
        ],
      },
    ],
  },
];

// ──────────────────────────────────────────────
// ICONS (inline SVGs)
// ──────────────────────────────────────────────
const Icon = ({ type, size = 16, color = "currentColor" }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    chevronLeft: <polyline points="15 18 9 12 15 6" />,
    chevronDown: <polyline points="6 9 12 15 18 9" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></>,
    compose: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    paperclip: <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />,
    send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></>,
    rewrite: <><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />,</>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    export: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    arrowUp: <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
};

// ──────────────────────────────────────────────
// STREAMING CURSOR BLINK
// ──────────────────────────────────────────────
function StreamingCursor() {
  return (
    <span style={{
      display: "inline-block",
      width: "2px",
      height: "18px",
      background: "#fff",
      marginLeft: "3px",
      verticalAlign: "text-bottom",
      animation: "blink 1s step-end infinite",
    }} />
  );
}

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────
export default function ChatDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeChat, setActiveChat] = useState(1);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulated streaming send
  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    const userMsg = {
      id: messages.length + 1,
      role: "user",
      text: input.trim(),
      time: `at: ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    // Simulate AI streaming response after delay
    setTimeout(() => {
      const aiMsg = {
        id: messages.length + 2,
        role: "ai",
        responseTime: "response time: 0.9s",
        title: input.trim(),
        content: [
          {
            type: "intro",
            text: "Based on the official college knowledge base, here is the information you requested. Please refer to the relevant department if you need further clarification on this topic.",
          },
        ],
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsStreaming(false);
    }, 1800);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── SIDEBAR ──
  const Sidebar = () => (
    <aside style={{
      width: "220px",
      minWidth: "220px",
      background: "#0f0f14",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "relative",
      zIndex: 10,
    }}>
      {/* Top row: brand + collapse toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px" }}>
        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", fontWeight: 600, letterSpacing: "-0.01em" }}>
          CampusAI
        </span>
        <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 200ms" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <Icon type="chevronLeft" size={18} color="rgba(255,255,255,0.45)" />
        </button>
      </div>

      {/* Search box */}
      <div style={{ padding: "0 12px", marginBottom: "10px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px", padding: "8px 12px",
        }}>
          <Icon type="search" size={14} color="rgba(255,255,255,0.3)" />
          <input
            type="text" placeholder="search chat..."
            style={{
              background: "none", border: "none", outline: "none", flex: 1,
              color: "rgba(255,255,255,0.55)", fontSize: "13px", fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* Create chat button */}
      <div style={{ padding: "0 12px", marginBottom: "18px" }}>
        <button style={{
          width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px", color: "rgba(255,255,255,0.8)", fontSize: "13.5px", fontWeight: 500,
          padding: "9px 0", cursor: "pointer", transition: "all 200ms ease", fontFamily: "inherit",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.11)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
        >
          Create chat
        </button>
      </div>

      {/* History label */}
      <div style={{ padding: "0 16px", marginBottom: "10px" }}>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          History
        </span>
      </div>

      {/* History list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
        {HISTORY.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveChat(item.id)}
            style={{
              width: "100%", textAlign: "left", background: activeChat === item.id ? "rgba(255,255,255,0.08)" : "transparent",
              border: "none", borderRadius: "7px", padding: "9px 12px", cursor: "pointer",
              marginBottom: "2px", transition: "background 200ms ease", display: "flex", alignItems: "flex-start", gap: "9px",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { if (activeChat !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { if (activeChat !== item.id) e.currentTarget.style.background = "transparent"; }}
          >
            <Icon type="compose" size={14} color="rgba(255,255,255,0.3)" style={{ marginTop: "1px", flexShrink: 0 }} />
            <span style={{ color: activeChat === item.id ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.55)", fontSize: "13px", lineHeight: 1.45, fontWeight: 400 }}>
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );

  // ── HEADER BAR ──
  const HeaderBar = () => (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)",
      background: "#0f0f14", minHeight: "48px", flexShrink: 0,
    }}>
      {/* Left: hamburger (mobile) + model dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button className="hamburger-btn" style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "2px" }}
          onClick={() => setSidebarOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        </button>

        {/* Model selector pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px", padding: "6px 12px", cursor: "pointer", transition: "background 200ms",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
        >
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "13.5px", fontWeight: 500 }}>Gemini Flash</span>
          <Icon type="chevronDown" size={14} color="rgba(255,255,255,0.4)" />
        </div>
      </div>

      {/* Right: Export + Settings + Compose */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button style={{
          background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "7px", color: "rgba(255,255,255,0.7)", fontSize: "12.5px", fontWeight: 500,
          padding: "6px 14px", cursor: "pointer", transition: "all 200ms", fontFamily: "inherit",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
        >
          Export chat
        </button>

        {[{ type: "settings" }, { type: "compose" }].map((btn, i) => (
          <button key={i} style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "7px", padding: "6px 8px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            <Icon type={btn.type} size={16} color="rgba(255,255,255,0.55)" />
          </button>
        ))}
      </div>
    </header>
  );

  // ── MESSAGE RENDERER ──
  const renderMessage = (msg) => {
    if (msg.role === "user") {
      return (
        <div key={msg.id} style={{ padding: "24px 0 12px" }}>
          {/* User label + time */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "10px" }}>
            <span style={{ color: "rgba(255,255,255,0.88)", fontSize: "14px", fontWeight: 600 }}>User</span>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "11.5px", fontWeight: 400 }}>{msg.time}</span>
          </div>
          {/* User title (bold, larger) */}
          <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 600, margin: 0, lineHeight: 1.4, letterSpacing: "-0.01em" }}>
            {msg.text}
          </h3>
        </div>
      );
    }

    // AI message
    return (
      <div key={msg.id} style={{ paddingBottom: "8px" }}>
        {/* AI label + response time */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px" }}>
          <span style={{ color: "#3b82f6", fontSize: "14px", fontWeight: 600 }}>CampusAI</span>
          <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "11.5px", fontWeight: 400 }}>{msg.responseTime}</span>
        </div>

        {/* Content blocks */}
        {msg.content.map((block, bi) => {
          if (block.type === "intro") {
            return (
              <p key={`intro-${bi}`} style={{
                color: "rgba(255,255,255,0.72)", fontSize: "14px", lineHeight: 1.7,
                margin: "0 0 16px", fontWeight: 400,
              }}>
                {block.text}
                {isStreaming && bi === msg.content.length - 1 && msg.id === messages.length && <StreamingCursor />}
              </p>
            );
          }
          if (block.type === "list") {
            return (
              <ol key={`list-${bi}`} style={{ margin: 0, padding: "0 0 0 22px", listStyleType: "decimal" }}>
                {block.items.map((item, ii) => (
                  <li key={ii} style={{
                    color: "rgba(255,255,255,0.72)", fontSize: "14px", lineHeight: 1.75,
                    marginBottom: "12px", paddingLeft: "4px",
                  }}>
                    <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{item.bold}</span>{" "}
                    <span style={{ fontWeight: 400 }}>{item.text}</span>
                  </li>
                ))}
              </ol>
            );
          }
          return null;
        })}

        {/* Action buttons: Copy | Rewrite | Edit */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "18px" }}>
          {[
            { type: "copy", label: "Copy" },
            { type: "rewrite", label: "Rewrite" },
            { type: "edit", label: "Edit" },
          ].map((btn) => (
            <button key={btn.label} style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px", color: "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: 500,
              padding: "5px 10px", cursor: "pointer", transition: "all 200ms", fontFamily: "inherit",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
            >
              <Icon type={btn.type} size={12} color="currentColor" />
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ── MAIN RENDER ──
  return (
    <div style={{
      display: "flex", height: "100vh", background: "#0a0a0f",
      fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: "hidden",
    }}>

      {/* Sidebar */}
      {sidebarOpen && <Sidebar />}

      {/* Right panel: header + chat + input */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        <HeaderBar />

        {/* Chat scroll area */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "0 clamp(24px, 8vw, 120px)",
          display: "flex", flexDirection: "column",
        }}>
          {/* Divider line under user question */}
          {messages.map((msg, i) => (
            <div key={msg.id}>
              {renderMessage(msg)}
              {/* thin separator after user message before AI reply */}
              {msg.role === "user" && i < messages.length - 1 && (
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", margin: "4px 0 8px" }} />
              )}
            </div>
          ))}

          {/* Streaming placeholder */}
          {isStreaming && (
            <div style={{ paddingBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "12px" }}>
                <span style={{ color: "#3b82f6", fontSize: "14px", fontWeight: 600 }}>CampusAI</span>
                <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "11.5px" }}>thinking...</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>
                Searching knowledge base<StreamingCursor />
              </p>
            </div>
          )}

          <div ref={chatEndRef} style={{ height: "8px" }} />
        </div>

        {/* ── INPUT BAR ── */}
        <div style={{
          padding: "12px clamp(24px, 8vw, 120px) 20px",
          background: "#0a0a0f",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px", padding: "10px 14px",
            transition: "border-color 200ms",
          }}
            onFocus={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"}
            onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            {/* Paperclip */}
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center", transition: "opacity 200ms" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0.4"}
            >
              <Icon type="paperclip" size={18} color="rgba(255,255,255,0.4)" />
            </button>

            {/* Text input */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask anything about your college..."
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "rgba(255,255,255,0.85)", fontSize: "14px", fontFamily: "inherit",
                caretColor: "#3b82f6", minWidth: 0,
              }}
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              style={{
                background: input.trim() ? "#3b82f6" : "rgba(255,255,255,0.08)",
                border: "none", borderRadius: "8px", width: "36px", height: "36px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: input.trim() ? "pointer" : "default", transition: "all 200ms",
              }}
              onMouseEnter={e => { if (input.trim()) e.currentTarget.style.background = "#5a9cf5"; }}
              onMouseLeave={e => { e.currentTarget.style.background = input.trim() ? "#3b82f6" : "rgba(255,255,255,0.08)"; }}
            >
              <Icon type="arrowUp" size={16} color={input.trim() ? "#fff" : "rgba(255,255,255,0.35)"} />
            </button>
          </div>
        </div>
      </div>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        input::placeholder { color: rgba(255,255,255,0.32); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @media (max-width: 767px) {
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
