import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  const apiUrl = env.VITE_API_URL;
  const port = env.VITE_PORT;
  
  if (!apiUrl) {
    throw new Error('VITE_API_URL environment variable is required');
  }
  
  return {
    plugins: [react()],
    server: {
      port: port ? parseInt(port) : 3000,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

