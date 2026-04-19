import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { publishedResumeOptions } from '~/queries/resume'
import type { Resume } from '~/types'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import MuiLink from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import LocationOnIcon from '@mui/icons-material/LocationOn'

export const Route = createFileRoute('/_public/resume')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(publishedResumeOptions()),
  component: ResumePage,
  head: () => ({
    meta: [
      { title: 'Resume' },
      {
        name: 'description',
        content:
          'Professional summary, skills, experience, education, awards, and projects.',
      },
    ],
  }),
})

const categoryOrder = [
  'Summary',
  'Skills',
  'Experience',
  'Education',
  'Awards',
  'Projects',
]

const categoryLabels: Record<string, string> = {
  Summary: 'Summary',
  Skills: 'Skills',
  Experience: 'Experience',
  Education: 'Education',
  Awards: 'Awards',
  Projects: 'Projects',
}

function formatDateRange(
  startDate: string | null,
  endDate: string | null,
): string {
  if (!startDate) return ''

  const start = new Date(startDate)
  const startStr = start.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  if (!endDate) return `${startStr} — Present`

  const end = new Date(endDate)
  const endStr = end.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  if (startDate === endDate) return startStr

  return `${startStr} — ${endStr}`
}

function groupByCategory(items: Resume[]): Record<string, Resume[]> {
  const grouped: Record<string, Resume[]> = {}
  items.forEach((item) => {
    if (!grouped[item.category]) {
      grouped[item.category] = []
    }
    grouped[item.category].push(item)
  })
  return grouped
}

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <Box component="section" sx={{ borderTop: 1, borderColor: 'divider' }}>
      <Container 
        maxWidth={false} 
        sx={{
          maxWidth: '1536px',
          px: { xs: 2, sm: 3, lg: 4 }
        }}
      >
        <Grid container columnSpacing={{ xs: 0, lg: 8 }} sx={{ py: { xs: 8, md: 10 }, rowGap: 4 }}>
          <Grid size={{ xs: 12, md: 'auto' }} sx={{ width: { md: 200 } }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: 'text.secondary',
                pt: { md: 0.5 },
                display: 'block',
                textTransform: 'uppercase'
              }}
            >
              {label}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ flex: 1 }}>{children}</Grid>
        </Grid>
      </Container>
    </Box>
  )
}

function ResumeItem({
  item,
  showDate = true,
}: {
  item: Resume
  showDate?: boolean
}) {
  const dateStr = formatDateRange(item.start_date, item.end_date)

  return (
    <Box
      component="article"
      sx={{ py: 3, '&:first-of-type': { pt: 0 }, '&:last-of-type': { pb: 0 } }}
    >
      <Grid container spacing={{ xs: 2, lg: 4 }}>
        {showDate && (
          <Grid size={{ xs: 12, lg: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {dateStr || '—'}
            </Typography>
          </Grid>
        )}
        <Grid size={{ xs: 12, lg: showDate ? 10 : 12 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}
          >
            {item.title}
            {item.subtitle && (
              <Box component="span" sx={{ color: 'text.secondary' }}>
                {' '}
                — {item.subtitle}
              </Box>
            )}
          </Typography>

          {item.place && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                mb: 1.5,
              }}
            >
              <LocationOnIcon
                sx={{ fontSize: 14, color: 'text.secondary', flexShrink: 0 }}
              />
              <Typography variant="body2" color="text.secondary">
                {item.place}
              </Typography>
            </Box>
          )}

          {item.description && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}
            >
              {item.description}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

function SkillItem({ item }: { item: Resume }) {
  return (
    <Box
      component="article"
      sx={{ py: 3, '&:first-of-type': { pt: 0 }, '&:last-of-type': { pb: 0 } }}
    >
      <Grid container spacing={{ xs: 2, lg: 4 }}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {item.title}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, lg: 9 }}>
          {item.subtitle && (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mb: 1 }}
            >
              {item.subtitle}
            </Typography>
          )}
          {item.description && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}
            >
              {item.description}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

function ResumePage() {
  const { data: items } = useSuspenseQuery(publishedResumeOptions())
  const groupedItems = groupByCategory(items)

  const sortedCategories = categoryOrder.filter(
    (cat) => groupedItems[cat]?.length > 0,
  )

  const totalExperience = groupedItems['Experience']?.length || 0
  const totalProjects = groupedItems['Projects']?.length || 0
  const totalAwards = groupedItems['Awards']?.length || 0

  return (
    <Box>
      {/* Breadcrumb */}
      <Container 
        maxWidth={false} 
        sx={{
          maxWidth: '1536px',
          px: { xs: 2, sm: 3, lg: 4 },
          py: 3 
        }}
      >
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
            Resume
          </Typography>
        </Breadcrumbs>
      </Container>

      {/* Page Header */}
      <Container
        maxWidth={false} 
        sx={{
          maxWidth: '1536px',
          px: { xs: 2, sm: 3, lg: 4 },
          pb: { xs: 6, md: 8 }, 
          pt: { xs: 4, md: 6 } 
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2.25rem', md: '3rem', lg: '3.75rem' },
            fontWeight: 700,
            color: 'text.primary',
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            mb: 3,
          }}
        >
          Resume
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 720,
            lineHeight: 1.7,
            mb: 3,
          }}
        >
          15+ years of professional experience building cloud-native web
          applications and enterprise solutions across retail, manufacturing, and
          e-commerce domains.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {totalExperience > 0 && (
            <Typography variant="body2" color="text.secondary">
              {totalExperience} roles
            </Typography>
          )}
          {totalProjects > 0 && (
            <Typography variant="body2" color="text.secondary">
              {totalProjects} projects
            </Typography>
          )}
          {totalAwards > 0 && (
            <Typography variant="body2" color="text.secondary">
              {totalAwards} awards
            </Typography>
          )}
        </Box>
      </Container>

      {/* Category Navigation */}
      {sortedCategories.length > 1 && (
        <Container 
          maxWidth={false} 
          sx={{
            maxWidth: '1536px',
            px: { xs: 2, sm: 3, lg: 4 },
            pb: 4 
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {sortedCategories.map((cat) => (
              <Chip
                key={cat}
                label={categoryLabels[cat] || cat}
                component="a"
                href={`#${cat.toLowerCase()}`}
                clickable
                variant="outlined"
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                  },
                }}
              />
            ))}
          </Box>
        </Container>
      )}

      {/* Content Sections */}
      <Box sx={{ width: '100%' }}>
        {sortedCategories.length === 0 ? (
          <Box
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              py: 12,
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No resume items to display yet.
            </Typography>
          </Box>
        ) : (
          sortedCategories.map((category) => {
            const categoryItems = groupedItems[category]

            return (
              <Box key={category} id={category.toLowerCase()}>
                <Section label={categoryLabels[category] || category}>
                  <Box
                    sx={{
                      '& > article + article': {
                        borderTop: 1,
                        borderColor: 'divider',
                      },
                    }}
                  >
                    {category === 'Skills' || category === 'Summary'
                      ? categoryItems.map((item) => (
                          <SkillItem key={item.id} item={item} />
                        ))
                      : categoryItems.map((item) => (
                          <ResumeItem key={item.id} item={item} />
                        ))}
                  </Box>
                </Section>
              </Box>
            )
          })
        )}
      </Box>

      <Box sx={{ height: 64 }} />
    </Box>
  )
}
