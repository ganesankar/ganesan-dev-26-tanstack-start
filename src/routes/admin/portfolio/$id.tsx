import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { adminPortfolioItemOptions } from '~/queries/portfolio'
import { categoriesOptions } from '~/queries/categories'
import { PortfolioForm } from '~/components/admin/PortfolioForm'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const Route = createFileRoute('/admin/portfolio/$id')({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(adminPortfolioItemOptions(params.id)),
      context.queryClient.ensureQueryData(categoriesOptions()),
    ])
  },
  component: EditPortfolioPage,
  head: () => ({
    meta: [{ title: 'Edit Portfolio Item | Admin' }],
  }),
})

function EditPortfolioPage() {
  const { id } = Route.useParams()
  const { data: item } = useSuspenseQuery(adminPortfolioItemOptions(id))

  if (!item) {
    return (
      <Typography color="error" variant="h6">
        Portfolio item not found.
      </Typography>
    )
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Edit Portfolio Item
      </Typography>
      <PortfolioForm item={item} />
    </Box>
  )
}
