// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["src/app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        gradientBG: {
          "0%": { "background-position": "0 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0 50%" },
        },
        caretBlink: {
          "0%,50%": { opacity: "1" },
          "50.1%,100%": { opacity: "0" },
        },
        fadeIn: {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeInUp: {
          from: { opacity: 0, transform: "translateY(100%)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        pulseScale: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        "gradient-bg": "gradientBG 15s ease infinite",
        "caret-blink": "caretBlink 1s steps(1) infinite",
        "fade-in": "fadeIn 1s ease-out both",
        "fade-in-up": "fadeInUp 0.7s ease-out both",
        "pulse-scale": "pulseScale 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};