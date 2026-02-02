import { useState } from 'react';
import Upload from './components/Upload.jsx';
import ModeSelector from './components/ModeSelector.jsx';
import SummaryOutput from './components/SummaryOutput.jsx';
import AuthPage from './pages/AuthPage.jsx';
import { Brain, Sparkles, LogOut } from 'lucide-react';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [documentData, setDocumentData] = useState(null);
    const [sessionId, setSessionId] = useState(null);  // NEW: Track session ID
    const [selectedMode, setSelectedMode] = useState('executive');
    const [query, setQuery] = useState('');
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [coherence, setCoherence] = useState(null);

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
            setSessionId(data.sessionId);  // Save session ID
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

            // Add session ID header if available
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

    // Show auth page if not authenticated
    if (!isAuthenticated) {
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
    }

    // Main app (authenticated)
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with user info */}
                <header className="text-center mb-12 fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Brain size={64} className="text-cyan-400" />
                            <div className="text-left">
                                <h1 className="text-6xl">DrishtiAI</h1>
                                <p className="text-sm text-gray-400">Logged in as {user}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary flex items-center gap-2"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                    <p className="text-xl text-gray-400 flex items-center justify-center gap-2">
                        <Sparkles size={20} className="text-yellow-400" />
                        Smart Document Summarizer
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Advanced AI-powered document analysis with multiple summarization strategies
                    </p>
                </header>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Upload Section */}
                    <Upload onUploadSuccess={handleUploadSuccess} />

                    {/* Document Info */}
                    {documentData && (
                        <div className="card fade-in">
                            <h3 className="text-lg font-bold mb-4 text-cyan-400">Document Info</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Title</p>
                                    <p className="font-semibold">{documentData.metadata.title}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Pages</p>
                                    <p className="font-semibold">{documentData.metadata.page_count}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Token Count</p>
                                    <p className="font-semibold">{documentData.token_count.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Chunks</p>
                                    <p className="font-semibold">{documentData.chunk_count}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mode Selector */}
                    {documentData && (
                        <ModeSelector
                            selectedMode={selectedMode}
                            onModeSelect={setSelectedMode}
                            query={query}
                            onQueryChange={setQuery}
                        />
                    )}

                    {/* Generate Button */}
                    {documentData && !loading && !summary && (
                        <div className="text-center slide-up">
                            <button
                                onClick={handleGenerateSummary}
                                className="btn btn-primary text-lg px-12 py-4"
                            >
                                Generate Summary
                            </button>
                        </div>
                    )}

                    {/* Summary Output */}
                    <SummaryOutput
                        summary={summary}
                        loading={loading}
                        error={error}
                        onRegenerate={handleGenerateSummary}
                        coherence={coherence}
                    />
                </div>

                {/* Footer */}
                <footer className="text-center mt-16 text-gray-600 text-sm">
                    <p>Powered by GPT-4o-mini • LangChain • Sentence Transformers</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
