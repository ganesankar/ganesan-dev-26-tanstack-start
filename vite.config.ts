import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { nitro } from 'nitro/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssr: {
    external: [
      'firebase-admin',
      '@google-cloud/storage',
      '@google-cloud/firestore',
      'google-gax',
      '@grpc/grpc-js',
    ],
  },
  plugins: [
    tanstackStart(),
    nitro({
      preset: process.env.VERCEL ? 'vercel' : 'node-server',
      rollupConfig: {
        external: [
          'firebase-admin',
          'firebase',
          '@google-cloud/storage',
          '@google-cloud/firestore',
          'google-gax',
          '@grpc/grpc-js',
        ],
      },
    }),
    viteReact(),
  ],
})
