import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/auth/callback')({
  GET: async ({ request }) => {
    const url = new URL(request.url)
    const redirectTo = url.searchParams.get('redirectTo') || '/admin'

    const targetUrl = new URL('/auth/callback/complete', url.origin)
    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value)
    })
    targetUrl.searchParams.set('redirectTo', redirectTo)

    return new Response(null, {
      status: 302,
      headers: { Location: targetUrl.toString() },
    })
  },
})
