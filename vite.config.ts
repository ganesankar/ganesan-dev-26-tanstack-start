import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
  plugins: [
    tanstackStart({
      server: {
        preset: process.env.VERCEL ? 'vercel' : 'node-server',
      },
    }),
    viteReact(),
  ],
})
