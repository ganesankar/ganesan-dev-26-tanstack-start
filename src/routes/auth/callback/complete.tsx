import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { auth } from '~/lib/firebase/client'
import { createSessionFn } from '~/server/functions/auth'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export const Route = createFileRoute('/auth/callback/complete')({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
  }),
  component: CompleteCallback,
})

function CompleteCallback() {
  const { redirectTo } = Route.useSearch()
  const [status, setStatus] = useState<
    'verifying' | 'need-email' | 'success' | 'error'
  >('verifying')
  const [error, setError] = useState('')
  const [manualEmail, setManualEmail] = useState('')

  useEffect(() => {
    completeSignIn()
  }, [])

  async function completeSignIn(emailOverride?: string) {
    const url = window.location.href

    if (!isSignInWithEmailLink(auth, url)) {
      setError('Invalid sign-in link. Please request a new one.')
      setStatus('error')
      return
    }

    const email =
      emailOverride || localStorage.getItem('emailForSignIn') || ''

    if (!email) {
      setStatus('need-email')
      return
    }

    try {
      setStatus('verifying')
      const credential = await signInWithEmailLink(auth, email, url)
      const idToken = await credential.user.getIdToken()
      await createSessionFn({ data: { idToken } })
      localStorage.removeItem('emailForSignIn')
      window.location.href = redirectTo || '/admin'
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to complete sign-in'
      setError(message)
      setStatus('error')
    }
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (manualEmail) {
      completeSignIn(manualEmail)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        {status === 'verifying' && (
          <Box>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h5">Completing sign-in...</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Please wait while we verify your identity.
            </Typography>
          </Box>
        )}

        {status === 'success' && (
          <Box>
            <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5">Signed in successfully!</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Redirecting...
            </Typography>
          </Box>
        )}

        {status === 'need-email' && (
          <Box component="form" onSubmit={handleEmailSubmit}>
            <Typography variant="h5" mb={1}>
              Confirm your email
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Please enter the email address you used to request the sign-in
              link.
            </Typography>
            <TextField
              label="Email"
              type="email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth size="large">
              Continue
            </Button>
          </Box>
        )}

        {status === 'error' && (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        )}
      </Container>
    </Box>
  )
}
