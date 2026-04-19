import { createServerFn } from '@tanstack/react-start'
import { adminDb } from '~/lib/firebase/server'
import { serializeDoc, serializeDocs } from '~/lib/firebase/helpers'
import type { Resume } from '~/types'

export const getPublishedResume = createServerFn({ method: 'GET' }).handler(
  async () => {
    const snapshot = await adminDb
      .collection('resume')
      .where('published', '==', true)
      .orderBy('sort_order', 'asc')
      .get()

    return serializeDocs<Resume>(snapshot.docs)
  },
)

export const getAdminResume = createServerFn({ method: 'GET' }).handler(
  async () => {
    const snapshot = await adminDb
      .collection('resume')
      .orderBy('sort_order', 'asc')
      .get()

    return serializeDocs<Resume>(snapshot.docs)
  },
)

export const getAdminResumeItem = createServerFn({ method: 'GET' })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const doc = await adminDb.collection('resume').doc(data.id).get()

    if (!doc.exists) return null

    return serializeDoc<Resume>(doc)
  })
