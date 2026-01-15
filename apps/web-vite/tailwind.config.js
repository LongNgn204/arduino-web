/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // ArduinoHub New Brand Colors (Pastel/Light Theme)
                arduino: {
                    base: '#F5F7FA', // Off-white background
                    surface: '#FFFFFF', // White surface
                    teal: '#00979D', // Primary Brand Color (unchanged)
                    mint: '#D1E8E2', // Pastel Mint (Accent)
                    coral: '#FFB7B2', // Pastel Coral (Accent)
                    yellow: '#FFDAC1', // Pastel Yellow (Accent)
                    light: '#F0FDFA', // Very light teal/white for text on dark bg
                    text: {
                        primary: '#2D3748', // Dark Gray for headings
                        secondary: '#718096', // Medium Gray for body
                        muted: '#A0AEC0', // Light Gray for disabled/placeholders
                    }
                },
            },
            fontFamily: {
                sans: ['Poppins', 'Quicksand', 'Inter', 'system-ui', 'sans-serif'], // New rounded fonts
                mono: ['JetBrains Mono', 'Consolas', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
                'card': '0 10px 30px rgba(0, 0, 0, 0.04)',
                'hover': '0 20px 40px rgba(0, 0, 0, 0.08)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(0, 151, 157, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(0, 151, 157, 0.8), 0 0 30px rgba(0, 151, 157, 0.4)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
                },
            },
        },
    },
    plugins: [],
}
