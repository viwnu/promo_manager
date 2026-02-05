import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests from '/api' to 'http://localhost:3000'
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // Changes the origin of the host header to the target URL
        // rewrite: (path) => path.replace(/^\/api/, ''), // Removes the '/api' prefix when forwarding the request
      },
    },
  },
});
