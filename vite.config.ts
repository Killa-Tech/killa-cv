import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@myriaddreamin/typst.ts')) {
            return 'vendor-typst'
          }
          if (id.includes('node_modules/@base-ui/react') || id.includes('node_modules/@floating-ui')) {
            return 'vendor-ui'
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-virtual'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          if (id.includes('node_modules/cn') || id.includes('node_modules/class-variance-authority')) {
            return 'vendor-styles'
          }


        },
      },
    },
  },
})
