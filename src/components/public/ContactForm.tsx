import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { contactSchema } from '~/lib/validations'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SendIcon from '@mui/icons-material/Send'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    onSubmit: async ({ value }) => {
      setSubmitError('')
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value),
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to send message')
        }

        setSubmitted(true)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong'
        setSubmitError(message)
      }
    },
  })

  if (submitted) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Message Sent!
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Thank you for reaching out. I&apos;ll get back to you soon.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            setSubmitted(false)
            form.reset()
          }}
        >
          Send Another
        </Button>
      </Box>
    )
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      noValidate
    >
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = contactSchema.shape.name.safeParse(value)
                return result.success ? undefined : result.error.issues[0].message
              },
            }}
          >
            {(field) => (
              <TextField
                label="Name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={!!field.state.meta.errors.length}
                helperText={field.state.meta.errors[0]}
                fullWidth
                required
              />
            )}
          </form.Field>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = contactSchema.shape.email.safeParse(value)
                return result.success ? undefined : result.error.issues[0].message
              },
            }}
          >
            {(field) => (
              <TextField
                label="Email"
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={!!field.state.meta.errors.length}
                helperText={field.state.meta.errors[0]}
                fullWidth
                required
              />
            )}
          </form.Field>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <form.Field
            name="subject"
            validators={{
              onChange: ({ value }) => {
                if (!value) return undefined
                const result = contactSchema.shape.subject.safeParse(value)
                return result.success ? undefined : result.error.issues[0].message
              },
            }}
          >
            {(field) => (
              <TextField
                label="Subject (optional)"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={!!field.state.meta.errors.length}
                helperText={field.state.meta.errors[0]}
                fullWidth
              />
            )}
          </form.Field>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <form.Field
            name="message"
            validators={{
              onChange: ({ value }) => {
                const result = contactSchema.shape.message.safeParse(value)
                return result.success ? undefined : result.error.issues[0].message
              },
            }}
          >
            {(field) => (
              <TextField
                label="Message"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={!!field.state.meta.errors.length}
                helperText={field.state.meta.errors[0]}
                fullWidth
                required
                multiline
                rows={5}
              />
            )}
          </form.Field>
        </Grid>
      </Grid>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            sx={{ mt: 3 }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        )}
      </form.Subscribe>
    </Box>
  )
}
