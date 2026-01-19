/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Ryn Village Brand - "Premium Property" Palette
                primary: {
                    DEFAULT: '#CFAF80', // Gold/Bronze accent
                    dark: '#B8965A',
                    light: '#E5D4B5',
                },
                secondary: {
                    DEFAULT: '#4B798E', // Teal/Navy blue
                    dark: '#3A5F70',
                    light: '#6A9BB0',
                },
                background: {
                    DEFAULT: '#FFFFFF',
                    dark: '#0F172A', // Slate-900
                    cream: '#FDF8F3',
                },
                text: {
                    DEFAULT: '#1E293B', // Slate-800
                    muted: '#64748B',   // Slate-500
                    light: '#F8FAFC',   // Slate-50
                },
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Montserrat', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'slide-up': 'slideUp 0.6s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
