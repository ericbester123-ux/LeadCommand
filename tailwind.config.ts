import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        card: "#111111",
        gold: "#d4af37",
        "gold-hover": "#e6c85c",
        muted: "#d6d6d6"
      },
      boxShadow: {
        gold: "0 0 30px rgba(212, 175, 55, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
