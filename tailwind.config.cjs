/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: (() => {
        const colorShades = {
          "shadow-green": ['#f1fcfc','#e0f6f4','#9BC4C1','#9ee2dd','#75ccc7','#64b3ae','#4d908d','#3f7471','#345e5b','#2f4e4c','#1a3332'],
          "turquoise-blue": ['#ecfefe','#d6f8f9','#aaf3f5','#65E1E5','#00d4d9','#00babf','#00969b','#00787c','#056264','#165153','#033637'],
          "eastern-blue": ['#effdfc','#d5f8f4','#a3f3ec','#6de7de','#39cfc6','#22B0A8','#24928c','#24746f','#1c5d59','#214c49','#0d2e2c'],
          "calypso": ['#f3f8fd','#e6f1f9','#c9e2f5','#9dcef0','#6cb6e6','#55a2d5','#3c84b2','#2B668B','#295877','#284960','#162f3f'],
          "silver-tree": ['#f3fcf9','#dff6ed','#bceedc','#99e1c8','#79c9ae','#67AF97','#538e7a','#447162','#365a4e','#314a41','#1a2d26'],
          "java": ['#eefdff','#d9f7fc','#b1f0f9','#7fe5f3','#40d0e1','#27AFBF','#1e93a1','#1d7681','#1b6068','#1f4f56','#0c343a'],
          "jungle-mist": ['#f1f9fa','#e3f2f4','#A5C7CB','#90d4dc','#4fbfcb','#2cacb9','#018d99','#06717a','#0e5e66','#1a4e53','#0b3236'],
          "envy": ['#fafafa','#f5f5f5','#e5e5e5','#d4d4d4','#95A393','#737373','#525252','#404040','#262626','#171717','#0a0a0a'],
          "dove-gray": ['#fafafa','#f5f5f5','#e5e5e5','#d4d4d4','#a1a1a1','#737373','#525252','#404040','#262626','#171717','#0a0a0a'],
        };

        const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
        const colors = {};

        for (const [name, hexValues] of Object.entries(colorShades)) {
          colors[name] = shades.reduce((acc, shade, index) => {
            acc[shade] = hexValues[index];
            return acc;
          }, {});
        }

        return colors;
      })(),
    },
  },
  plugins: [],
};
