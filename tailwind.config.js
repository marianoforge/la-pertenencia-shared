import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "380px",
      sm: "600px",
      md: "900px",
      lg: "1280px",
      xl: "1536px",
      "2xl": "1920px",
    },
    extend: {
      fontFamily: {
        lora: ["var(--font-lora)", "serif"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        h1: [
          "32px",
          { lineHeight: "auto", letterSpacing: "0.5em", fontWeight: "400" },
        ],
        h2: [
          "20px",
          { lineHeight: "auto", letterSpacing: "0.5em", fontWeight: "500" },
        ],
        h3: [
          "40px",
          { lineHeight: "auto", letterSpacing: "0.25em", fontWeight: "500" },
        ],
        "hero-paragraph": [
          "20px",
          { lineHeight: "32px", letterSpacing: "0.02em", fontWeight: "600" },
        ],
        "card-title": [
          "16px",
          { lineHeight: "auto", letterSpacing: "0.25em", fontWeight: "600" },
        ],
        "card-subtitle": [
          "16px",
          { lineHeight: "auto", letterSpacing: "0.25em", fontWeight: "500" },
        ],
        "card-paragraph": [
          "16px",
          { lineHeight: "auto", letterSpacing: "0.05em", fontWeight: "400" },
        ],
        "card-price": [
          "32px",
          { lineHeight: "auto", letterSpacing: "0.05em", fontWeight: "500" },
        ],
        button: [
          "16px",
          { lineHeight: "auto", letterSpacing: "0.5em", fontWeight: "500" },
        ],
        input: [
          "16px",
          { lineHeight: "auto", letterSpacing: "0.05em", fontWeight: "400" },
        ],
      },
      colors: {
        // Theme colors from the provided image
        "negro-puro": "#000000",
        "blanco-puro": "#FFFFFF",
        "negro-base": "#111111",
        "blanco-bg": "#FAFAFA",
        "gris-90": "#292929",
        "gris-bg": "#F5F5F5",
        "gris-60": "#707070",
        "gris-30": "#A6A6A6",
        "dorado-light": "#FEBB41",
        "dorado-dark": "#9B6502",

        // CSS variables for theme switching
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), require("@tailwindcss/line-clamp")],
};

export default config;
