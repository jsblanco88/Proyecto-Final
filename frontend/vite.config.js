import { resolve } from 'path';
import { defineConfig } from 'vite';

/**
 * Configuración de Vite para soporte Multi-Página (MPA) con Vanilla JS
 */
export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'views/index.html'),
        login: resolve(__dirname, 'views/login.html'),
        reservas: resolve(__dirname, 'views/reservas.html'),
        dashboard: resolve(__dirname, 'views/dashboard.html'),
        historial: resolve(__dirname, 'views/historial.html'),
        inventario: resolve(__dirname, 'views/inventario.html'),
        fichaCliente: resolve(__dirname, 'views/ficha-cliente.html'),
      }
    }
  },
  server: {
    port: 5173,
    open: '/views/index.html',
    cors: true
  }
});
