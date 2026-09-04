/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gh: {
          bg: "#0d1117",
          card: "#161b22",
          border: "#30363d",
          borderMuted: "#21262d",
          hover: "#1c2128",
          text: "#f0f6fc",
          subtext: "#8b949e",
          blue: "#58a6ff",
          green: "#3fb950",
          amber: "#d29922",
          red: "#f85149",
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
