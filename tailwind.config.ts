import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0B",
        surface: "#161618",
        "surface-elevated": "#1E1E21",
        silver: "#C7CBD1",
        "silver-bright": "#E8EAED",
        "silver-dim": "#8A8D93",
        "text-hi": "#F5F5F6",
        "text-mid": "#A0A2A8",
        "text-low": "#6B6D73",
      },
      borderColor: {
        DEFAULT: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["Inter","sans-serif"],
        display: ["Poppins","sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
    },
  },
  plugins: [],
};
export default config;
