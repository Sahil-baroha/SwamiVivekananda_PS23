/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Purple palette
                'purple-primary': '#7c3aed',
                'purple-dark': '#6d28d9',
                'purple-light': '#8b5cf6',
                'purple-lighter': '#a78bfa',

                // Blue accents
                'blue-accent': '#3b82f6',
                'blue-light': '#5a9cf5',

                // Dark backgrounds
                'bg-darkest': '#05050a',
                'bg-darker': '#0a0a0f',
                'bg-dark': '#0f0f14',
                'bg-panel': '#1a1625',
            },
            fontFamily: {
                'sans': ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
                'inter': ['Inter', 'sans-serif'],
            },
            backdropBlur: {
                'xs': '2px',
            },
            boxShadow: {
                'purple': '0 4px 14px rgba(124, 58, 237, 0.3)',
                'purple-lg': '0 4px 20px rgba(124, 58, 237, 0.45)',
                'blue': '0 0 18px rgba(59, 130, 246, 0.35)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(15px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(25px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
