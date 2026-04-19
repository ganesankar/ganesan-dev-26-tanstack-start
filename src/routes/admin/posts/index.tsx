import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { adminPostsOptions } from '~/queries/posts'
import { DataTable } from '~/components/admin/DataTable'
import type { PostWithRelations } from '~/types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { db } from '~/lib/firebase/client'
import { doc, deleteDoc, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore'
import { useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/posts/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminPostsOptions()),
  component: PostsListPage,
  head: () => ({
    meta: [{ title: 'Posts | Admin' }],
  }),
})

const col = createColumnHelper<PostWithRelations>()

const columns = (router: any) => [
  col.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate' as any) || false}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        size="small"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        size="small"
      />
    ),
  }),
  col.accessor('title', {
    header: 'Title',
    cell: (info) => (
      <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 280 }}>
        {info.getValue()}
      </Typography>
    ),
  }),
  col.accessor('published', {
    header: 'Status',
    cell: (info) => (
      <Chip
        label={info.getValue() ? 'Published' : 'Draft'}
        color={info.getValue() ? 'success' : 'default'}
        size="small"
        variant="outlined"
      />
    ),
  }),
  col.accessor('categories', {
    header: 'Categories',
    enableSorting: false,
    cell: (info) => (
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {info.getValue().map((c) => (
          <Chip key={c.id} label={c.name} size="small" />
        ))}
      </Box>
    ),
  }),
  col.accessor('created_at', {
    header: 'Created',
    cell: (info) => (
      <Typography variant="body2" color="text.secondary">
        {format(new Date(info.getValue()), 'MMM d, yyyy')}
      </Typography>
    ),
  }),
  col.display({
    id: 'actions',
    header: '',
    cell: (info) => {
      const post = info.row.original
      return (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
          <Tooltip title="Edit">
            <IconButton
              component={Link}
              to="/admin/posts/$id"
              params={{ id: post.id }}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={post.published ? 'Unpublish' : 'Publish'}>
            <IconButton
              size="small"
              onClick={async () => {
                const updateData: any = {
                  published: !post.published,
                  updated_at: serverTimestamp(),
                }
                if (!post.published && !post.published_at) {
                  updateData.published_at = serverTimestamp()
                }
                await updateDoc(doc(db, 'posts', post.id), updateData).catch(console.error)
                router.invalidate()
              }}
            >
              {post.published ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={async () => {
                if (!confirm('Are you sure you want to delete this post?')) return
                await deleteDoc(doc(db, 'posts', post.id)).catch(console.error)
                router.invalidate()
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
  }),
]

function PostsListPage() {
  const { data: posts } = useSuspenseQuery(adminPostsOptions())
  const router = useRouter()

  async function handleDelete(ids: string[]) {
    const batch = writeBatch(db)
    ids.forEach((id) => batch.delete(doc(db, 'posts', id)))
    await batch.commit()
    router.invalidate()
  }

  async function handlePublish(ids: string[], publish: boolean) {
    const batch = writeBatch(db)
    ids.forEach((id) => {
      batch.update(doc(db, 'posts', id), {
        published: publish,
        updated_at: serverTimestamp(),
      })
    })
    await batch.commit()
    router.invalidate()
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Posts
        </Typography>
        <Button
          component={Link}
          to="/admin/posts/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          New Post
        </Button>
      </Box>

      <DataTable 
        columns={columns(router)} 
        data={posts} 
        searchPlaceholder="Search posts…" 
        onDelete={handleDelete}
        onPublish={handlePublish}
      />
    </Box>
  )
}
