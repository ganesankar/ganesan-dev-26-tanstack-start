import { useState } from 'react'
import { createFileRoute, useNavigate, Link as RouterLink } from '@tanstack/react-router'
import { z } from 'zod'
import {
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
} from 'firebase/auth'
import { auth } from '~/lib/firebase/client'
import { createSessionFn } from '~/server/functions/auth'
import { loginSchema, magicLinkSchema } from '~/lib/validations'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import SendIcon from '@mui/icons-material/Send'

export const Route = createFileRoute('/auth/login')({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
  }),
  component: LoginPage,
})

function LoginPage() {
  const { redirectTo } = Route.useSearch()
  const [tab, setTab] = useState(0)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(to bottom right, #0f172a, #1e293b)'
            : 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 448 }}>
        <Card sx={{ borderRadius: 4, boxShadow: 6, bgcolor: 'background.paper' }}>
          <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" component="h1" fontWeight={700} fontSize="1.875rem" color="text.primary" mb={1}>
                Welcome back
              </Typography>
              <Typography variant="body1" fontSize="0.875rem" color="text.secondary">
                Sign in to access your dashboard
              </Typography>
            </Box>

            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="fullWidth"
              sx={{
                mb: 3,
                bgcolor: 'action.hover',
                borderRadius: 2,
                p: 0.5,
                minHeight: 40,
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
              }}
            >
              <Tab
                label="Password"
                disableRipple
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 32,
                  py: 0.5,
                  borderRadius: 1.5,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'text.primary',
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                  },
                }}
              />
              <Tab
                label="Magic Link"
                disableRipple
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 32,
                  py: 0.5,
                  borderRadius: 1.5,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'text.primary',
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                  },
                }}
              />
            </Tabs>

            {tab === 0 && (
              <PasswordLoginForm redirectTo={redirectTo || '/admin'} />
            )}
            {tab === 1 && (
              <MagicLinkForm redirectTo={redirectTo || '/admin'} />
            )}

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/auth/signup"
                  sx={{ fontWeight: 'medium', textDecoration: 'none' }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

function PasswordLoginForm({ redirectTo }: { redirectTo: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setLoading(true)
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await credential.user.getIdToken()
      await createSessionFn({ data: { idToken } })
      window.location.href = redirectTo
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign in'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight={500} mb={1}>
          Email
        </Typography>
        <TextField
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 1.5 },
            },
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" fontWeight={500} mb={1}>
          Password
        </Typography>
        <TextField
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 1.5 },
            },
          }}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disableElevation
        sx={{
          py: 1,
          borderRadius: 1.5,
          textTransform: 'none',
          bgcolor: 'text.primary',
          color: 'background.paper',
          fontWeight: 500,
          '&:hover': {
            bgcolor: 'text.secondary',
          },
        }}
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : undefined
        }
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
    </Box>
  )
}

function MagicLinkForm({ redirectTo }: { redirectTo: string }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result = magicLinkSchema.safeParse({ email })
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setLoading(true)
    try {
      const callbackUrl = new URL('/api/auth/callback', window.location.origin)
      callbackUrl.searchParams.set('redirectTo', redirectTo)

      await sendSignInLinkToEmail(auth, email, {
        url: callbackUrl.toString(),
        handleCodeInApp: true,
      })

      localStorage.setItem('emailForSignIn', email)
      setSuccess(true)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to send magic link'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Alert severity="success">
        Magic link sent to <strong>{email}</strong>. Check your inbox and click
        the link to sign in.
      </Alert>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight={500} mb={1}>
          Email
        </Typography>
        <TextField
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 1.5 },
            },
          }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" mb={4}>
        We'll send you a magic link to sign in without a password.
      </Typography>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disableElevation
        sx={{
          py: 1,
          borderRadius: 1.5,
          textTransform: 'none',
          bgcolor: 'text.primary',
          color: 'background.paper',
          fontWeight: 500,
          '&:hover': {
            bgcolor: 'text.secondary',
          },
        }}
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : undefined
        }
      >
        {loading ? 'Sending link...' : 'Send magic link'}
      </Button>
    </Box>
  )
}
