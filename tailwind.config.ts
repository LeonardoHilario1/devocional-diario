import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-body)", "Georgia", "serif"],
        sans: ["var(--font-ui)", "system-ui", "sans-serif"],
      },
      colors: {
        paper: {
          light: "#faf7f2",
          dark: "#15130f",
        },
        ink: {
          light: "#2b2620",
          dark: "#ece6da",
        },
        brand: {
          50: "#fbf5ec",
          100: "#f3e6cf",
          200: "#e6cb9d",
          300: "#d7ab68",
          400: "#c98f42",
          500: "#af7530",
          600: "#8c5c26",
          700: "#6c4620",
          800: "#4c321a",
          900: "#332214",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "70ch",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
