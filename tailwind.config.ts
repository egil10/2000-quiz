import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        ink: {
          50:  "#f7f7f5",
          100: "#eeeeea",
          200: "#d8d8d2",
          300: "#b6b6ad",
          400: "#8d8d83",
          500: "#6b6b62",
          600: "#52524b",
          700: "#3f3f3a",
          800: "#262624",
          900: "#161614",
          950: "#0c0c0b",
        },
        accent: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        success: "#10b981",
        warn: "#f59e0b",
        danger: "#ef4444",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      backgroundImage: {
        "grain":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.4'/></svg>\")",
      },
    },
  },
  plugins: [],
};

export default config;
