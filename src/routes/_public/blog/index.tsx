import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { publishedPostsOptions } from '~/queries/posts'
import { categoriesOptions } from '~/queries/categories'
import { tagsOptions } from '~/queries/tags'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import MuiLink from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import ArticleIcon from '@mui/icons-material/Article'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const blogSearchSchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
  page: z.coerce.number().optional(),
})

export const Route = createFileRoute('/_public/blog/')({
  validateSearch: blogSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    const { category, tag, page } = deps
    return Promise.all([
      context.queryClient.ensureQueryData(
        publishedPostsOptions({ category, tag, page }),
      ),
      context.queryClient.ensureQueryData(categoriesOptions()),
      context.queryClient.ensureQueryData(tagsOptions()),
    ])
  },
  component: BlogListPage,
  head: () => ({
    meta: [
      { title: 'Writing' },
      {
        name: 'description',
        content: 'Articles on development, design, and technology',
      },
    ],
  }),
})

function BlogListPage() {
  const { category, tag, page = 1 } = Route.useSearch()
  const { data: postsData } = useSuspenseQuery(
    publishedPostsOptions({ category, tag, page }),
  )
  const { data: categories } = useSuspenseQuery(categoriesOptions())
  const { data: tags } = useSuspenseQuery(tagsOptions())

  const { data: posts, totalPages } = postsData

  const activeCategory = category
    ? categories.find((c) => c.slug === category)?.name
    : null
  const activeTag = tag ? tags.find((t) => t.slug === tag)?.name : null

  return (
    <Box>
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
          <Typography variant="body2" color="text.primary">
            Writing
          </Typography>
        </Breadcrumbs>
      </Container>

      {/* Page Header */}
      <Container maxWidth={false} sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 }, pb: { xs: 8, md: 12 }, pt: { xs: 4, md: 8 } }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3rem', md: '4rem', lg: '5rem' },
            fontWeight: 700,
            color: 'text.primary',
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            mb: 3,
          }}
        >
          Writing
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            maxWidth: 600,
          }}
        >
          Articles on a variety of topics—from development and design to
          technology and beyond.
        </Typography>
      </Container>

      {/* Filter Pills */}
      {(categories.length > 0 || tags.length > 0) && (
        <Container maxWidth={false} sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 }, pb: 4 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Chip
              label="All"
              component={Link}
              to="/blog"
              clickable
              variant={!category && !tag ? 'filled' : 'outlined'}
              color={!category && !tag ? 'default' : undefined}
              sx={
                !category && !tag
                  ? {
                      bgcolor: 'text.primary',
                      color: 'background.default',
                      '&:hover': { bgcolor: 'text.primary' },
                    }
                  : {}
              }
            />
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                component={Link}
                to="/blog"
                search={{ category: cat.slug }}
                clickable
                variant={category === cat.slug ? 'filled' : 'outlined'}
                sx={
                  category === cat.slug
                    ? {
                        bgcolor: 'text.primary',
                        color: 'background.default',
                        '&:hover': { bgcolor: 'text.primary' },
                      }
                    : {}
                }
              />
            ))}
          </Box>
        </Container>
      )}

      {/* Active Filter Display */}
      {(activeCategory || activeTag) && (
        <Container maxWidth={false} sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 }, pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Filtered by:{' '}
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
              {activeCategory || activeTag}
            </Box>
            {' · '}
            <MuiLink
              component={Link}
              to="/blog"
              underline="always"
              color="text.secondary"
              sx={{ '&:hover': { color: 'text.primary' } }}
            >
              Clear filter
            </MuiLink>
          </Typography>
        </Container>
      )}

      {/* Articles List */}
      <Container maxWidth={false} sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 } }}>
        {posts.length === 0 ? (
          <Box
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              py: 12,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'action.hover',
                mb: 3,
              }}
            >
              <ArticleIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No articles found
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {activeCategory || activeTag
                ? 'No posts match the selected filter.'
                : 'No articles have been published yet.'}
            </Typography>
            {(activeCategory || activeTag) && (
              <Button
                component={Link}
                to="/blog"
                endIcon={<ArrowForwardIcon />}
              >
                View all articles
              </Button>
            )}
          </Box>
        ) : (
          <Box>
            {posts.map((post) => (
              <Box
                key={post.id}
                component="article"
                sx={{ borderTop: 1, borderColor: 'divider', py: { xs: 6, md: 8 } }}
              >
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, lg: 10 }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      {post.thumbnail_url && (
                        <Box
                          component={Link}
                          to="/blog/$slug"
                          params={{ slug: post.slug }}
                          sx={{
                            flexShrink: 0,
                            display: { xs: 'none', sm: 'block' },
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative',
                              width: { xs: 96, md: 128 },
                              height: { xs: 96, md: 128 },
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
                      )}

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 600, mb: 2 }}
                        >
                          <MuiLink
                            component={Link}
                            to="/blog/$slug"
                            params={{ slug: post.slug }}
                            underline="hover"
                            color="text.primary"
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            {post.title}
                            <ArrowForwardIcon
                              sx={{ fontSize: 20, opacity: 0.6 }}
                            />
                          </MuiLink>
                        </Typography>

                        {post.description && (
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.secondary',
                              lineHeight: 1.6,
                              maxWidth: 600,
                            }}
                          >
                            {post.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  {((post.categories || []).length > 0 ||
                    (post.tags || []).length > 0) && (
                    <Grid
                      size={{ xs: 12, lg: 2 }}
                      sx={{ textAlign: { lg: 'right' } }}
                    >
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
                        keywords
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: { lg: 'flex-end' },
                          gap: 1,
                        }}
                      >
                        {(post.categories || []).map((cat) => (
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
                        {(post.tags || []).map((t) => (
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
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                component="nav"
                aria-label="Pagination"
                sx={{
                  borderTop: 1,
                  borderColor: 'divider',
                  py: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  component={Link}
                  to="/blog"
                  search={{ category, tag, page: page - 1 }}
                  disabled={page <= 1}
                  startIcon={<ChevronLeftIcon />}
                  sx={{ color: 'text.secondary' }}
                >
                  Previous
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {Array.from({ length: totalPages }, (_, i) => {
                    const p = i + 1
                    const show =
                      p === 1 ||
                      p === totalPages ||
                      (p >= page - 1 && p <= page + 1)

                    if (!show) {
                      if (p === 2 || p === totalPages - 1) {
                        return (
                          <Typography
                            key={p}
                            variant="body2"
                            color="text.secondary"
                          >
                            …
                          </Typography>
                        )
                      }
                      return null
                    }

                    return (
                      <Box
                        key={p}
                        component={Link}
                        to="/blog"
                        search={{ category, tag, page: p }}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                          ...(page === p
                            ? {
                                bgcolor: 'text.primary',
                                color: 'background.default',
                              }
                            : {
                                color: 'text.secondary',
                                '&:hover': { color: 'text.primary' },
                              }),
                        }}
                      >
                        {p}
                      </Box>
                    )
                  })}
                </Box>

                <Button
                  component={Link}
                  to="/blog"
                  search={{ category, tag, page: page + 1 }}
                  disabled={page >= totalPages}
                  endIcon={<ChevronRightIcon />}
                  sx={{ color: 'text.secondary' }}
                >
                  Next
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>

      <Box sx={{ height: 64 }} />
    </Box>
  )
}
