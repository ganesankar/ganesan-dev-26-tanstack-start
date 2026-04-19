import { createServerFn } from '@tanstack/react-start'
import { adminDb } from '~/lib/firebase/server'
import { serializeDocs } from '~/lib/firebase/helpers'
import type { Category } from '~/types'

export const getCategories = createServerFn({ method: 'GET' }).handler(
  async () => {
    const snapshot = await adminDb
      .collection('categories')
      .orderBy('name', 'asc')
      .get()

    return serializeDocs<Category>(snapshot.docs)
  },
)
