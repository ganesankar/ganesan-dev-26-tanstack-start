import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

// Normalize a PEM private key value coming from an env var. Handles
// the common Vercel-dashboard paste mistakes:
//   - surrounding quotes (single or double) included in the value
//   - escaped \n literals instead of real newlines
//   - leading/trailing whitespace
function normalizePrivateKey(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  let v = raw.trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1)
  }
  v = v.replace(/\\n/g, '\n')
  return v
}

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  const projectId = process.env.FB_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FB_CLIENT_EMAIL
  const privateKey = normalizePrivateKey(process.env.FB_PRIVATE_KEY)

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    })
  }

  return initializeApp({
    projectId,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  })
}

const app = getAdminApp()

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
export const adminStorage = getStorage(app)
