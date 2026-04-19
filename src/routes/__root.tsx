/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  Link,
} from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { AppThemeProvider } from '~/theme/ThemeContext'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/Home'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Ganesan-Dev-26-Tanstack-Start' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      },
    ],
    scripts: []
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <Outlet />
        </AppThemeProvider>
        <ReactQueryDevtools buttonPosition="bottom-right" />
      </QueryClientProvider>
    </RootDocument>
  )
}

function NotFoundPage() {
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
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '8rem', md: '10rem' },
            fontWeight: 700,
            color: 'divider',
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
          Page Not Found
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
        >
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or deleted.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<HomeIcon />}
          >
            Go Home
          </Button>
          <Button
            component={Link}
            to="/blog"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Back to Blog
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={{ margin: 0 }}>
        {children}
        <Scripts />

      </body>
    </html>
  )
}
