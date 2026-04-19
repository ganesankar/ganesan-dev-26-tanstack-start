import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getUserFn } from '~/server/functions/auth'
import { AdminSidebar } from '~/components/admin/AdminSidebar'
import Box from '@mui/material/Box'

import { useThemeMode } from '~/theme/ThemeContext'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    const user = await getUserFn()
    if (!user) {
      throw redirect({
        to: '/auth/login',
        search: { redirectTo: location.href },
      })
    }
    return { user }
  },
  component: AdminLayout,
  head: () => ({
    meta: [{ title: 'Admin | Ganesan-Dev-26-Tanstack-Start' }],
  }),
})

function AdminLayout() {
  const { user } = Route.useRouteContext()
  const { mode } = useThemeMode()

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: mode === 'dark' ? '#020617' : '#f8fafc', // slate-950 and slate-50
      }}
    >
      <AdminSidebar userEmail={user.email || ''} />
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: { lg: '256px' },
          p: { xs: 2, sm: 3, lg: 4 },
          transition: 'margin-left 0.3s',
          minWidth: 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
