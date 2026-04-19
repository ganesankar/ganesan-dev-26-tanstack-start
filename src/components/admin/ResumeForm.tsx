import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '~/lib/firebase/client'
import { resumeKeys } from '~/queries/resume'
import type { Resume, ResumeFormData } from '~/types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import SaveIcon from '@mui/icons-material/Save'

interface ResumeFormProps {
  item?: Resume
}

const RESUME_CATEGORIES = [
  'Experience',
  'Education',
  'Certification',
  'Award',
  'Skill',
  'Other',
]

export function ResumeForm({ item }: ResumeFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [form, setForm] = useState<ResumeFormData>({
    title: item?.title ?? '',
    subtitle: item?.subtitle ?? '',
    category: item?.category ?? 'Experience',
    place: item?.place ?? '',
    description: item?.description ?? '',
    start_date: item?.start_date ?? '',
    end_date: item?.end_date ?? '',
    published: item?.published ?? false,
    sort_order: item?.sort_order ?? 0,
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)

    const payload = {
      title: form.title,
      subtitle: form.subtitle || null,
      category: form.category,
      place: form.place || null,
      description: form.description || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      published: form.published,
      sort_order: form.sort_order,
      updated_at: Timestamp.now(),
    }

    try {
      if (item) {
        await updateDoc(doc(db, 'resume', item.id), payload)
        setToast({ open: true, message: 'Resume entry updated', severity: 'success' })
      } else {
        await addDoc(collection(db, 'resume'), {
          ...payload,
          created_at: Timestamp.now(),
        })
        setToast({ open: true, message: 'Resume entry created', severity: 'success' })
      }
      await queryClient.invalidateQueries({ queryKey: resumeKeys.all })
      setTimeout(() => navigate({ to: '/admin/resume' }), 600)
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
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                fullWidth
                required
              />
              <TextField
                label="Subtitle"
                value={form.subtitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                fullWidth
                placeholder="e.g., Senior Developer"
              />
              <TextField
                label="Place"
                value={form.place}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, place: e.target.value }))
                }
                fullWidth
                placeholder="e.g., Company Name, City"
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                fullWidth
                multiline
                rows={6}
              />
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
                label="Category"
                select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                fullWidth
              >
                {RESUME_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Start Date"
                value={form.start_date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, start_date: e.target.value }))
                }
                fullWidth
                placeholder="e.g., Jan 2020"
              />
              <TextField
                label="End Date"
                value={form.end_date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, end_date: e.target.value }))
                }
                fullWidth
                placeholder="e.g., Present"
              />

              <TextField
                label="Sort Order"
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    sort_order: parseInt(e.target.value) || 0,
                  }))
                }
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={saving}
                startIcon={<SaveIcon />}
              >
                {saving ? 'Saving…' : item ? 'Update Entry' : 'Create Entry'}
              </Button>
            </CardContent>
          </Card>

          {item && (
            <Card variant="outlined" sx={{ mt: 3 }}>
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
