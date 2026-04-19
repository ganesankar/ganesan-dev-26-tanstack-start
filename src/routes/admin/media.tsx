import { useState, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db, storage } from '~/lib/firebase/client'
import { adminMediaOptions, mediaKeys } from '~/queries/media'
import { format } from 'date-fns'
import type { Media } from '~/types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardActions from '@mui/material/CardActions'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import LinearProgress from '@mui/material/LinearProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

export const Route = createFileRoute('/admin/media')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminMediaOptions()),
  component: MediaPage,
  head: () => ({
    meta: [{ title: 'Media | Admin' }],
  }),
})

function isImage(fileType: string) {
  return fileType.startsWith('image/')
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function MediaPage() {
  const queryClient = useQueryClient()
  const { data: media } = useSuspenseQuery(adminMediaOptions())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })
  const [previewItem, setPreviewItem] = useState<Media | null>(null)

  const filtered = media.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const storagePath = `media/${Date.now()}-${file.name}`
        const storageRef = ref(storage, storagePath)

        await new Promise<void>((resolve, reject) => {
          const task = uploadBytesResumable(storageRef, file)
          task.on(
            'state_changed',
            (snap) => {
              const pct =
                ((i + snap.bytesTransferred / snap.totalBytes) / files.length) *
                100
              setUploadProgress(pct)
            },
            reject,
            async () => {
              const url = await getDownloadURL(storageRef)
              await addDoc(collection(db, 'media'), {
                filename: file.name,
                file_type: file.type,
                file_size: file.size,
                storage_path: storagePath,
                public_url: url,
                alt_text: null,
                created_at: Timestamp.now(),
              })
              resolve()
            },
          )
        })
      }

      await queryClient.invalidateQueries({ queryKey: mediaKeys.admin() })
      setToast({
        open: true,
        message: `${files.length} file(s) uploaded`,
        severity: 'success',
      })
    } catch (err) {
      setToast({
        open: true,
        message: err instanceof Error ? err.message : 'Upload failed',
        severity: 'error',
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDelete(item: Media) {
    if (!window.confirm(`Delete "${item.filename}"?`)) return
    try {
      await deleteObject(ref(storage, item.storage_path))
      await deleteDoc(doc(db, 'media', item.id))
      await queryClient.invalidateQueries({ queryKey: mediaKeys.admin() })
      setPreviewItem(null)
      setToast({ open: true, message: 'File deleted', severity: 'success' })
    } catch (err) {
      setToast({
        open: true,
        message: err instanceof Error ? err.message : 'Delete failed',
        severity: 'error',
      })
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setToast({ open: true, message: 'URL copied', severity: 'success' })
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Media
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            Upload
          </Button>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v) => v && setView(v)}
            size="small"
          >
            <ToggleButton value="grid">
              <GridViewIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {uploading && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{ mb: 2 }}
        />
      )}

      <TextField
        size="small"
        placeholder="Search files…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, minWidth: 280 }}
      />

      {filtered.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" sx={{ py: 8 }}>
          No media files found.
        </Typography>
      ) : view === 'grid' ? (
        <Grid container spacing={2}>
          {filtered.map((item) => (
            <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <Card
                variant="outlined"
                sx={{ cursor: 'pointer' }}
                onClick={() => setPreviewItem(item)}
              >
                {isImage(item.file_type) ? (
                  <CardMedia
                    component="img"
                    image={item.public_url}
                    alt={item.alt_text || item.filename}
                    sx={{ height: 140, objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 140,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'action.hover',
                    }}
                  >
                    <InsertDriveFileIcon
                      sx={{ fontSize: 48, color: 'text.disabled' }}
                    />
                  </Box>
                )}
                <CardActions sx={{ px: 1.5, py: 1 }}>
                  <Typography variant="caption" noWrap sx={{ flex: 1 }}>
                    {item.filename}
                  </Typography>
                  <Tooltip title="Copy URL">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyUrl(item.public_url)
                      }}
                    >
                      <ContentCopyIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card variant="outlined">
          {filtered.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
                '&:last-child': { borderBottom: 0 },
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={() => setPreviewItem(item)}
            >
              {isImage(item.file_type) ? (
                <Box
                  component="img"
                  src={item.public_url}
                  alt={item.alt_text || item.filename}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InsertDriveFileIcon color="disabled" />
                </Box>
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={500} noWrap>
                  {item.filename}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(item.file_size)} &middot;{' '}
                  {format(new Date(item.created_at), 'MMM d, yyyy')}
                </Typography>
              </Box>
              <Tooltip title="Copy URL">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyUrl(item.public_url)
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(item)
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Card>
      )}

      <Dialog
        open={!!previewItem}
        onClose={() => setPreviewItem(null)}
        maxWidth="sm"
        fullWidth
      >
        {previewItem && (
          <>
            <DialogTitle>{previewItem.filename}</DialogTitle>
            <DialogContent>
              {isImage(previewItem.file_type) ? (
                <Box
                  component="img"
                  src={previewItem.public_url}
                  alt={previewItem.alt_text || previewItem.filename}
                  sx={{ width: '100%', borderRadius: 1 }}
                />
              ) : (
                <Box
                  sx={{
                    py: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InsertDriveFileIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
                </Box>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Type: {previewItem.file_type} &middot; Size:{' '}
                {formatFileSize(previewItem.file_size)} &middot; Uploaded:{' '}
                {format(new Date(previewItem.created_at), 'PPP')}
              </Typography>
              <TextField
                label="Public URL"
                value={previewItem.public_url}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                slotProps={{ input: { readOnly: true } }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                onClick={() => handleDelete(previewItem)}
              >
                Delete
              </Button>
              <Button onClick={() => copyUrl(previewItem.public_url)}>
                Copy URL
              </Button>
              <Button onClick={() => setPreviewItem(null)}>Close</Button>
            </DialogActions>
          </>
        )}
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
