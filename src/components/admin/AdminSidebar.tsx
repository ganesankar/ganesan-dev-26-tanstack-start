import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { signOutFn } from '~/server/functions/auth'
import { useThemeMode } from '~/theme/ThemeContext'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ArticleIcon from '@mui/icons-material/Article'
import DescriptionIcon from '@mui/icons-material/Description'
import WorkIcon from '@mui/icons-material/Work'
import SchoolIcon from '@mui/icons-material/School'
import CategoryIcon from '@mui/icons-material/Category'
import TagIcon from '@mui/icons-material/Tag'
import ImageIcon from '@mui/icons-material/Image'
import MailIcon from '@mui/icons-material/Mail'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

const DRAWER_WIDTH = 256

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: DashboardIcon },
  { label: 'Posts', to: '/admin/posts', icon: ArticleIcon },
  { label: 'Pages', to: '/admin/pages', icon: DescriptionIcon },
  { label: 'Portfolio', to: '/admin/portfolio', icon: WorkIcon },
  { label: 'Resume', to: '/admin/resume', icon: SchoolIcon },
  { label: 'Categories', to: '/admin/categories', icon: CategoryIcon },
  { label: 'Tags', to: '/admin/tags', icon: TagIcon },
  { label: 'Media', to: '/admin/media', icon: ImageIcon },
  { label: 'Messages', to: '/admin/messages', icon: MailIcon },
] as const

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const { mode, setMode } = useThemeMode()

  const pathname = router.state.location.pathname

  function cycleTheme() {
    const next = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'
    setMode(next)
  }

  const themeIcon =
    mode === 'dark' ? (
      <DarkModeIcon fontSize="small" />
    ) : mode === 'light' ? (
      <LightModeIcon fontSize="small" />
    ) : (
      <SettingsBrightnessIcon fontSize="small" />
    )

  async function handleSignOut() {
    await signOutFn()
    window.location.href = '/auth/login'
  }

  function isActive(to: string) {
    const clean = to
    if (clean === '/admin') return pathname === '/admin' || pathname === '/admin/'
    return pathname.startsWith(clean)
  }

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
          Admin
        </Typography>
        <IconButton
          onClick={() => setMobileOpen(false)}
          sx={{ display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ flex: 1, px: 1, py: 1.5 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.to)
          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              selected={active}
              sx={{
                borderRadius: 2,
                mb: 0.25,
                py: 0.75,
                px: 1.5,
                minHeight: 32,
                color: active ? 'text.primary' : 'text.secondary',
                ...(active
                  ? {
                      bgcolor: mode === 'dark' ? '#1e293b' : '#f1f5f9',
                      '&.Mui-selected': {
                        bgcolor: mode === 'dark' ? '#1e293b' : '#f1f5f9',
                        '&:hover': {
                          bgcolor: mode === 'dark' ? '#1e293b' : '#f1f5f9',
                        },
                      },
                    }
                  : {
                      bgcolor: 'transparent',
                      '&:hover': {
                        bgcolor:
                          mode === 'dark'
                            ? 'rgba(30, 41, 59, 0.5)'
                            : '#f8fafc',
                        color: 'text.primary',
                      },
                    }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                <Icon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ my: 0 }}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              />
            </ListItemButton>
          )
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" noWrap>
          {userEmail}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
          <Tooltip title={`Theme: ${mode}`}>
            <IconButton size="small" onClick={cycleTheme}>
              {themeIcon}
            </IconButton>
          </Tooltip>
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Sign out">
            <IconButton size="small" onClick={handleSignOut} color="error">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )

  return (
    <>
      <IconButton
        onClick={() => setMobileOpen(true)}
        sx={{
          display: { lg: 'none' },
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          boxShadow: 1,
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}
