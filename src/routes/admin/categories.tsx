import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '~/lib/firebase/client'
import { categoriesOptions, categoryKeys } from '~/queries/categories'
import type { Category, CategoryFormData } from '~/types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export const Route = createFileRoute('/admin/categories')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(categoriesOptions()),
  component: CategoriesPage,
  head: () => ({
    meta: [{ title: 'Categories | Admin' }],
  }),
})

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function CategoriesPage() {
  const queryClient = useQueryClient()
  const { data: categories } = useSuspenseQuery(categoriesOptions())

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    thumbnail_url: '',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  function openCreate() {
    setEditing(null)
    setForm({ name: '', slug: '', description: '', thumbnail_url: '' })
    setDialogOpen(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      thumbnail_url: cat.thumbnail_url || '',
    })
    setDialogOpen(true)
  }

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: editing ? prev.slug : slugify(name),
    }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await updateDoc(doc(db, 'categories', editing.id), {
          name: form.name,
          slug: form.slug,
          description: form.description || null,
          thumbnail_url: form.thumbnail_url || null,
        })
        setToast({ open: true, message: 'Category updated', severity: 'success' })
      } else {
        await addDoc(collection(db, 'categories'), {
          name: form.name,
          slug: form.slug,
          description: form.description || null,
          thumbnail_url: form.thumbnail_url || null,
          created_at: Timestamp.now(),
        })
        setToast({ open: true, message: 'Category created', severity: 'success' })
      }
      await queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      setDialogOpen(false)
    } catch (err) {
      setToast({
        open: true,
        message: err instanceof Error ? err.message : 'Save failed',
        severity: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(cat: Category) {
    if (!window.confirm(`Delete "${cat.name}"?`)) return
    try {
      await deleteDoc(doc(db, 'categories', cat.id))
      await queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      setToast({ open: true, message: 'Category deleted', severity: 'success' })
    } catch (err) {
      setToast({
        open: true,
        message: err instanceof Error ? err.message : 'Delete failed',
        severity: 'error',
      })
    }
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
          Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          New Category
        </Button>
      </Box>

      <Card variant="outlined">
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    No categories yet.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {cat.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {cat.slug}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ maxWidth: 300 }}
                      >
                        {cat.description || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => openEdit(cat)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(cat)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editing ? 'Edit Category' : 'New Category'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Slug"
            value={form.slug}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, slug: e.target.value }))
            }
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Thumbnail URL"
            value={form.thumbnail_url}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, thumbnail_url: e.target.value }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !form.name.trim() || !form.slug.trim()}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
