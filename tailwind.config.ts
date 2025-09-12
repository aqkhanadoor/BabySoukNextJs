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
			padding: "1rem",
			screens: {
				"2xl": "1280px",
			},
		},
		extend: {
			fontFamily: {
				sans: ['"Fredoka One"', 'sans-serif'],
			},
			colors: {
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
				'baby-pink': 'hsl(var(--baby-pink))',
				'baby-blue': 'hsl(var(--baby-blue))',
				'baby-yellow': 'hsl(var(--baby-yellow))',
				'baby-green': 'hsl(var(--baby-green))',
				'baby-purple': 'hsl(var(--baby-purple))',
				'baby-orange': 'hsl(var(--baby-orange))',
				'playful-primary': 'hsl(var(--playful-primary))',
				'playful-secondary': 'hsl(var(--playful-secondary))',
				'playful-accent': 'hsl(var(--playful-accent))',
				'playful-background': 'hsl(var(--playful-background))',
				'playful-foreground': 'hsl(var(--playful-foreground))',
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
				sm: 'calc(var(--radius) - 4px)',
				'2xl': 'calc(var(--radius) + 4px)',
				'3xl': 'calc(var(--radius) + 8px)',
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
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' },
				},
				'slide-in-from-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
				},
				'jump': {
					'0%, 50%, 100%': { transform: 'translateY(0)' },
					'25%': { transform: 'translateY(-15px)' },
					'75%': { transform: 'translateY(-10px)' },
				},
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-slower': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
			},
			backgroundImage: {
				'gradient-rainbow': 'var(--gradient-rainbow)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)',
			},
			boxShadow: {
				'playful': 'var(--shadow-playful)',
				'card': 'var(--shadow-card)',
				'button': 'var(--shadow-button)',
				'2d': '5px 5px 0px 0px rgba(0,0,0,1)',
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-gentle': 'bounce 2s infinite',
				'pulse-soft': 'pulse 3s ease-in-out infinite',
				'wiggle': 'wiggle 1s ease-in-out infinite',
				'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'shake': 'shake 0.5s ease-in-out',
				'jump': 'jump 0.7s ease-in-out',
        'bounce-slow': 'bounce-slow 2s infinite',
        'fade-in': 'fade-in 1s ease-in-out',
        'slide-in-left': 'slide-in-left 1s ease-in-out',
        'slide-in-right': 'slide-in-right 1s ease-in-out',
        'spin-slow': 'spin-slow 3s linear infinite',
        'spin-slower': 'spin-slower 5s linear infinite',
	
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
