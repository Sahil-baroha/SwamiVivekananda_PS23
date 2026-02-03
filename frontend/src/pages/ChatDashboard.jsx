import { useState, useRef, useEffect } from "react";
import Upload from '../components/Upload.jsx';
import ModeSelector from '../components/ModeSelector.jsx';

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
        logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
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
export default function ChatDashboard({
    user,
    onLogout,
    // Existing props from App.jsx
    documentData,
    onUploadSuccess,
    selectedMode,
    onModeSelect,
    query,
    onQueryChange,
    summary,
    loading,
    error,
    onGenerateSummary,
    coherence,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(!documentData);
    const [showModeSelector, setShowModeSelector] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [summary]);

    // Show mode selector after document upload
    useEffect(() => {
        if (documentData && !summary) {
            setShowModeSelector(true);
        }
    }, [documentData, summary]);

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
                    DrishtiAI
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
                        type="text" placeholder="search..."
                        style={{
                            background: "none", border: "none", outline: "none", flex: 1,
                            color: "rgba(255,255,255,0.55)", fontSize: "13px", fontFamily: "inherit",
                        }}
                    />
                </div>
            </div>

            {/* Create chat button */}
            <div style={{ padding: "0 12px", marginBottom: "18px" }}>
                <button
                    onClick={() => setShowUploadModal(true)}
                    style={{
                        width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px", color: "rgba(255,255,255,0.8)", fontSize: "13.5px", fontWeight: 500,
                        padding: "9px 0", cursor: "pointer", transition: "all 200ms ease", fontFamily: "inherit",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.11)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                >
                    New Document
                </button>
            </div>

            {/* History label */}
            <div style={{ padding: "0 16px", marginBottom: "10px" }}>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    History
                </span>
            </div>

            {/* Current document */}
            {documentData && (
                <div style={{ padding: "0 8px" }}>
                    <button
                        style={{
                            width: "100%", textAlign: "left", background: "rgba(255,255,255,0.08)",
                            border: "none", borderRadius: "7px", padding: "9px 12px", cursor: "pointer",
                            marginBottom: "2px", transition: "background 200ms ease", display: "flex", alignItems: "flex-start", gap: "9px",
                            fontFamily: "inherit",
                        }}
                    >
                        <Icon type="compose" size={14} color="rgba(255,255,255,0.3)" style={{ marginTop: "1px", flexShrink: 0 }} />
                        <span style={{ color: "rgba(255,255,255,0.88)", fontSize: "13px", lineHeight: 1.45, fontWeight: 400 }}>
                            {documentData.metadata.title}
                        </span>
                    </button>
                </div>
            )}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Logout button */}
            <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <button
                    onClick={onLogout}
                    style={{
                        width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "7px", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 500,
                        padding: "8px 12px", cursor: "pointer", transition: "all 200ms", fontFamily: "inherit",
                        display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                    <Icon type="logout" size={14} color="currentColor" />
                    Logout
                </button>
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

                {/* User info */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px", padding: "6px 12px",
                }}>
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "13.5px", fontWeight: 500 }}>
                        {user}
                    </span>
                </div>
            </div>

            {/* Right: Settings + Compose */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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

    // ── RENDER ──
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

                    {/* Upload Modal */}
                    {showUploadModal && (
                        <div style={{
                            position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100,
                            display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
                        }}
                            onClick={() => setShowUploadModal(false)}
                        >
                            <div style={{
                                background: "#1a1625", borderRadius: "16px", padding: "32px",
                                maxWidth: "600px", width: "100%", border: "1px solid rgba(255,255,255,0.1)",
                            }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 600, margin: 0 }}>Upload Document</h2>
                                    <button
                                        onClick={() => setShowUploadModal(false)}
                                        style={{
                                            background: "none", border: "none", color: "rgba(255,255,255,0.5)",
                                            cursor: "pointer", fontSize: "24px", padding: "4px 8px",
                                        }}
                                    >×</button>
                                </div>
                                <Upload onUploadSuccess={(data) => {
                                    onUploadSuccess(data);
                                    setShowUploadModal(false);
                                }} />
                            </div>
                        </div>
                    )}

                    {/* Mode Selector Modal */}
                    {showModeSelector && documentData && !summary && (
                        <div style={{
                            position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100,
                            display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
                        }}
                            onClick={() => setShowModeSelector(false)}
                        >
                            <div style={{
                                background: "#1a1625", borderRadius: "16px", padding: "32px",
                                maxWidth: "900px", width: "100%", border: "1px solid rgba(255,255,255,0.1)",
                                maxHeight: "80vh", overflowY: "auto",
                            }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 600, margin: 0 }}>Select Summary Mode</h2>
                                    <button
                                        onClick={() => setShowModeSelector(false)}
                                        style={{
                                            background: "none", border: "none", color: "rgba(255,255,255,0.5)",
                                            cursor: "pointer", fontSize: "24px", padding: "4px 8px",
                                        }}
                                    >×</button>
                                </div>
                                <ModeSelector
                                    selectedMode={selectedMode}
                                    onModeSelect={onModeSelect}
                                    query={query}
                                    onQueryChange={onQueryChange}
                                />
                                <button
                                    onClick={() => {
                                        onGenerateSummary();
                                        setShowModeSelector(false);
                                    }}
                                    disabled={loading}
                                    style={{
                                        marginTop: "24px",
                                        width: "100%",
                                        background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                                        border: "none",
                                        borderRadius: "10px",
                                        color: "#ffffff",
                                        fontSize: "15px",
                                        fontWeight: 600,
                                        padding: "13px 0",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        fontFamily: "inherit",
                                        transition: "all 200ms ease",
                                        boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
                                        opacity: loading ? 0.7 : 1,
                                    }}
                                >
                                    {loading ? "Generating..." : "Generate Summary"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Document Info */}
                    {documentData && (
                        <div style={{ paddingTop: "24px", paddingBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "10px" }}>
                                <span style={{ color: "rgba(255,255,255,0.88)", fontSize: "14px", fontWeight: 600 }}>Document Uploaded</span>
                            </div>
                            <div style={{
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "10px", padding: "16px",
                            }}>
                                <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 600, margin: "0 0 12px 0" }}>
                                    {documentData.metadata.title}
                                </h3>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px", fontSize: "13px" }}>
                                    <div>
                                        <span style={{ color: "rgba(255,255,255,0.4)" }}>Pages: </span>
                                        <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{documentData.metadata.page_count}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: "rgba(255,255,255,0.4)" }}>Tokens: </span>
                                        <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{documentData.token_count.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: "rgba(255,255,255,0.4)" }}>Chunks: </span>
                                        <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{documentData.chunk_count}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModeSelector(true)}
                                    style={{
                                        marginTop: "12px",
                                        background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
                                        borderRadius: "7px", color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: 500,
                                        padding: "6px 14px", cursor: "pointer", transition: "all 200ms", fontFamily: "inherit",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                                >
                                    {summary ? "Change Mode" : "Select Summary Mode"}
                                </button>
                            </div>
                            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", margin: "16px 0" }} />
                        </div>
                    )}

                    {/* Summary Display */}
                    {summary && (
                        <div style={{ paddingBottom: "8px" }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px" }}>
                                <span style={{ color: "#3b82f6", fontSize: "14px", fontWeight: 600 }}>DrishtiAI</span>
                                {coherence && (
                                    <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "11.5px", fontWeight: 400 }}>
                                        coherence: {coherence.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            <div style={{
                                color: "rgba(255,255,255,0.72)", fontSize: "14px", lineHeight: 1.7,
                                whiteSpace: "pre-wrap",
                            }}>
                                {summary}
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "18px" }}>
                                {[
                                    { type: "copy", label: "Copy" },
                                    { type: "rewrite", label: "Regenerate" },
                                    { type: "export", label: "Export" },
                                ].map((btn) => (
                                    <button
                                        key={btn.label}
                                        onClick={btn.label === "Regenerate" ? onGenerateSummary : undefined}
                                        style={{
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
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div style={{ paddingBottom: "8px" }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "12px" }}>
                                <span style={{ color: "#3b82f6", fontSize: "14px", fontWeight: 600 }}>DrishtiAI</span>
                                <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "11.5px" }}>generating summary...</span>
                            </div>
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>
                                Analyzing document<StreamingCursor />
                            </p>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div style={{
                            padding: "12px 16px",
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "8px",
                            color: "#fca5a5",
                            fontSize: "13px",
                            marginTop: "12px",
                        }}>
                            {error}
                        </div>
                    )}

                    <div ref={chatEndRef} style={{ height: "8px" }} />
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
