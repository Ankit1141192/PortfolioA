/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A101E",
        panel: "#101B30",
        panel2: "#0D1729",
        line: "#1F3355",
        paper: "#EDEAE0",
        muted: "#8FA0BE",
        amber: {
          DEFAULT: "#FFB238",
          dim: "#B8801F",
        },
        cyan: {
          DEFAULT: "#5EEAD4",
          dim: "#2E9C8C",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(94,148,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,148,255,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(94,148,255,0.08), 0 20px 60px -20px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
