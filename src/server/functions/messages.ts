import { createServerFn } from '@tanstack/react-start'
import { adminDb } from '~/lib/firebase/server'
import { serializeDocs } from '~/lib/firebase/helpers'
import type { Message } from '~/types'

export const getMessages = createServerFn({ method: 'GET' }).handler(
  async () => {
    const snapshot = await adminDb
      .collection('messages')
      .orderBy('created_at', 'desc')
      .get()

    return serializeDocs<Message>(snapshot.docs)
  },
)
