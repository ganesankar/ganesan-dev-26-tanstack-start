import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { adminPageOptions } from '~/queries/pages'
import { PageForm } from '~/components/admin/PageForm'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const Route = createFileRoute('/admin/pages/$id')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(adminPageOptions(params.id)),
  component: EditPagePage,
  head: () => ({
    meta: [{ title: 'Edit Page | Admin' }],
  }),
})

function EditPagePage() {
  const { id } = Route.useParams()
  const { data: page } = useSuspenseQuery(adminPageOptions(id))

  if (!page) {
    return (
      <Typography color="error" variant="h6">
        Page not found.
      </Typography>
    )
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Edit Page
      </Typography>
      <PageForm page={page} />
    </Box>
  )
}
