import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { adminPostOptions } from '~/queries/posts'
import { categoriesOptions } from '~/queries/categories'
import { tagsOptions } from '~/queries/tags'
import { PostForm } from '~/components/admin/PostForm'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const Route = createFileRoute('/admin/posts/$id')({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(adminPostOptions(params.id)),
      context.queryClient.ensureQueryData(categoriesOptions()),
      context.queryClient.ensureQueryData(tagsOptions()),
    ])
  },
  component: EditPostPage,
  head: () => ({
    meta: [{ title: 'Edit Post | Admin' }],
  }),
})

function EditPostPage() {
  const { id } = Route.useParams()
  const { data: post } = useSuspenseQuery(adminPostOptions(id))

  if (!post) {
    return (
      <Typography color="error" variant="h6">
        Post not found.
      </Typography>
    )
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Edit Post
      </Typography>
      <PostForm post={post} />
    </Box>
  )
}
