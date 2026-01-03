/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#5e6ad2",
					light: "#7a84dd",
					dark: "#4a56b8",
				},
				accent: {
					DEFAULT: "#5e6ad2",
					glow: "rgba(94, 106, 210, 0.4)",
				},
				bg: {
					body: "#050505",
					primary: "#050505",
					secondary: "#0d0d0d",
					elevated: "rgba(15, 15, 15, 0.6)",
					surface: "rgba(255, 255, 255, 0.02)",
					"surface-hover": "rgba(255, 255, 255, 0.05)",
				},
				text: {
					primary: "#f7f8f8",
					secondary: "#8a8f98",
					tertiary: "#585c64",
				},
				border: {
					DEFAULT: "rgba(255, 255, 255, 0.08)",
					light: "rgba(255, 255, 255, 0.12)",
					focus: "rgba(94, 106, 210, 0.5)",
				},
				team: {
					blue: "#3b82f6",
					red: "#ef4444",
				},
			},
			fontFamily: {
				sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
				mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
			},
			spacing: {
				xs: "4px",
				sm: "8px",
				md: "12px",
				lg: "16px",
				xl: "24px",
				"2xl": "32px",
				"3xl": "48px",
			},
			borderRadius: {
				sm: "4px",
				md: "6px",
				lg: "8px",
				xl: "12px",
				"2xl": "16px",
				full: "9999px",
			},
			boxShadow: {
				sm: "0 2px 8px rgba(0, 0, 0, 0.3)",
				md: "0 4px 16px rgba(0, 0, 0, 0.4)",
				lg: "0 8px 24px rgba(0, 0, 0, 0.5)",
				xl: "0 20px 50px rgba(0, 0, 0, 0.6)",
				glow: "0 0 20px rgba(94, 106, 210, 0.3)",
				"glow-blue": "0 0 20px rgba(59, 130, 246, 0.3)",
				"glow-red": "0 0 20px rgba(239, 68, 68, 0.3)",
			},
			backdropBlur: {
				glass: "10px",
				strong: "16px",
			},
			animation: {
				"fade-in": "fadeIn 0.3s ease-out",
				"slide-up": "slideUp 0.3s ease-out",
				"slide-down": "slideDown 0.3s ease-out",
				float: "float 20s infinite ease-in-out alternate",
				pulse: "pulse 2s ease-in-out infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { transform: "translateY(10px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				slideDown: {
					"0%": { transform: "translateY(-10px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				float: {
					"0%": { transform: "translate(0, 0) scale(1)" },
					"33%": { transform: "translate(30px, -50px) scale(1.1)" },
					"66%": { transform: "translate(-20px, 20px) scale(0.9)" },
					"100%": { transform: "translate(0, 0) scale(1)" },
				},
				pulse: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.5" },
				},
			},
			transitionDuration: {
				fast: "100ms",
				base: "200ms",
				slow: "300ms",
			},
		},
	},
	plugins: [],
};
