import { createServerFn } from '@tanstack/react-start'
import { adminDb } from '~/lib/firebase/server'
import { serializeDoc, serializeDocs } from '~/lib/firebase/helpers'
import type { Page } from '~/types'

const RESERVED_PATHS = [
  'blog',
  'portfolio',
  'contact',
  'admin',
  'auth',
  'api',
]

export const getPageBySlug = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    if (RESERVED_PATHS.includes(data.slug)) {
      return null
    }

    const snapshot = await adminDb
      .collection('pages')
      .where('slug', '==', data.slug)
      .where('published', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) return null

    return serializeDoc<Page>(snapshot.docs[0])
  })

export const getAdminPages = createServerFn({ method: 'GET' }).handler(
  async () => {
    const snapshot = await adminDb
      .collection('pages')
      .orderBy('created_at', 'desc')
      .get()

    return serializeDocs<Page>(snapshot.docs)
  },
)

export const getAdminPage = createServerFn({ method: 'GET' })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const doc = await adminDb.collection('pages').doc(data.id).get()

    if (!doc.exists) return null

    return serializeDoc<Page>(doc)
  })
