import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Adicione esta linha para vincular o servidor a 0.0.0.0 (acessível via localhost)
    port: 5173 // Mantenha a porta explícita, se desejar
  }
});
