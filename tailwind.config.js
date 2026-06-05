/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#ffffff",       // White background
        panel: "#f8fafc",     // Slightly grayish panel (slate-50)
        edge: "#e2e8f0",      // Slate 200 borders
        amber: {
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          glow: "#fbbf24"
        },
        cyan: {
          50: "#ecfeff",
          300: "#67e8f9",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75"
        },
        emerald: {
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981"
        },
        rose: {
          300: "#fda4af",
          500: "#f43f5e"
        },
        cy: "#22d3ee"
      },
      fontFamily: {
        display: ["'Chakra Petch'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"]
      }
    }
  },
  plugins: []
}
