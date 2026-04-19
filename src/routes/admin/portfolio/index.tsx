import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { adminPortfolioOptions } from '~/queries/portfolio'
import { DataTable } from '~/components/admin/DataTable'
import type { PortfolioWithCategories } from '~/types'
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

export const Route = createFileRoute('/admin/portfolio/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminPortfolioOptions()),
  component: PortfolioListPage,
  head: () => ({
    meta: [{ title: 'Portfolio | Admin' }],
  }),
})

const col = createColumnHelper<PortfolioWithCategories>()

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
  col.accessor('project_url', {
    header: 'URL',
    cell: (info) => {
      const url = info.getValue()
      if (!url) return '—'
      return (
        <Typography
          variant="body2"
          component="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          noWrap
          sx={{ maxWidth: 160, display: 'block', textDecoration: 'none' }}
        >
          {new URL(url).hostname}
        </Typography>
      )
    },
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
      const item = info.row.original
      return (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
          <Tooltip title="Edit">
            <IconButton
              component={Link}
              to="/admin/portfolio/$id"
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
                await updateDoc(doc(db, 'portfolio', item.id), updateData).catch(console.error)
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
                if (!confirm('Are you sure you want to delete this item?')) return
                await deleteDoc(doc(db, 'portfolio', item.id)).catch(console.error)
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

function PortfolioListPage() {
  const { data: items } = useSuspenseQuery(adminPortfolioOptions())
  const router = useRouter()

  async function handleDelete(ids: string[]) {
    const batch = writeBatch(db)
    ids.forEach((id) => batch.delete(doc(db, 'portfolio', id)))
    await batch.commit()
    router.invalidate()
  }

  async function handlePublish(ids: string[], publish: boolean) {
    const batch = writeBatch(db)
    ids.forEach((id) => {
      batch.update(doc(db, 'portfolio', id), {
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
          Portfolio
        </Typography>
        <Button
          component={Link}
          to="/admin/portfolio/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          New Item
        </Button>
      </Box>

      <DataTable
        columns={columns(router)}
        data={items}
        searchPlaceholder="Search portfolio…"
        onDelete={handleDelete}
        onPublish={handlePublish}
      />
    </Box>
  )
}
