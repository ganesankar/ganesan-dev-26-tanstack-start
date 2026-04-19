import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { adminPagesOptions } from '~/queries/pages'
import { DataTable } from '~/components/admin/DataTable'
import type { Page } from '~/types'
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

export const Route = createFileRoute('/admin/pages/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminPagesOptions()),
  component: PagesListPage,
  head: () => ({
    meta: [{ title: 'Pages | Admin' }],
  }),
})

const col = createColumnHelper<Page>()

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
  col.accessor('slug', {
    header: 'Slug',
    cell: (info) => (
      <Typography variant="body2" color="text.secondary">
        /{info.getValue()}
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
      const page = info.row.original
      return (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
          <Tooltip title="Edit">
            <IconButton
              component={Link}
              to="/admin/pages/$id"
              params={{ id: page.id }}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={page.published ? 'Unpublish' : 'Publish'}>
            <IconButton
              size="small"
              onClick={async () => {
                const updateData: any = {
                  published: !page.published,
                  updated_at: serverTimestamp(),
                }
                await updateDoc(doc(db, 'pages', page.id), updateData).catch(console.error)
                router.invalidate()
              }}
            >
              {page.published ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={async () => {
                if (!confirm('Are you sure you want to delete this page?')) return
                await deleteDoc(doc(db, 'pages', page.id)).catch(console.error)
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

function PagesListPage() {
  const { data: pages } = useSuspenseQuery(adminPagesOptions())
  const router = useRouter()

  async function handleDelete(ids: string[]) {
    const batch = writeBatch(db)
    ids.forEach((id) => batch.delete(doc(db, 'pages', id)))
    await batch.commit()
    router.invalidate()
  }

  async function handlePublish(ids: string[], publish: boolean) {
    const batch = writeBatch(db)
    ids.forEach((id) => {
      batch.update(doc(db, 'pages', id), {
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
          Pages
        </Typography>
        <Button
          component={Link}
          to="/admin/pages/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          New Page
        </Button>
      </Box>

      <DataTable 
        columns={columns(router)} 
        data={pages} 
        searchPlaceholder="Search pages…" 
        onDelete={handleDelete}
        onPublish={handlePublish}
      />
    </Box>
  )
}
