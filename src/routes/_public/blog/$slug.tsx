import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { postBySlugOptions } from '~/queries/posts'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import MuiLink from '@mui/material/Link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export const Route = createFileRoute('/_public/blog/$slug')({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(
      postBySlugOptions(params.slug),
    )
    if (!post) throw notFound()
    return post
  },
  component: BlogPostPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? 'Post Not Found' },
      {
        name: 'description',
        content:
          loaderData?.description || `Read ${loaderData?.title || 'this post'}`,
      },
    ],
  }),
})

function estimateReadingTime(content: string): number {
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / 200)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function BlogPostPage() {
  const { slug } = Route.useParams()
  const { data: post } = useSuspenseQuery(postBySlugOptions(slug))

  if (!post) return null

  const readingTime = estimateReadingTime(post.content)
  const categories = post.categories || []
  const tags = post.tags || []

  return (
    <Box component="article">
      {/* Breadcrumb */}
      <Container maxWidth={false} sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 }, py: 3 }}>
        <Breadcrumbs separator="/" sx={{ fontSize: '0.875rem' }}>
          <MuiLink
            component={Link}
            to="/"
            underline="hover"
            color="text.secondary"
          >
            Home
          </MuiLink>
          <MuiLink
            component={Link}
            to="/blog"
            underline="hover"
            color="text.secondary"
          >
            Writing
          </MuiLink>
          <Typography
            variant="body2"
            color="text.primary"
            noWrap
            sx={{ maxWidth: 200 }}
          >
            {post.title}
          </Typography>
        </Breadcrumbs>
      </Container>

      {/* Article Header */}
      <Container
        maxWidth={false}
        sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 }, pb: { xs: 6, md: 8 }, pt: { xs: 4, md: 8 } }}
      >
        <Box sx={{ maxWidth: 900 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.25rem', md: '3rem', lg: '3.75rem' },
              fontWeight: 700,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              mb: 3,
            }}
          >
            {post.title}
          </Typography>

          {post.description && (
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                lineHeight: 1.5,
                mb: 4,
                maxWidth: 720,
              }}
            >
              {post.description}
            </Typography>
          )}

          {/* Meta Grid */}
          <Grid
            container
            spacing={4}
            sx={{ pt: 4, borderTop: 1, borderColor: 'divider' }}
          >
            <Grid size={{ xs: 12, md: 9 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: 'text.secondary',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Published
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <time dateTime={post.published_at || post.created_at}>
                      {formatDate(post.published_at || post.created_at)}
                    </time>
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: 'text.secondary',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Reading time
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {readingTime} min read
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {(categories.length > 0 || tags.length > 0) && (
              <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: { md: 'right' } }}>
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: 'text.secondary',
                    display: 'block',
                    mb: 1,
                  }}
                >
                  Topics
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: { md: 'flex-end' },
                    gap: 1,
                  }}
                >
                  {categories.map((cat) => (
                    <MuiLink
                      key={cat.id}
                      component={Link}
                      to="/blog"
                      search={{ category: cat.slug }}
                      variant="body2"
                      color="text.secondary"
                      underline="hover"
                      sx={{ '&:hover': { color: 'text.primary' } }}
                    >
                      {cat.name}
                    </MuiLink>
                  ))}
                  {tags.map((t) => (
                    <MuiLink
                      key={t.id}
                      component={Link}
                      to="/blog"
                      search={{ tag: t.slug }}
                      variant="body2"
                      color="text.secondary"
                      underline="hover"
                      sx={{ '&:hover': { color: 'text.primary' } }}
                    >
                      {t.name}
                    </MuiLink>
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>

      {/* Featured Image */}
      {post.thumbnail_url && (
        <Container maxWidth={false} sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 6, md: 8 } }}>
          <Box sx={{ maxWidth: 900 }}>
            <Box
              sx={{
                aspectRatio: '16/9',
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'action.hover',
              }}
            >
              <img
                src={post.thumbnail_url}
                alt={post.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Box>
        </Container>
      )}

      {/* Content */}
      <Container maxWidth={false} sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 } }}>
        <Box
          sx={{
            maxWidth: 720,
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
            '& img': { borderRadius: 2, maxWidth: '100%', height: 'auto' },
            '& ul, & ol': { color: 'text.secondary', pl: 3 },
            '& li': { mb: 0.5 },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </Box>
      </Container>

      {/* Footer Navigation */}
      <Container maxWidth={false} sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            maxWidth: 900,
            borderTop: 1,
            borderColor: 'divider',
            pt: 6,
          }}
        >
          <Typography
            component={Link}
            to="/blog"
            variant="body2"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 500,
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'text.primary',
                '& .back-icon': { transform: 'translateX(-4px)' },
              },
            }}
          >
            <ArrowBackIcon
              className="back-icon"
              sx={{ fontSize: 16, transition: 'transform 0.2s' }}
            />
            Back to all articles
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
