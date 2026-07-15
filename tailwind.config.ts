import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        water: "var(--water)",
        land: "var(--land)",
        ink: {
          DEFAULT: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        pastel: {
          yellow: "var(--yellow)",
          coral: "var(--coral)",
          green: "var(--green)",
          blue: "var(--blue)",
          lavender: "var(--lavender)",
          orange: "var(--orange)",
        },
        danger: "var(--danger)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(52,51,47,0.04), 0 4px 16px rgba(52,51,47,0.06)",
        pop: "0 4px 10px rgba(52,51,47,0.08), 0 12px 32px rgba(52,51,47,0.12)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "dash": {
          to: { "stroke-dashoffset": "-24" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.25s cubic-bezier(0.22,1,0.36,1)",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.22,1,0.36,1)",
        "spin-slow": "spin-slow 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
