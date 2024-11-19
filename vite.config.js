import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Mkcert from 'vite-plugin-mkcert';
import tailwindcss from 'tailwindcss'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    server: {
        // https: true,
        port: 3000,
        open: true
    },
    plugins: [react(), Mkcert()],
    css: {
        postcss: {
            plugins: [tailwindcss()]
        }
    }
  };
});