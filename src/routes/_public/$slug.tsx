import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { pageBySlugOptions } from '~/queries/pages'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import MuiLink from '@mui/material/Link'

export const Route = createFileRoute('/_public/$slug')({
  loader: async ({ context, params }) => {
    const page = await context.queryClient.ensureQueryData(
      pageBySlugOptions(params.slug),
    )
    if (!page) throw notFound()
    return page
  },
  component: DynamicPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? 'Page Not Found' },
      {
        name: 'description',
        content: loaderData?.description || undefined,
      },
    ],
  }),
})

function DynamicPage() {
  const { slug } = Route.useParams()
  const { data: page } = useSuspenseQuery(pageBySlugOptions(slug))

  if (!page) return null

  return (
    <Box sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="md">
        {/* Breadcrumb */}
        <Breadcrumbs separator="/" sx={{ fontSize: '0.875rem', mb: 4 }}>
          <MuiLink
            component={Link}
            to="/"
            underline="hover"
            color="text.secondary"
          >
            Home
          </MuiLink>
          <Typography variant="body2" color="text.primary">
            {page.title}
          </Typography>
        </Breadcrumbs>

        <Box component="article">
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 2,
              }}
            >
              {page.title}
            </Typography>
            {page.description && (
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 400,
                }}
              >
                {page.description}
              </Typography>
            )}
          </Box>

          {/* Featured Image */}
          {page.thumbnail_url && (
            <Box
              sx={{
                aspectRatio: '16/9',
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 4,
              }}
            >
              <img
                src={page.thumbnail_url}
                alt={page.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}

          {/* Content */}
          <Box
            sx={{
              '& h2': {
                typography: 'h5',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                mt: 6,
                mb: 2,
              },
              '& h3': {
                typography: 'h6',
                fontWeight: 600,
                mt: 4,
                mb: 1.5,
              },
              '& p': {
                typography: 'body1',
                color: 'text.secondary',
                lineHeight: 1.8,
                mb: 2,
              },
              '& a': {
                color: 'text.primary',
                textDecoration: 'underline',
                textUnderlineOffset: 4,
              },
              '& strong': { color: 'text.primary' },
              '& code': {
                fontSize: '0.875rem',
                bgcolor: 'action.hover',
                px: 0.75,
                py: 0.25,
                borderRadius: 0.5,
              },
              '& pre': {
                bgcolor: 'grey.900',
                borderRadius: 2,
                p: 2,
                overflow: 'auto',
                '& code': {
                  bgcolor: 'transparent',
                  px: 0,
                  py: 0,
                },
              },
              '& blockquote': {
                borderLeft: 3,
                borderColor: 'divider',
                pl: 2,
                my: 2,
                color: 'text.secondary',
              },
              '& img': {
                borderRadius: 2,
                maxWidth: '100%',
                height: 'auto',
              },
              '& ul, & ol': { color: 'text.secondary', pl: 3 },
              '& li': { mb: 0.5 },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {page.content}
            </ReactMarkdown>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
