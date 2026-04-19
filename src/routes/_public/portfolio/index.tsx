import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { publishedPortfolioOptions } from '~/queries/portfolio'
import { categoriesOptions } from '~/queries/categories'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import MuiLink from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import WorkIcon from '@mui/icons-material/Work'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const portfolioSearchSchema = z.object({
  category: z.string().optional(),
  page: z.coerce.number().optional(),
})

export const Route = createFileRoute('/_public/portfolio/')({
  validateSearch: portfolioSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    const { category, page } = deps
    return Promise.all([
      context.queryClient.ensureQueryData(
        publishedPortfolioOptions({ category, page }),
      ),
      context.queryClient.ensureQueryData(categoriesOptions()),
    ])
  },
  component: PortfolioListPage,
  head: () => ({
    meta: [
      { title: 'Portfolio' },
      {
        name: 'description',
        content: 'A collection of projects showcasing my work',
      },
    ],
  }),
})

function PortfolioListPage() {
  const { category, page = 1 } = Route.useSearch()
  const { data: portfolioData } = useSuspenseQuery(
    publishedPortfolioOptions({ category, page }),
  )
  const { data: categories } = useSuspenseQuery(categoriesOptions())

  const { data: portfolio, totalPages } = portfolioData

  const activeCategory = category
    ? categories.find((c) => c.slug === category)?.name
    : null

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
            Portfolio
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
          Portfolio
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            maxWidth: 600,
          }}
        >
          A collection of projects showcasing my work—from web applications and
          design systems to creative experiments.
        </Typography>
      </Container>

      {/* Filter Pills */}
      {categories.length > 0 && (
        <Container maxWidth={false} sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 }, pb: 4 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Chip
              label="All"
              component={Link}
              to="/portfolio"
              clickable
              variant={!category ? 'filled' : 'outlined'}
              sx={
                !category
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
                to="/portfolio"
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
      {activeCategory && (
        <Container maxWidth={false} sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 }, pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Filtered by:{' '}
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
              {activeCategory}
            </Box>
            {' · '}
            <MuiLink
              component={Link}
              to="/portfolio"
              underline="always"
              color="text.secondary"
              sx={{ '&:hover': { color: 'text.primary' } }}
            >
              Clear filter
            </MuiLink>
          </Typography>
        </Container>
      )}

      {/* Projects List */}
      <Container maxWidth={false} sx={{ maxWidth: '1536px', px: { xs: 2, sm: 3, lg: 4 } }}>
        {portfolio.length === 0 ? (
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
              <WorkIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No projects found
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {activeCategory
                ? 'No projects match the selected category.'
                : 'No projects have been published yet.'}
            </Typography>
            {activeCategory && (
              <Button
                component={Link}
                to="/portfolio"
                endIcon={<ArrowForwardIcon />}
              >
                View all projects
              </Button>
            )}
          </Box>
        ) : (
          <Box>
            {portfolio.map((item) => (
              <Box
                key={item.id}
                component="article"
                sx={{ borderTop: 1, borderColor: 'divider', py: { xs: 6, md: 8 } }}
              >
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, lg: 10 }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      {item.thumbnail_url && (
                        <Box
                          component={Link}
                          to="/portfolio/$slug"
                          params={{ slug: item.slug }}
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
                              src={item.thumbnail_url}
                              alt={item.title}
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
                          sx={{ fontWeight: 600, mb: 1.5 }}
                        >
                          <MuiLink
                            component={Link}
                            to="/portfolio/$slug"
                            params={{ slug: item.slug }}
                            underline="hover"
                            color="text.primary"
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            {item.title}
                            <ArrowForwardIcon
                              sx={{ fontSize: 20, opacity: 0.6 }}
                            />
                          </MuiLink>
                          {item.project_url && (
                            <IconButton
                              component="a"
                              href={item.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{
                                ml: 1,
                                color: 'text.secondary',
                                '&:hover': { color: 'text.primary' },
                              }}
                              title="Visit live project"
                            >
                              <OpenInNewIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          )}
                        </Typography>

                        {item.description && (
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.secondary',
                              lineHeight: 1.6,
                              maxWidth: 600,
                            }}
                          >
                            {item.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  {(item.categories || []).length > 0 && (
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
                        category
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: { lg: 'flex-end' },
                          gap: 1,
                        }}
                      >
                        {(item.categories || []).map((cat) => (
                          <MuiLink
                            key={cat.id}
                            component={Link}
                            to="/portfolio"
                            search={{ category: cat.slug }}
                            variant="body2"
                            color="text.secondary"
                            underline="hover"
                            sx={{ '&:hover': { color: 'text.primary' } }}
                          >
                            {cat.name}
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
                  to="/portfolio"
                  search={{ category, page: page - 1 }}
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
                        to="/portfolio"
                        search={{ category, page: p }}
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
                  to="/portfolio"
                  search={{ category, page: page + 1 }}
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
