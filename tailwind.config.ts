/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#0f0f0f",
        white: "#ffffff",
        silver: "#c0c0c0",
        darkGrey: "#2a2a2a",
        mediumGrey: "#3a3a3a",
        lightGrey: "#9ca3af",
      },
      backgroundImage: {
        "gradient-dark":
          "linear-gradient(135deg, #0f0f0f 0%, #2a2a2a 50%, #c0c0c0 100%)",
        "gradient-sidebar":
          "linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 50%, #2a2a2a 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(255, 255, 255, 0.1)",
        "glass-md": "0 4px 16px rgba(255, 255, 255, 0.08)",
      },
      backdropFilter: {
        glass: "blur(10px)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
