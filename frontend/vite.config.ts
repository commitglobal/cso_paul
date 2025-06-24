import path, { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [
      react({
        include: '**/*.disabled',
      }),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      // extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
    },
    root: resolve(__dirname, './src'),
    base: command === 'serve' ? '/static/' : '',
    server: {
      open: false,
      host: '0.0.0.0',
      port: +env.DJANGO_VITE_DEV_SERVER_PORT || 3000,
      watch: command === 'serve' ? { usePolling: true, disableGlobbing: false } : null
    },
    build: {
      manifest: true,
      emptyOutDir: true,
      assetsDir: '',
      target: 'es2015',
      modulePreload: false,
      outDir: resolve(__dirname, './dist'),
      rollupOptions: {
        input: {
          main: resolve('./src/main.tsx')
        },
        output: {
          chunkFileNames: undefined
        }
      }
    }
  })
})
