import { createFileRoute } from '@tanstack/react-router'
import { PageForm } from '~/components/admin/PageForm'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const Route = createFileRoute('/admin/pages/new')({
  component: NewPagePage,
  head: () => ({
    meta: [{ title: 'New Page | Admin' }],
  }),
})

function NewPagePage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        New Page
      </Typography>
      <PageForm />
    </Box>
  )
}
