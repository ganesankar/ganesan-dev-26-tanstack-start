import { createServerFn } from '@tanstack/react-start'
import { adminDb } from '~/lib/firebase/server'

export const getDashboardStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [postsSnap, pagesSnap, portfolioSnap, unreadSnap, mediaSnap] =
      await Promise.all([
        adminDb.collection('posts').count().get(),
        adminDb.collection('pages').count().get(),
        adminDb.collection('portfolio').count().get(),
        adminDb
          .collection('messages')
          .where('read', '==', false)
          .count()
          .get(),
        adminDb.collection('media').count().get(),
      ])

    return {
      posts: postsSnap.data().count,
      pages: pagesSnap.data().count,
      portfolio: portfolioSnap.data().count,
      unreadMessages: unreadSnap.data().count,
      media: mediaSnap.data().count,
    }
  },
)
