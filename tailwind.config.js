/** @type {import('tailwindcss').Config} */
export const corePlugins = {
  preflight: false,
};
export const content = [
  './components/**/*.{vue,js}',
  './layouts/**/*.vue',
  './pages/**/*.vue',
  './app.vue',
];
export const theme = {
  extend: {},
};
export const plugins = [];