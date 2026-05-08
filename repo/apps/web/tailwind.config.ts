import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ember: "#ffb347",
        gold: "#ffd156",
        void: "#08090c",
        brown: "#1c1009"
      },
      fontFamily: {
        display: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
        ui: ["Space Grotesk", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 35px rgba(255, 190, 71, 0.4)"
      }
    }
  },
  plugins: []
};

export default config;
