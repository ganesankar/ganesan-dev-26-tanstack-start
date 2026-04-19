import { createFileRoute } from '@tanstack/react-router'
import { ResumeForm } from '~/components/admin/ResumeForm'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const Route = createFileRoute('/admin/resume/new')({
  component: NewResumePage,
  head: () => ({
    meta: [{ title: 'New Resume Entry | Admin' }],
  }),
})

function NewResumePage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        New Resume Entry
      </Typography>
      <ResumeForm />
    </Box>
  )
}
