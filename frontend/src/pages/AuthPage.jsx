import { useState } from 'react';
import { Brain, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthPage({ onAuthSuccess }) {
    const [mode, setMode] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
    });

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulate API call
        setTimeout(() => {
            if (formData.email && formData.password) {
                onAuthSuccess?.({
                    user: formData.email,
                    mode
                });
            } else {
                setError('Please fill in all fields');
                setLoading(false);
            }
        }, 1000);
    };

    const isLogin = mode === 'login';

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated grid background */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px',
                        animation: 'gridMove 20s linear infinite',
                    }}
                />
            </div>

            {/* Floating orbs */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-electric-blue rounded-full filter blur-[120px] opacity-20 animate-pulse" />
            <div className="fixed bottom-20 right-10 w-80 h-80 bg-neon-magenta rounded-full filter blur-[120px] opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Main auth container */}
            <div className="relative z-10 w-full max-w-md fade-in">
                {/* Logo header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <Brain size={48} className="text-cyan-400" />
                        <h1 className="text-5xl font-orbitron">DrishtiAI</h1>
                    </div>
                    <p className="text-gray-400 flex items-center justify-center gap-2">
                        <Sparkles size={16} className="text-yellow-400" />
                        Smart Document Intelligence
                    </p>
                </div>

                {/* Auth card */}
                <div className="card">
                    {/* Mode toggle */}
                    <div className="flex gap-2 p-1 bg-midnight/60 rounded-lg border border-cyan-400/20 mb-6">
                        <button
                            onClick={() => setMode('login')}
                            className={`
                flex-1 py-2.5 rounded-md font-semibold text-sm transition-all duration-300
                ${isLogin
                                    ? 'bg-gradient-neon text-white shadow-lg shadow-cyan-400/30'
                                    : 'text-gray-400 hover:text-gray-300'
                                }
              `}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`
                flex-1 py-2.5 rounded-md font-semibold text-sm transition-all duration-300
                ${!isLogin
                                    ? 'bg-gradient-neon text-white shadow-lg shadow-cyan-400/30'
                                    : 'text-gray-400 hover:text-gray-300'
                                }
              `}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="slide-up">
                                <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange('username')}
                                    placeholder="Choose a username"
                                    className="w-full"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className={!isLogin ? 'slide-up' : ''} style={{ animationDelay: '0.1s' }}>
                            <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                placeholder="your@email.com"
                                className="w-full"
                                required
                            />
                        </div>

                        <div className={!isLogin ? 'slide-up' : ''} style={{ animationDelay: '0.2s' }}>
                            <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange('password')}
                                    placeholder="••••••••"
                                    className="w-full pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex justify-end">
                                <a
                                    href="#"
                                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full flex items-center justify-center gap-2 group mt-6"
                        >
                            {loading ? (
                                <div className="loading-small"></div>
                            ) : (
                                <>
                                    {isLogin ? 'Log In' : 'Create Account'}
                                    <ArrowRight
                                        size={18}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer text */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        {isLogin ? (
                            <p>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => setMode('signup')}
                                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                                >
                                    Sign up
                                </button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{' '}
                                <button
                                    onClick={() => setMode('login')}
                                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                                >
                                    Log in
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                {/* Terms footer */}
                <p className="text-center text-xs text-gray-600 mt-6">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300">
                        Privacy Policy
                    </a>
                </p>
            </div>

            <style>{`
        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }

        .loading-small {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(0, 240, 255, 0.3);
          border-top-color: var(--neon-cyan);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
        </div>
    );
}
