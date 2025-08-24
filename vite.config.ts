// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // Pick the entry you actually use:
      // If your component lives at /FehlzeitenPageWrapper.tsx (root):
      entry: 'FehlzeitenPageWrapper.tsx',
      // Or if it lives in /src:
      // entry: 'src/FehlzeitenPageWrapper.tsx',

      name: 'FehlzeitenPageWrapper',          // => window.FehlzeitenPageWrapper
      fileName: () => `fehlzeiten-page-wrapper.umd.js`,
      formats: ['umd'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
});
