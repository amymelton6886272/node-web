import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  cacheDir: 'node_modules/.vite',
  build: {
    outDir: 'deploy-build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'react';
          if (id.includes('/lucide-react/')) return 'icons';
          return 'vendor';
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    hmr: false,
    allowedHosts: ['souk.eu.org'],
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['souk.eu.org'],
  },
});
