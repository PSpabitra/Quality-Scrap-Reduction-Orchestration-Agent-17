/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1220",
        panel: "#111a2e",
        edge: "#1e2a44",
        amber: { glow: "#fbbf24" },
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
