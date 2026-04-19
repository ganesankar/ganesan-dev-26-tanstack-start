import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from '~/components/public/Navbar'
import { Footer } from '~/components/public/Footer'
import Box from '@mui/material/Box'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
