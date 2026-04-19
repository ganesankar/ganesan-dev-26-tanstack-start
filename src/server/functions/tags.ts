import { createServerFn } from '@tanstack/react-start'
import { adminDb } from '~/lib/firebase/server'
import { serializeDocs } from '~/lib/firebase/helpers'
import type { Tag } from '~/types'

export const getTags = createServerFn({ method: 'GET' }).handler(async () => {
  const snapshot = await adminDb
    .collection('tags')
    .orderBy('name', 'asc')
    .get()

  return serializeDocs<Tag>(snapshot.docs)
})
