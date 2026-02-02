import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname),
  base: process.env.NODE_ENV === 'production' ? '/challenge-tech/' : '/',
  build: {
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        problem1: resolve(__dirname, 'src/problem1/index.html'),
        problem2: resolve(__dirname, 'src/problem2/index.html'),
        problem3: resolve(__dirname, 'src/problem3/index.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
