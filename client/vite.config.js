import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sharedRoot = path.resolve(__dirname, '../shared');
const sharedEntry = path.resolve(sharedRoot, 'index.js');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@vignak/shared': sharedEntry,
    },
  },
  server: {
    fs: { allow: [path.resolve(__dirname, '..')] },
    port: 5173,
    host: '127.0.0.1',
    proxy: {
      '/api': {
        // Prefer IPv4 — Windows often resolves localhost to ::1 and refuses the proxy
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
});
