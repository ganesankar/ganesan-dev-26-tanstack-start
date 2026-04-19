import { createServerFn } from '@tanstack/react-start'
import { adminDb } from '~/lib/firebase/server'
import { serializeDoc, serializeDocs } from '~/lib/firebase/helpers'
import type {
  PostWithRelations,
  PaginatedResponse,
} from '~/types'

const ITEMS_PER_PAGE = 10

export const getPublishedPosts = createServerFn({ method: 'GET' })
  .inputValidator(
    (d: { category?: string; tag?: string; page?: number }) => d,
  )
  .handler(async ({ data }) => {
    const { category, tag, page = 1 } = data

    const snapshot = await adminDb
      .collection('posts')
      .where('published', '==', true)
      .orderBy('published_at', 'desc')
      .get()

    let posts = serializeDocs<PostWithRelations>(snapshot.docs)

    if (category) {
      posts = posts.filter((p) =>
        p.categories.some((c) => c.slug === category),
      )
    }

    if (tag) {
      posts = posts.filter((p) => p.tags.some((t) => t.slug === tag))
    }

    const total = posts.length
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
    const start = (page - 1) * ITEMS_PER_PAGE
    const paginated = posts.slice(start, start + ITEMS_PER_PAGE)

    return {
      data: paginated,
      total,
      page,
      pageSize: ITEMS_PER_PAGE,
      totalPages,
    } satisfies PaginatedResponse<PostWithRelations>
  })

export const getPostBySlug = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const snapshot = await adminDb
      .collection('posts')
      .where('slug', '==', data.slug)
      .where('published', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) return null

    return serializeDoc<PostWithRelations>(snapshot.docs[0])
  })

export const getAdminPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const snapshot = await adminDb
      .collection('posts')
      .orderBy('created_at', 'desc')
      .get()

    return serializeDocs<PostWithRelations>(snapshot.docs)
  },
)

export const getAdminPost = createServerFn({ method: 'GET' })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const doc = await adminDb.collection('posts').doc(data.id).get()

    if (!doc.exists) return null

    const post = serializeDoc<PostWithRelations>(doc)
    if (!post) return null

    const category_ids = post.categories?.map((c) => c.id) ?? []
    const tag_ids = post.tags?.map((t) => t.id) ?? []

    return { ...post, category_ids, tag_ids }
  })
