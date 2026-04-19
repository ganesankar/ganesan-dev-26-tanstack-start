import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getUserFn, signUpFn } from '~/server/functions/auth'
import { signupSchema } from '~/lib/validations'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export const Route = createFileRoute('/auth/signup')({
  beforeLoad: async () => {
    const user = await getUserFn()
    if (!user) {
      throw redirect({ to: '/auth/login', search: { redirectTo: '/auth/signup' } })
    }
    return { user }
  },
  component: SignupPage,
})

function SignupPage() {
  const { user } = Route.useRouteContext()

  if (!user.admin) {
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
        <Container maxWidth="sm">
          <Alert severity="error" variant="outlined">
            <Typography variant="h6" gutterBottom>
              Unauthorized
            </Typography>
            <Typography variant="body2">
              You do not have permission to create new accounts. Only
              administrators can access this page.
            </Typography>
          </Alert>
        </Container>
      </Box>
    )
  }

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
                Create Account
              </Typography>
              <Typography variant="body1" fontSize="0.875rem" color="text.secondary">
                Create a new admin account
              </Typography>
            </Box>
            <SignupForm />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const result = signupSchema.safeParse({ email, password, confirmPassword })
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setLoading(true)
    try {
      const newUser = await signUpFn({ data: { email, password } })
      setSuccess(`Account created for ${newUser.email}`)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create account'
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
      {success && (
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{ mb: 4, borderRadius: 2 }}
        >
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight={500} mb={1}>
          Email
        </Typography>
        <TextField
          placeholder="admin@example.com"
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

      <Box sx={{ mb: 2 }}>
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

      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" fontWeight={500} mb={1}>
          Confirm Password
        </Typography>
        <TextField
          placeholder="••••••••"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {loading ? 'Creating...' : 'Create Account'}
      </Button>
    </Box>
  )
}
