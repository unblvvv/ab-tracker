/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#6248ff',
					light: '#8b73ff',
					dark: '#4a35cc',
				},
				secondary: {
					DEFAULT: '#48bdff',
					light: '#70ccff',
					dark: '#2a9edb',
				},
				accent: {
					DEFAULT: '#ff48ed',
					light: '#ff70f2',
					dark: '#db2ac9',
				},
				success: '#48ff48',
				warning: '#ffed48',
				error: '#ff4848',
				team: {
					blue: '#48bdff',
					red: '#ff4848',
				},
				bg: {
					primary: '#121212',
					secondary: '#1a1a1a',
					tertiary: '#252525',
					elevated: '#2c2c2c',
				},
				surface: {
					DEFAULT: 'rgba(30, 30, 30, 0.95)',
					hover: 'rgba(40, 40, 40, 0.95)',
				},
				text: {
					primary: '#ffffff',
					secondary: '#d5d5d5',
					tertiary: '#a0a0a0',
					disabled: '#666666',
				},
				border: {
					DEFAULT: 'rgba(255, 255, 255, 0.1)',
					hover: 'rgba(255, 255, 255, 0.2)',
					focus: 'rgba(98, 72, 255, 0.5)',
				},
			},
			fontFamily: {
				sans: [
					'Plus Jakarta Sans',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Oxygen',
					'Ubuntu',
					'Cantarell',
					'Fira Sans',
					'Droid Sans',
					'Helvetica Neue',
					'sans-serif',
				],
				mono: ['Roboto Mono', 'Courier New', 'monospace'],
			},
			spacing: {
				xs: '4px',
				sm: '8px',
				md: '12px',
				lg: '16px',
				xl: '24px',
				'2xl': '32px',
				'3xl': '48px',
			},
			borderRadius: {
				sm: '4px',
				md: '6px',
				lg: '8px',
				xl: '12px',
				'2xl': '16px',
			},
			boxShadow: {
				sm: '0 2px 4px rgba(0, 0, 0, 0.2)',
				md: '0 4px 8px rgba(0, 0, 0, 0.3)',
				lg: '0 8px 16px rgba(0, 0, 0, 0.4)',
				xl: '0 16px 32px rgba(0, 0, 0, 0.5)',
				glow: '0 0 20px rgba(98, 72, 255, 0.3)',
				'glow-blue': '0 0 20px rgba(72, 189, 255, 0.3)',
				'glow-red': '0 0 20px rgba(255, 72, 72, 0.3)',
			},
			animation: {
				'fade-in': 'fadeIn 0.3s ease-out',
				'fade-out': 'fadeOut 0.3s ease-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'slide-down': 'slideDown 0.3s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				spin: 'spin 1s linear infinite',
				pulse: 'pulse 2s ease-in-out infinite',
				'gradient-shift': 'gradientShift 15s ease-in-out infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				fadeOut: {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideDown: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				gradientShift: {
					'0%, 100%': {
						transform: 'translate(0, 0) scale(1)',
						opacity: '0.6',
					},
					'33%': {
						transform: 'translate(-10%, 5%) scale(1.1)',
						opacity: '0.5',
					},
					'66%': {
						transform: 'translate(10%, -5%) scale(0.9)',
						opacity: '0.7',
					},
				},
			},
			transitionDuration: {
				fast: '100ms',
				base: '200ms',
				slow: '300ms',
			},
		},
	},
	plugins: [],
}
