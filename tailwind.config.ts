import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5F1E8",
        surface: "#FFFDF7",
        water: "#C8E4EA",
        land: "#EAE4D8",
        "text-primary": "#34332F",
        "text-secondary": "#77736A",
        pastel: {
          yellow: "#F4C95D",
          coral: "#EF8E7D",
          green: "#8CC7A1",
          blue: "#78AFC8",
          lavender: "#B8A7D9",
          orange: "#E6A15C",
        },
        danger: "#D96C6C",
        border: "#D8D2C7",
      },
      fontFamily: {
        sans: [
          "Nunito",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        soft: "0 4px 20px -8px rgba(52, 51, 47, 0.12)",
        card: "0 6px 24px -10px rgba(52, 51, 47, 0.18)",
        ring: "0 0 0 3px rgba(244, 201, 93, 0.45)",
      },
      keyframes: {
        ping: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        pop: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slidein: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        ping: "ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
        pop: "pop 0.18s ease-out",
        slidein: "slidein 0.24s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
