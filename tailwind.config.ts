import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accent: "#4F46E5",
        ink: "#0F172A"
      }
    }
  },
  plugins: []
} satisfies Config;
