import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  console.log('Building for mode:', mode);
  console.log('Environment variables:', {
    VITE_API_BASE: process.env.VITE_API_BASE,
    NODE_ENV: process.env.NODE_ENV
  });

  return {
    plugins: [react()],
    server: { 
      port: 5173, 
      host: true 
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material']
          }
        }
      }
    },
    define: {
      // Ensure environment variables are available at build time
      'import.meta.env.VITE_API_BASE': JSON.stringify(process.env.VITE_API_BASE),
      'import.meta.env.MODE': JSON.stringify(mode)
    }
  }
})
