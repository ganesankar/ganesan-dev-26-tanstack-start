// Ship firebase-admin and its Google Cloud peer deps as runtime
// node_modules into the Vercel function output.
//
// Why this script exists:
//   Nitro v3 (Dec 2025+) bundles externals into _libs/*.mjs by default
//   unless added to `traceDeps`. Even with traceDeps, the externals
//   plugin has an unfixed bug (nitrojs/nitro PR #4094, still open as
//   of 2026-04-15) where its `resolveId` handler short-circuits CJS
//   `require()` calls coming from rolldown's node-resolve layer.
//   `firebase-admin` uses a dynamic `require('@google-cloud/firestore')`
//   inside its firestore submodule, which therefore never gets traced
//   and ships as an unresolved bare specifier in firebase-admin.mjs.
//
//   Additionally, `google-gax` references `__dirname` to locate its
//   .proto files. `__dirname` does not exist in ESM scope, so even
//   when the bundler does succeed it crashes at runtime.
//
//   The only reliable fix is to keep these packages out of the bundle
//   AND copy their physical directories (with all transitive deps)
//   into the function's node_modules/ so Node can resolve them at
//   runtime via the normal CommonJS resolver.
//
// What it does:
//   1) Locates the Vercel function output directory.
//   2) Uses @vercel/nft to compute the closure of files needed for
//      each runtime-external package.
//   3) Copies whole package directories (all files, not just traced
//      ones — required for runtime asset loading like .proto files).
//
// Run as a post-build step from package.json:
//   "build": "vite build && node scripts/ship-firebase-admin.mjs"

import { createRequire } from 'node:module'
import { mkdir, copyFile, readdir, stat, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const require = createRequire(join(projectRoot, 'package.json'))

const ROOT_PACKAGES = [
  'firebase-admin',
  '@google-cloud/firestore',
  '@google-cloud/storage',
  'google-gax',
  '@grpc/grpc-js',
  '@grpc/proto-loader',
  'protobufjs',
]

function findFunctionDirs() {
  const candidates = [
    join(projectRoot, '.vercel/output/functions/__server.func'),
    join(projectRoot, '.vercel/output/functions/_server.func'),
    join(projectRoot, '.output/server'),
  ]
  return candidates.filter((p) => existsSync(p))
}

// Resolve a package's installation directory without relying on
// `${pkg}/package.json` import (some packages, like firebase-admin,
// don't expose their package.json via the `exports` field). We walk
// up from the project root checking node_modules/<pkg>.
async function getPackageDir(pkgName, fromDir = projectRoot) {
  let cur = fromDir
  while (true) {
    const candidate = join(cur, 'node_modules', pkgName)
    if (existsSync(join(candidate, 'package.json'))) return candidate
    const parent = dirname(cur)
    if (parent === cur) return null
    cur = parent
  }
}

async function readJSON(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}

async function copyDir(src, dst) {
  await mkdir(dst, { recursive: true })
  const entries = await readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === 'node_modules') continue
    const srcPath = join(src, entry.name)
    const dstPath = join(dst, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, dstPath)
    } else if (entry.isFile()) {
      await copyFile(srcPath, dstPath)
    }
  }
}

async function collectTransitiveDeps(rootPkgDirs, visited = new Map()) {
  for (const dir of rootPkgDirs) {
    if (visited.has(dir)) continue
    let pkg
    try {
      pkg = await readJSON(join(dir, 'package.json'))
    } catch {
      continue
    }
    visited.set(dir, pkg.name)
    const deps = {
      ...pkg.dependencies,
      ...pkg.optionalDependencies,
    }
    for (const depName of Object.keys(deps)) {
      const depDir = await getPackageDir(depName, dir)
      if (depDir && !visited.has(depDir)) {
        await collectTransitiveDeps([depDir], visited)
      }
    }
  }
  return visited
}

async function shipTo(functionDir) {
  const targetNm = join(functionDir, 'node_modules')
  console.log(`[ship-firebase-admin] target: ${relative(projectRoot, targetNm)}`)

  const rootDirs = []
  for (const pkg of ROOT_PACKAGES) {
    const dir = await getPackageDir(pkg)
    if (!dir) {
      console.warn(`[ship-firebase-admin]   ⚠ ${pkg} not installed; skipping`)
      continue
    }
    rootDirs.push(dir)
  }

  const allPackages = await collectTransitiveDeps(rootDirs)
  console.log(`[ship-firebase-admin]   tracing ${allPackages.size} packages...`)

  let copied = 0
  for (const [pkgDir, pkgName] of allPackages) {
    if (!pkgName) continue
    const dst = join(targetNm, pkgName)
    if (existsSync(dst)) continue
    await copyDir(pkgDir, dst)
    copied++
  }
  console.log(`[ship-firebase-admin]   ✓ copied ${copied} packages`)
}

async function main() {
  const dirs = findFunctionDirs()
  if (dirs.length === 0) {
    console.log('[ship-firebase-admin] no build output found; skipping')
    return
  }
  for (const dir of dirs) {
    await shipTo(dir)
  }
}

main().catch((err) => {
  console.error('[ship-firebase-admin] failed:', err)
  process.exit(1)
})
