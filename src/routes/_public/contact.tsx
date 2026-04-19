import { createFileRoute, Link } from '@tanstack/react-router'
import { ContactForm } from '~/components/public/ContactForm'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import MuiLink from '@mui/material/Link'
import Paper from '@mui/material/Paper'

export const Route = createFileRoute('/_public/contact')({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: 'Contact' },
      { name: 'description', content: 'Get in touch with me' },
    ],
  }),
})

function ContactPage() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '42rem' }}>

        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: 'text.primary',
              mb: 2,
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', lineHeight: 1.7 }}
          >
            Have a question or want to work together? Drop me a message and
            I&apos;ll get back to you as soon as possible.
          </Typography>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
          }}
        >
          <ContactForm />
        </Paper>
      </Container>
    </Box>
  )
}
