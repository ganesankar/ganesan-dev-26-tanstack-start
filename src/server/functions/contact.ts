import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { adminDb } from '~/lib/firebase/server'
import type { ContactFormData } from '~/types'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, 'Message is required').max(5000),
})

export const submitContactForm = createServerFn({ method: 'POST' })
  .inputValidator((d: ContactFormData) => d)
  .handler(async ({ data }) => {
    const validated = contactSchema.parse(data)

    const docRef = await adminDb.collection('messages').add({
      name: validated.name,
      email: validated.email,
      subject: validated.subject ?? null,
      message: validated.message,
      read: false,
      created_at: new Date(),
    })

    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
          to: process.env.CONTACT_EMAIL,
          subject: validated.subject || `New message from ${validated.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${validated.name}</p>
            <p><strong>Email:</strong> ${validated.email}</p>
            ${validated.subject ? `<p><strong>Subject:</strong> ${validated.subject}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${validated.message.replace(/\n/g, '<br>')}</p>
          `,
        })
      } catch {
        // Email sending is non-critical; the message is already saved
      }
    }

    return { id: docRef.id }
  })
