import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { dashboardStatsOptions } from '~/queries/dashboard'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import ArticleIcon from '@mui/icons-material/Article'
import DescriptionIcon from '@mui/icons-material/Description'
import WorkIcon from '@mui/icons-material/Work'
import MailIcon from '@mui/icons-material/Mail'
import ImageIcon from '@mui/icons-material/Image'
import AddIcon from '@mui/icons-material/Add'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CircleIcon from '@mui/icons-material/Circle'

export const Route = createFileRoute('/admin/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(dashboardStatsOptions()),
  component: DashboardPage,
  head: () => ({
    meta: [{ title: 'Dashboard | Admin' }],
  }),
})

const STAT_CARDS = [
  { key: 'posts', label: 'Posts', description: 'Total blog posts', icon: ArticleIcon, color: '#2563eb', bg: '#eff6ff' },
  { key: 'pages', label: 'Pages', description: 'Total pages', icon: DescriptionIcon, color: '#16a34a', bg: '#f0fdf4' },
  { key: 'portfolio', label: 'Portfolio', description: 'Portfolio items', icon: WorkIcon, color: '#9333ea', bg: '#faf5ff' },
  {
    key: 'unreadMessages',
    label: 'Messages',
    description: 'Unread messages',
    icon: MailIcon,
    color: '#ea580c',
    bg: '#fff7ed',
  },
  { key: 'media', label: 'Media', description: 'Uploaded files', icon: ImageIcon, color: '#db2777', bg: '#fdf2f8' },
] as const

function DashboardPage() {
  const { data: stats } = useSuspenseQuery(dashboardStatsOptions())

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Welcome to your content management dashboard
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          const value = stats[card.key]
          return (
            <Grid key={card.key} size={{ xs: 12, sm: 6, lg: 4, xl: 2.4 }}>
              <Card 
                variant="outlined" 
                component={Link}
                to={`/admin/${card.key === 'unreadMessages' ? 'messages' : card.key}`}
                sx={{ 
                  borderRadius: 2, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  textDecoration: 'none',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: 1
                  }
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" fontWeight={500} color="text.secondary">
                      {card.label}
                    </Typography>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: card.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ color: card.color, fontSize: 16 }} />
                    </Box>
                  </Box>
                  <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ mb: 0.5, fontSize: '1.5rem' }}>
                    {value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create new content quickly
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  component={Link}
                  to="/admin/posts/new"
                  variant="contained"
                  startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', py: 1 }}
                  disableElevation
                >
                  New Post
                </Button>
                <Button
                  component={Link}
                  to="/admin/pages/new"
                  variant="outlined"
                  color="inherit"
                  startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', py: 1, borderColor: 'divider' }}
                >
                  New Page
                </Button>
                <Button
                  component={Link}
                  to="/admin/portfolio/new"
                  variant="outlined"
                  color="inherit"
                  startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', py: 1, borderColor: 'divider' }}
                >
                  New Portfolio Item
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Your latest content
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                No recent activity. Start by creating your first post!
              </Typography>
              <Button
                component={Link}
                to="/admin/posts"
                variant="text"
                color="primary"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                sx={{ textTransform: 'none', p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
              >
                View all posts
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Getting Started
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Set up your blog
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircleIcon sx={{ fontSize: 8, color: 'success.main' }} />
                  <Typography variant="body2" color="text.secondary">Create categories</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircleIcon sx={{ fontSize: 8, color: 'text.disabled' }} />
                  <Typography variant="body2" color="text.secondary">Write your first post</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircleIcon sx={{ fontSize: 8, color: 'text.disabled' }} />
                  <Typography variant="body2" color="text.secondary">Upload media</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircleIcon sx={{ fontSize: 8, color: 'text.disabled' }} />
                  <Typography variant="body2" color="text.secondary">Create an About page</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

