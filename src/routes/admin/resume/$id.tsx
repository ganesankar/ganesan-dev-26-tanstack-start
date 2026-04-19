import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { adminResumeItemOptions } from '~/queries/resume'
import { ResumeForm } from '~/components/admin/ResumeForm'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const Route = createFileRoute('/admin/resume/$id')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(adminResumeItemOptions(params.id)),
  component: EditResumePage,
  head: () => ({
    meta: [{ title: 'Edit Resume Entry | Admin' }],
  }),
})

function EditResumePage() {
  const { id } = Route.useParams()
  const { data: item } = useSuspenseQuery(adminResumeItemOptions(id))

  if (!item) {
    return (
      <Typography color="error" variant="h6">
        Resume entry not found.
      </Typography>
    )
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Edit Resume Entry
      </Typography>
      <ResumeForm item={item} />
    </Box>
  )
}
