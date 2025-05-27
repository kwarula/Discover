import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sohne': ['Inter', 'system-ui', 'sans-serif'], // Using Inter as Söhne alternative
				'inter': ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				// Diani Brand Palette
				'diani-teal': {
					50: '#E0F4F4',
					100: '#B3E0E0',
					500: '#0A7A7B',
					700: '#075C5D',
					900: '#043D3E',
				},
				'coral-sunset': {
					50: '#FFF3ED',
					100: '#FFD6C4',
					500: '#FF8C6B',
					700: '#CC6E55',
					900: '#995240',
				},
				'diani-sand': {
					50: '#F9F9F9',
					100: '#F2F2F2',
					200: '#E5E5E5',
					300: '#CCCCCC',
					400: '#B3B3B3',
					500: '#999999',
					600: '#7A7A7A',
					700: '#5C5C5C',
					800: '#3D3D3D',
					900: '#1F1F1F',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%) scale(0.95)', opacity: '0' },
					'100%': { transform: 'translateX(0) scale(1)', opacity: '1' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%) scale(0.95)', opacity: '0' },
					'100%': { transform: 'translateX(0) scale(1)', opacity: '1' }
				},
				'typing': {
					'0%, 60%': { opacity: '0' },
					'30%': { opacity: '1' },
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.25s cubic-bezier(0.2, 0.8, 0.4, 1.2)',
				'slide-in-left': 'slide-in-left 0.25s cubic-bezier(0.2, 0.8, 0.4, 1.2)',
				'typing': 'typing 1.2s infinite',
				'scale-in': 'scale-in 0.3s ease-out',
			},
			spacing: {
				'18': '4.5rem',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
