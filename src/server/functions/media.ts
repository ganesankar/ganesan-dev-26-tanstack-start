import { createServerFn } from '@tanstack/react-start'
import { adminDb } from '~/lib/firebase/server'
import { serializeDocs } from '~/lib/firebase/helpers'
import type { Media } from '~/types'

export const getAdminMedia = createServerFn({ method: 'GET' }).handler(
  async () => {
    const snapshot = await adminDb
      .collection('media')
      .orderBy('created_at', 'desc')
      .get()

    return serializeDocs<Media>(snapshot.docs)
  },
)
