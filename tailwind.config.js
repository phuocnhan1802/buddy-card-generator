/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        coral: { DEFAULT: "#FF6B57", dark: "#E4523F" },
        violet: { DEFAULT: "#5B4FE0", dark: "#4438C7" },
        ink: { DEFAULT: "#1A1A2E", soft: "#4B4B63" },
        paper: "#FFFFFF",
        canvas: "#FAFAF9",
        line: "#ECEAE6",
        success: "#34D399",
        danger: "#EF4444",
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(26, 26, 46, 0.08)",
        lifted: "0 16px 40px rgba(26, 26, 46, 0.14)",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-out",
      },
    },
  },
  plugins: [],
};
