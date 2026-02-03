import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ChatDashboard from './pages/ChatDashboard.jsx';

// ═══════════════════════════════════════════════════════════
// PROTECTED ROUTE WRAPPER
// ═══════════════════════════════════════════════════════════
function ProtectedRoute({ isAuthenticated, children }) {
    return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

// ═══════════════════════════════════════════════════════════
// LANDING PAGE WRAPPER (with navigation)
// ═══════════════════════════════════════════════════════════
function LandingPageWrapper() {
    const navigate = useNavigate();
    return <LandingPage onNavigateToAuth={() => navigate('/auth')} />;
}

// ═══════════════════════════════════════════════════════════
// AUTH PAGE WRAPPER (with navigation)
// ═══════════════════════════════════════════════════════════
function AuthPageWrapper({ onAuthSuccess }) {
    const navigate = useNavigate();

    const handleAuthSuccess = (authData) => {
        onAuthSuccess(authData);
        navigate('/dashboard');
    };

    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
}

// ═══════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════
function App() {
    // ═══ EXISTING STATE - DO NOT MODIFY ═══
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [documentData, setDocumentData] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [selectedMode, setSelectedMode] = useState('executive');
    const [query, setQuery] = useState('');
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [coherence, setCoherence] = useState(null);

    // ═══ EXISTING HANDLERS - DO NOT MODIFY ═══
    const handleAuthSuccess = (authData) => {
        setIsAuthenticated(true);
        setUser(authData.user);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setDocumentData(null);
        setSummary(null);
    };

    const handleUploadSuccess = (data) => {
        setDocumentData(data);
        if (data.sessionId) {
            setSessionId(data.sessionId);
        }
        setSummary(null);
        setError(null);
    };

    const handleGenerateSummary = async () => {
        if (!documentData) return;

        setLoading(true);
        setError(null);
        setSummary(null);

        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (sessionId) {
                headers['X-Session-ID'] = sessionId;
            }

            const response = await fetch('http://localhost:8000/summarize', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    mode: selectedMode,
                    query: selectedMode === 'query_focused' ? query : null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Summarization failed');
            }

            const data = await response.json();
            setSummary(data.summary);
            setCoherence(data.coherence);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPageWrapper />} />

                {/* Auth Page */}
                <Route
                    path="/auth"
                    element={<AuthPageWrapper onAuthSuccess={handleAuthSuccess} />}
                />

                {/* Dashboard (Protected) */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <ChatDashboard
                                user={user}
                                onLogout={handleLogout}
                                documentData={documentData}
                                onUploadSuccess={handleUploadSuccess}
                                selectedMode={selectedMode}
                                onModeSelect={setSelectedMode}
                                query={query}
                                onQueryChange={setQuery}
                                summary={summary}
                                loading={loading}
                                error={error}
                                onGenerateSummary={handleGenerateSummary}
                                coherence={coherence}
                            />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect any unknown routes to landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
