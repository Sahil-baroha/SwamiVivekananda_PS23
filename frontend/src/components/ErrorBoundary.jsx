import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--midnight)] text-white font-mono">
                    <div className="card max-w-md p-8 border border-red-500/50 bg-[var(--deep-space)] rounded-lg shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <h2 className="text-2xl font-bold text-red-400 mb-4 font-orbitron">
                            ⚠️ System Malfunction
                        </h2>
                        <p className="text-gray-400 mb-6">
                            The application encountered a critical error.
                            <br />
                            <span className="text-xs text-red-300/50 mt-2 block font-mono">
                                {this.state.error && this.state.error.toString()}
                            </span>
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded transition-all duration-300 font-bold uppercase tracking-wider"
                        >
                            Reboot System
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
