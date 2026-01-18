import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs DSFR officielles
        "blue-france": {
          "975": "#f5f5fe",
          "925": "#e3e3fd",
          "850": "#cacafb",
          "200": "#6a6af4",
          "113": "#000091",
          "main": "#000091",
        },
        "grey": {
          "950": "#f6f6f6",
          "925": "#eeeeee",
          "200": "#cecece",
          "100": "#e5e5e5",
        },
      },
      fontFamily: {
        sans: ["Marianne", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;


