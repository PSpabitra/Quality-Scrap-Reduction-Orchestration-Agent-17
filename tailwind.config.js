/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#f8fafc",
        panel: "#ffffff",
        edge: "#e2e8f0",
        white: "#0f172a",
        amber: {
          300: "#b45309",
          400: "#92400e",
          500: "#f59e0b",
          glow: "#c2410c"
        },
        cyan: {
          50: "#164e63",
          300: "#0e7490",
          500: "#06b6d4",
          600: "#0891b2"
        },
        emerald: {
          300: "#047857",
          400: "#065f46",
          500: "#10b981"
        },
        rose: {
          300: "#be123c",
          500: "#f43f5e"
        },
        cy: "#0284c7",
        slate: {
          100: "#0f172a",
          200: "#1e293b",
          300: "#334155",
          400: "#475569",
          500: "#64748b",
          600: "#94a3b8",
          700: "#cbd5e1",
          800: "#e2e8f0",
          900: "#f1f5f9"
        }
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
