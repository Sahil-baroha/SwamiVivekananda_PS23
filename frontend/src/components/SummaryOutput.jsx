import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function SummaryOutput({ summary, loading, error, onRegenerate, coherence }) {
    if (loading) {
        return (
            <div className="card slide-up">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="loading"></div>
                    <p className="mt-6 text-lg text-gray-400">Generating your summary...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card slide-up border-2 border-red-500/50">
                <div className="flex items-start gap-4">
                    <AlertCircle className="text-red-400 flex-shrink-0" size={32} />
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-red-400 mb-2">Error</h3>
                        <p className="text-gray-300">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!summary) {
        return null;
    }

    const renderSummary = () => {
        // Handle section-wise format (array of sections)
        if (Array.isArray(summary)) {
            return (
                <div className="space-y-6">
                    {summary.map((section, idx) => (
                        <div key={idx} className="border-l-4 border-cyan-400 pl-6 py-2">
                            <h3 className="text-xl font-bold text-cyan-400 mb-2">
                                {section.heading}
                            </h3>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {section.summary}
                            </p>
                        </div>
                    ))}
                </div>
            );
        }

        // Handle regular string summary
        return (
            <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                    {summary}
                </p>
            </div>
        );
    };

    return (
        <div className="card slide-up">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <CheckCircle2 className="text-cyan-400" size={32} />
                    Summary Result
                </h2>
                <button
                    onClick={onRegenerate}
                    className="btn btn-secondary flex items-center gap-2"
                >
                    <RefreshCw size={18} />
                    Regenerate
                </button>
            </div>

            {renderSummary()}

            {coherence && (
                <div className="mt-6 p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                        Coherence Analysis
                    </h4>
                    <div className="text-sm text-gray-400 space-y-1">
                        <p>
                            <span className="font-semibold">Score:</span> {coherence.coherence_score}
                        </p>
                        <p>
                            <span className="font-semibold">Status:</span>{' '}
                            {coherence.is_coherent ? '✓ Coherent' : '✗ Issues detected'}
                        </p>
                        {coherence.flagged && (
                            <p className="text-yellow-400">
                                ⚠ {coherence.redundant_pairs.length} redundant pairs detected
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
