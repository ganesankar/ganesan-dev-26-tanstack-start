import { Link } from '@tanstack/react-router'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import MuiLink from '@mui/material/Link'
import Divider from '@mui/material/Divider'

const PAGE_LINKS = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Writing', href: '/writing' },
  { label: 'Resume', href: '/resume' },
]

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/ganesandev' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ganesandev' },
  { label: 'X / Twitter', href: 'https://x.com/ganesandev' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            display="block"
            mb={3}
          >
            Navigation
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                what else
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                {PAGE_LINKS.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    to={link.href}
                    underline="hover"
                    color="text.primary"
                    variant="body2"
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                elsewhere
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                {SOCIAL_LINKS.map((link) => (
                  <MuiLink
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="text.primary"
                    variant="body2"
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                contact
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <MuiLink
                  component={Link}
                  to="/contact"
                  underline="hover"
                  color="text.primary"
                  variant="body2"
                >
                  Get in touch
                </MuiLink>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body2" color="text.secondary" textAlign="center">
          &copy; {year} Ganesan K. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}
