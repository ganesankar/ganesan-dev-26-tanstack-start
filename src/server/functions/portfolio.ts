import { createServerFn } from '@tanstack/react-start'
import { adminDb } from '~/lib/firebase/server'
import { serializeDoc, serializeDocs } from '~/lib/firebase/helpers'
import type { PortfolioWithCategories, PaginatedResponse } from '~/types'

const ITEMS_PER_PAGE = 10

export const getPublishedPortfolio = createServerFn({ method: 'GET' })
  .inputValidator((d: { category?: string; page?: number }) => d)
  .handler(async ({ data }) => {
    const { category, page = 1 } = data

    const snapshot = await adminDb
      .collection('portfolio')
      .where('published', '==', true)
      .orderBy('created_at', 'desc')
      .get()

    let items = serializeDocs<PortfolioWithCategories>(snapshot.docs)

    if (category) {
      items = items.filter((p) =>
        p.categories.some((c) => c.slug === category),
      )
    }

    const total = items.length
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
    const start = (page - 1) * ITEMS_PER_PAGE
    const paginated = items.slice(start, start + ITEMS_PER_PAGE)

    return {
      data: paginated,
      total,
      page,
      pageSize: ITEMS_PER_PAGE,
      totalPages,
    } satisfies PaginatedResponse<PortfolioWithCategories>
  })

export const getPortfolioBySlug = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const snapshot = await adminDb
      .collection('portfolio')
      .where('slug', '==', data.slug)
      .where('published', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) return null

    return serializeDoc<PortfolioWithCategories>(snapshot.docs[0])
  })

export const getAdminPortfolio = createServerFn({ method: 'GET' }).handler(
  async () => {
    const snapshot = await adminDb
      .collection('portfolio')
      .orderBy('created_at', 'desc')
      .get()

    return serializeDocs<PortfolioWithCategories>(snapshot.docs)
  },
)

export const getAdminPortfolioItem = createServerFn({ method: 'GET' })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const doc = await adminDb.collection('portfolio').doc(data.id).get()

    if (!doc.exists) return null

    const item = serializeDoc<PortfolioWithCategories>(doc)
    if (!item) return null

    const category_ids = item.categories?.map((c) => c.id) ?? []

    return { ...item, category_ids }
  })
