import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { adminResumeOptions } from '~/queries/resume'
import { DataTable } from '~/components/admin/DataTable'
import type { Resume } from '~/types'
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

export const Route = createFileRoute('/admin/resume/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminResumeOptions()),
  component: ResumeListPage,
  head: () => ({
    meta: [{ title: 'Resume | Admin' }],
  }),
})

const col = createColumnHelper<Resume>()

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
      <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 260 }}>
        {info.getValue()}
      </Typography>
    ),
  }),
  col.accessor('category', {
    header: 'Category',
    cell: (info) => <Chip label={info.getValue()} size="small" />,
  }),
  col.accessor('place', {
    header: 'Place',
    cell: (info) => (
      <Typography variant="body2" color="text.secondary">
        {info.getValue() || '—'}
      </Typography>
    ),
  }),
  col.accessor('sort_order', {
    header: 'Order',
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
  col.display({
    id: 'actions',
    header: '',
    cell: (info) => {
      const item = info.row.original
      return (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
          <Tooltip title="Edit">
            <IconButton
              component={Link}
              to="/admin/resume/$id"
              params={{ id: item.id }}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={item.published ? 'Unpublish' : 'Publish'}>
            <IconButton
              size="small"
              onClick={async () => {
                const updateData: any = {
                  published: !item.published,
                  updated_at: serverTimestamp(),
                }
                await updateDoc(doc(db, 'resume', item.id), updateData).catch(console.error)
                router.invalidate()
              }}
            >
              {item.published ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={async () => {
                if (!confirm('Are you sure you want to delete this entry?')) return
                await deleteDoc(doc(db, 'resume', item.id)).catch(console.error)
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

function ResumeListPage() {
  const { data: items } = useSuspenseQuery(adminResumeOptions())
  const router = useRouter()

  async function handleDelete(ids: string[]) {
    const batch = writeBatch(db)
    ids.forEach((id) => batch.delete(doc(db, 'resume', id)))
    await batch.commit()
    router.invalidate()
  }

  async function handlePublish(ids: string[], publish: boolean) {
    const batch = writeBatch(db)
    ids.forEach((id) => {
      batch.update(doc(db, 'resume', id), {
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
          Resume
        </Typography>
        <Button
          component={Link}
          to="/admin/resume/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          New Entry
        </Button>
      </Box>

      <DataTable
        columns={columns(router)}
        data={items}
        searchPlaceholder="Search resume entries…"
        onDelete={handleDelete}
        onPublish={handlePublish}
      />
    </Box>
  )
}
