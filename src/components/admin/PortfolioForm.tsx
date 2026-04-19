import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { MarkdownEditor } from '~/components/admin/MarkdownEditor'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '~/lib/firebase/client'
import { categoriesOptions } from '~/queries/categories'
import { portfolioKeys } from '~/queries/portfolio'
import type { PortfolioWithCategories, PortfolioFormData } from '~/types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import SaveIcon from '@mui/icons-material/Save'

interface PortfolioFormProps {
  item?: PortfolioWithCategories & { category_ids: string[] }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function PortfolioForm({ item }: PortfolioFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: categories } = useSuspenseQuery(categoriesOptions())

  const [form, setForm] = useState<PortfolioFormData>({
    title: item?.title ?? '',
    slug: item?.slug ?? '',
    description: item?.description ?? '',
    content: item?.content ?? '',
    thumbnail_url: item?.thumbnail_url ?? '',
    project_url: item?.project_url ?? '',
    category_ids: item?.category_ids ?? [],
    published: item?.published ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: item ? prev.slug : slugify(title),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.slug.trim()) return
    setSaving(true)

    const selectedCategories = categories.filter((c) =>
      form.category_ids.includes(c.id),
    )

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description || null,
      content: form.content,
      thumbnail_url: form.thumbnail_url || null,
      project_url: form.project_url || null,
      categories: selectedCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })),
      published: form.published,
      updated_at: Timestamp.now(),
      ...(form.published && !item?.published_at
        ? { published_at: Timestamp.now() }
        : {}),
    }

    try {
      if (item) {
        await updateDoc(doc(db, 'portfolio', item.id), payload)
        setToast({ open: true, message: 'Portfolio item updated', severity: 'success' })
      } else {
        await addDoc(collection(db, 'portfolio'), {
          ...payload,
          created_at: Timestamp.now(),
          published_at: form.published ? Timestamp.now() : null,
        })
        setToast({ open: true, message: 'Portfolio item created', severity: 'success' })
      }
      await queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
      setTimeout(() => navigate({ to: '/admin/portfolio' }), 600)
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

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined">
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Title"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Content
                </Typography>
                <MarkdownEditor
                  value={form.content}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, content: val }))
                  }
                  height={500}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.published}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        published: e.target.checked,
                      }))
                    }
                  />
                }
                label="Published"
              />

              <TextField
                label="Thumbnail URL"
                value={form.thumbnail_url}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    thumbnail_url: e.target.value,
                  }))
                }
                fullWidth
              />

              <TextField
                label="Project URL"
                value={form.project_url}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    project_url: e.target.value,
                  }))
                }
                fullWidth
              />

              <Autocomplete
                multiple
                options={categories}
                getOptionLabel={(o) => o.name}
                value={categories.filter((c) =>
                  form.category_ids.includes(c.id),
                )}
                onChange={(_, val) =>
                  setForm((prev) => ({
                    ...prev,
                    category_ids: val.map((v) => v.id),
                  }))
                }
                renderTags={(val, getTagProps) =>
                  val.map((option, index) => (
                    <Chip
                      label={option.name}
                      size="small"
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Categories" />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={saving}
                startIcon={<SaveIcon />}
              >
                {saving ? 'Saving…' : item ? 'Update Item' : 'Create Item'}
              </Button>
            </CardContent>
          </Card>

          {item && (
            <Card variant="outlined">
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={0.5}>Info</Typography>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">Created:</Typography>
                  <Typography variant="body2">{new Date(item.created_at).toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">Updated:</Typography>
                  <Typography variant="body2">{new Date(item.updated_at).toLocaleString()}</Typography>
                </Box>
                {item.published_at && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">Published:</Typography>
                    <Typography variant="body2">{new Date(item.published_at).toLocaleString()}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

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
