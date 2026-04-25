import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { nitro } from 'nitro/vite'

// firebase-admin and its Google Cloud peer deps cannot be cleanly
// bundled by rolldown:
//   - google-gax uses __dirname to locate .proto files (undefined in
//     ESM scope after Nitro's CJS->ESM conversion)
//   - firebase-admin uses dynamic require('@google-cloud/firestore')
//     which Nitro v3's externals plugin fails to trace (PR #4094 still
//     open as of 2026-04-15)
//
// Strategy: declare them external at every layer (Vite SSR, rolldown)
// so they remain bare imports in the bundle, then rely on
// scripts/ship-firebase-admin.mjs (run as a postbuild step) to copy
// the actual node_modules into the function output.
const RUNTIME_EXTERNAL_PACKAGES = [
  'firebase-admin',
  'firebase-admin/app',
  'firebase-admin/auth',
  'firebase-admin/firestore',
  'firebase-admin/storage',
  '@google-cloud/firestore',
  '@google-cloud/storage',
  'google-gax',
  '@grpc/grpc-js',
  '@grpc/proto-loader',
  'protobufjs',
]

const RUNTIME_EXTERNAL_REGEX = [
  /^firebase-admin(\/.*)?$/,
  /^@google-cloud\/(firestore|storage)(\/.*)?$/,
  /^google-gax(\/.*)?$/,
  /^@grpc\/(grpc-js|proto-loader)(\/.*)?$/,
  /^protobufjs(\/.*)?$/,
]

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
    external: RUNTIME_EXTERNAL_PACKAGES,
  },
  plugins: [
    tanstackStart(),
    nitro({
      preset: process.env.VERCEL ? 'vercel' : 'node-server',
      rolldownConfig: {
        external: RUNTIME_EXTERNAL_REGEX,
      },
    }),
    viteReact(),
  ],
})
