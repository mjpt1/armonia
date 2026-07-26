import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: "#F2F7F4",
          100: "#E8EFEA",
          700: "#3D5C4A",
          800: "#2F4A3C",
          900: "#1E3028",
        },
        champagne: {
          100: "#F3EBDD",
          500: "#C4A574",
          700: "#A6854F",
        },
        ivory: "#F7F4EF",
        porcelain: "#FFFCF8",
        stone: {
          100: "#EDE8E1",
          300: "#C9C0B4",
        },
        ink: {
          muted: "#7A7268",
          700: "#3A3530",
          900: "#1C1916",
        },
        success: "#2F7D5B",
        warning: "#C4892A",
        danger: "#B4453A",
        info: "#3D6B7A",
      },
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "Tahoma", "sans-serif"],
        display: ["var(--font-estedad)", "var(--font-vazirmatn)", "Tahoma", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(28 25 22 / 0.04), 0 8px 24px rgb(28 25 22 / 0.04)",
        depth: "0 1px 1px rgb(28 25 22 / 0.03), 0 12px 40px rgb(47 74 60 / 0.05)",
      },
      transitionTimingFunction: {
        armonia: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        armonia: "280ms",
      },
    },
  },
  plugins: [],
} satisfies Config;
