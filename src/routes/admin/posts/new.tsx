import { createFileRoute } from '@tanstack/react-router'
import { categoriesOptions } from '~/queries/categories'
import { tagsOptions } from '~/queries/tags'
import { PostForm } from '~/components/admin/PostForm'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const Route = createFileRoute('/admin/posts/new')({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesOptions()),
      context.queryClient.ensureQueryData(tagsOptions()),
    ])
  },
  component: NewPostPage,
  head: () => ({
    meta: [{ title: 'New Post | Admin' }],
  }),
})

function NewPostPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        New Post
      </Typography>
      <PostForm />
    </Box>
  )
}
