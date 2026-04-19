import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useThemeMode } from '~/theme/ThemeContext'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

const NAV_ITEMS = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Writing', href: '/blog' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
] as const

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { resolvedMode, setMode } = useThemeMode()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  function toggleTheme() {
    setMode(resolvedMode === 'dark' ? 'light' : 'dark')
  }

  function isActive(href: string) {
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
        elevation={0}
      >
        <Container 
          maxWidth={false} 
          sx={{
            maxWidth: '1536px',
            px: { xs: 2, sm: 3, lg: 4 }
          }}
        >
          <Toolbar disableGutters sx={{ height: 64, justifyContent: 'space-between' }}>
            <Typography
              component={Link}
              to="/"
              sx={{
                fontSize: '1rem',
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px'
                }
              }}
            >
              Ganesan Karuppaiya
            </Typography>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 4, // equivalent to gap-8 (32px)
              }}
            >
              {NAV_ITEMS.map((item) => (
                <Typography
                  key={item.href}
                  component={Link}
                  to={item.href}
                  sx={{
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: isActive(item.href)
                      ? 'text.primary'
                      : 'text.secondary',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                >
                  {item.label}
                </Typography>
              ))}

              <IconButton
                onClick={toggleTheme}
                color="inherit"
                sx={{ ml: 1, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                aria-label="Toggle theme"
              >
                {resolvedMode === 'dark' ? (
                  <LightModeIcon fontSize="small" />
                ) : (
                  <DarkModeIcon fontSize="small" />
                )}
              </IconButton>
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0.5 }}>
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                aria-label="Toggle theme"
              >
                {resolvedMode === 'dark' ? (
                  <LightModeIcon fontSize="small" />
                ) : (
                  <DarkModeIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                color="inherit"
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: '100%', maxWidth: 360 },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ px: 2 }}>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              to={item.href}
              onClick={() => setDrawerOpen(false)}
              selected={isActive(item.href)}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive(item.href) ? 600 : 400,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  )
}
