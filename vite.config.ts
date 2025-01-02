import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/analise-de-canibalizacao/', // Caminho específico no tools.seoz.com.br
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
