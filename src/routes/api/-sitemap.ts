import { createAPIFileRoute } from '@tanstack/react-start/api'
import { adminDb } from '~/lib/firebase/server'

export const APIRoute = createAPIFileRoute('/api/sitemap')({
  GET: async ({ request }) => {
    const url = new URL(request.url)
    const baseUrl = url.origin

    const [postsSnap, portfolioSnap, pagesSnap] = await Promise.all([
      adminDb
        .collection('posts')
        .where('published', '==', true)
        .orderBy('published_at', 'desc')
        .get(),
      adminDb
        .collection('portfolio')
        .where('published', '==', true)
        .orderBy('created_at', 'desc')
        .get(),
      adminDb
        .collection('pages')
        .where('published', '==', true)
        .get(),
    ])

    const entries: Array<{ loc: string; lastmod?: string; priority: string }> =
      [
        { loc: baseUrl, priority: '1.0' },
        { loc: `${baseUrl}/portfolio`, priority: '0.8' },
        { loc: `${baseUrl}/blog`, priority: '0.8' },
        { loc: `${baseUrl}/resume`, priority: '0.7' },
        { loc: `${baseUrl}/contact`, priority: '0.6' },
      ]

    for (const doc of postsSnap.docs) {
      const data = doc.data()
      entries.push({
        loc: `${baseUrl}/blog/${data.slug}`,
        lastmod: data.updated_at?.toDate?.()?.toISOString?.() || undefined,
        priority: '0.6',
      })
    }

    for (const doc of portfolioSnap.docs) {
      const data = doc.data()
      entries.push({
        loc: `${baseUrl}/portfolio/${data.slug}`,
        lastmod: data.updated_at?.toDate?.()?.toISOString?.() || undefined,
        priority: '0.6',
      })
    }

    for (const doc of pagesSnap.docs) {
      const data = doc.data()
      entries.push({
        loc: `${baseUrl}/${data.slug}`,
        lastmod: data.updated_at?.toDate?.()?.toISOString?.() || undefined,
        priority: '0.5',
      })
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

    return new Response(xml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    })
  },
})
