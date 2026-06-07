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
        ink: "#171412",
        bone: "#f7f1e8",
        parchment: "#efe4d5",
        smoke: "#d8d0c5",
        bronze: "#a6784f",
        olive: "#6d7358",
        clay: "#b46d55",
        charcoal: "#27231f"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"]
      },
      boxShadow: {
        luxury: "0 30px 80px rgba(23,20,18,0.16)"
      }
    }
  },
  plugins: []
};

export default config;
