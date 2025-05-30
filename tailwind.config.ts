import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0066CC", // UMT Blue
          foreground: "#FFFFFF",
          50: "#E5F4FF",
          100: "#CCE6FF",
          500: "#0066CC",
          600: "#005BB5",
          700: "#004D99",
        },
        secondary: {
          DEFAULT: "#CCE6FF", // Light blue
          foreground: "#1F2937",
        },
        destructive: {
          DEFAULT: "#EF4444", // Red
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F9FAFB", // Very light gray
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#F9FAFB",
          foreground: "#1F2937",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2937",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2937",
        },
        success: {
          DEFAULT: "#10B981", // Emerald green
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B", // Amber yellow
          foreground: "#FFFFFF",
        },
        chat: {
          received: "#E5F4FF", // Light blue for received messages
          sent: "#D1FAE5", // Light green for sent messages
        },
        notification: {
          DEFAULT: "#FFF7ED", // Light orange
          accent: "#F97316", // Orange
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
