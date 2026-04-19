import { createAPIFileRoute } from '@tanstack/react-start/api'
import { submitContactForm } from '~/server/functions/contact'

export const APIRoute = createAPIFileRoute('/api/contact')({
  POST: async ({ request }) => {
    try {
      const body = await request.json()

      if (!body.name || !body.email || !body.message) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Name, email, and message are required',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        )
      }

      const result = await submitContactForm({
        data: {
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
        },
      })

      return new Response(
        JSON.stringify({ success: true, data: result }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Internal server error'
      return new Response(
        JSON.stringify({ success: false, error: message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }
  },
})
