import { createFileRoute } from '@tanstack/react-router'
import { categoriesOptions } from '~/queries/categories'
import { PortfolioForm } from '~/components/admin/PortfolioForm'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const Route = createFileRoute('/admin/portfolio/new')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(categoriesOptions()),
  component: NewPortfolioPage,
  head: () => ({
    meta: [{ title: 'New Portfolio Item | Admin' }],
  }),
})

function NewPortfolioPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        New Portfolio Item
      </Typography>
      <PortfolioForm />
    </Box>
  )
}
