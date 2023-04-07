/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Apply the dark mode class setting:
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    // 2. Append the path for the Skeleton NPM package and files:
    require("path").join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}"),
  ],
  theme: {
    extend: {},
    screens: {
      "2xl": { max: "1535px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
      xs: { max: "320px" },
    },
  },

  plugins: [
    // 3. Append the Skeleton plugin to the end of this list
    ...require("@skeletonlabs/skeleton/tailwind/skeleton.cjs")(),
  ],
};
