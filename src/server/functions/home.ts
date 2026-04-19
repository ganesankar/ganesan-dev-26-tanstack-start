import { createServerFn } from '@tanstack/react-start'
import { adminDb } from '~/lib/firebase/server'
import { serializeDocs } from '~/lib/firebase/helpers'
import type { PostWithRelations, PortfolioWithCategories } from '~/types'

export const getHomeData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [
      postsCountSnap,
      portfolioCountSnap,
      resumeCountSnap,
      latestPostsSnap,
      latestPortfolioSnap,
    ] = await Promise.all([
      adminDb
        .collection('posts')
        .where('published', '==', true)
        .count()
        .get(),
      adminDb
        .collection('portfolio')
        .where('published', '==', true)
        .count()
        .get(),
      adminDb
        .collection('resume')
        .where('published', '==', true)
        .count()
        .get(),
      adminDb
        .collection('posts')
        .where('published', '==', true)
        .orderBy('published_at', 'desc')
        .limit(3)
        .get(),
      adminDb
        .collection('portfolio')
        .where('published', '==', true)
        .orderBy('created_at', 'desc')
        .limit(4)
        .get(),
    ])

    return {
      stats: {
        posts: postsCountSnap.data().count,
        portfolio: portfolioCountSnap.data().count,
        resume: resumeCountSnap.data().count,
      },
      latestPosts: serializeDocs<PostWithRelations>(latestPostsSnap.docs),
      latestPortfolio: serializeDocs<PortfolioWithCategories>(
        latestPortfolioSnap.docs,
      ),
    }
  },
)
