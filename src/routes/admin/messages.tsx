import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '~/lib/firebase/client'
import { adminMessagesOptions, messageKeys } from '~/queries/messages'
import { format } from 'date-fns'
import type { Message } from '~/types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import DeleteIcon from '@mui/icons-material/Delete'
import ReplyIcon from '@mui/icons-material/Reply'
import MailIcon from '@mui/icons-material/Mail'
import DraftsIcon from '@mui/icons-material/Drafts'

export const Route = createFileRoute('/admin/messages')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminMessagesOptions()),
  component: MessagesPage,
  head: () => ({
    meta: [{ title: 'Messages | Admin' }],
  }),
})

function MessagesPage() {
  const queryClient = useQueryClient()
  const { data: messages } = useSuspenseQuery(adminMessagesOptions())

  const [selected, setSelected] = useState<Message | null>(null)
  const [toast, setToast] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  async function markAsRead(msg: Message) {
    if (!msg.read) {
      try {
        await updateDoc(doc(db, 'messages', msg.id), { read: true })
        await queryClient.invalidateQueries({ queryKey: messageKeys.admin() })
      } catch {
        // Silently handle — the message will still display
      }
    }
    setSelected(msg)
  }

  async function handleDelete(msg: Message) {
    if (!window.confirm('Delete this message?')) return
    try {
      await deleteDoc(doc(db, 'messages', msg.id))
      await queryClient.invalidateQueries({ queryKey: messageKeys.admin() })
      setSelected(null)
      setToast({ open: true, message: 'Message deleted', severity: 'success' })
    } catch (err) {
      setToast({
        open: true,
        message: err instanceof Error ? err.message : 'Delete failed',
        severity: 'error',
      })
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Messages
        </Typography>
        {unreadCount > 0 && (
          <Chip
            label={`${unreadCount} unread`}
            color="error"
            size="small"
          />
        )}
      </Box>

      {messages.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" sx={{ py: 8 }}>
          No messages yet.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {messages.map((msg) => (
            <Card
              key={msg.id}
              variant="outlined"
              sx={{
                cursor: 'pointer',
                bgcolor: msg.read ? 'transparent' : 'action.hover',
                '&:hover': { bgcolor: 'action.selected' },
              }}
              onClick={() => markAsRead(msg)}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.5,
                  '&:last-child': { pb: 1.5 },
                }}
              >
                {msg.read ? (
                  <DraftsIcon color="disabled" />
                ) : (
                  <MailIcon color="primary" />
                )}

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={msg.read ? 400 : 700}
                      noWrap
                    >
                      {msg.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      &lt;{msg.email}&gt;
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={msg.read ? 400 : 600}
                    noWrap
                  >
                    {msg.subject || '(no subject)'}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    component="p"
                  >
                    {msg.message}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {format(new Date(msg.created_at), 'MMM d, yyyy')}
                </Typography>

                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(msg)
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
      >
        {selected && (
          <>
            <DialogTitle>
              {selected.subject || '(no subject)'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {selected.name} &lt;{selected.email}&gt;
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(selected.created_at), 'PPP p')}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="body1"
                sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}
              >
                {selected.message}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(selected)}
              >
                Delete
              </Button>
              <Button
                startIcon={<ReplyIcon />}
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`}
              >
                Reply
              </Button>
              <Button onClick={() => setSelected(null)}>Close</Button>
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
