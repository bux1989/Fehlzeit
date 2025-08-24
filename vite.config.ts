// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/FehlzeitenPageWrapper.tsx',   // adjust path if different
      name: 'FehlzeitenApp',                     // global: window.FehlzeitenApp
      fileName: () => 'fehlzeiten-app.umd.js',
      formats: ['umd'],
    },
    // NOTE: no "external" here → React is bundled inside
  },
});
