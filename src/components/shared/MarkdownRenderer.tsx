import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Box from '@mui/material/Box'

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <Box
      sx={{
        '& h1': {
          fontSize: '2rem',
          fontWeight: 700,
          lineHeight: 1.2,
          mt: 4,
          mb: 2,
        },
        '& h2': {
          fontSize: '1.5rem',
          fontWeight: 700,
          lineHeight: 1.3,
          mt: 3,
          mb: 1.5,
        },
        '& h3': {
          fontSize: '1.25rem',
          fontWeight: 600,
          lineHeight: 1.4,
          mt: 2.5,
          mb: 1,
        },
        '& h4, & h5, & h6': {
          fontWeight: 600,
          mt: 2,
          mb: 1,
        },
        '& p': {
          lineHeight: 1.7,
          mb: 2,
          color: 'text.primary',
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
          '&:hover': { textDecorationThickness: '2px' },
        },
        '& ul, & ol': {
          pl: 3,
          mb: 2,
          '& li': { mb: 0.5, lineHeight: 1.7 },
        },
        '& blockquote': {
          borderLeft: 3,
          borderColor: 'divider',
          pl: 2,
          py: 0.5,
          my: 2,
          color: 'text.secondary',
          fontStyle: 'italic',
        },
        '& code': {
          fontFamily: '"Fira Code", "Roboto Mono", monospace',
          fontSize: '0.875em',
          bgcolor: 'action.hover',
          px: 0.75,
          py: 0.25,
          borderRadius: 0.5,
        },
        '& pre': {
          bgcolor: 'action.hover',
          p: 2,
          borderRadius: 1,
          overflow: 'auto',
          mb: 2,
          '& code': {
            bgcolor: 'transparent',
            p: 0,
            borderRadius: 0,
          },
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 1,
          my: 2,
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          mb: 2,
          '& th, & td': {
            border: 1,
            borderColor: 'divider',
            px: 2,
            py: 1,
            textAlign: 'left',
          },
          '& th': {
            bgcolor: 'action.hover',
            fontWeight: 600,
          },
        },
        '& hr': {
          border: 'none',
          borderTop: 1,
          borderColor: 'divider',
          my: 3,
        },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </Box>
  )
}
