import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.NEXT_PUBLIC_BACKEND_URI': JSON.stringify(env.NEXT_PUBLIC_BACKEND_URI)
    },
    plugins: [react()],
  }
})