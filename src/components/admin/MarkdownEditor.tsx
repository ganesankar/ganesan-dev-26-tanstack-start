import MDEditor from '@uiw/react-md-editor'
import { useThemeMode } from '~/theme/ThemeContext'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
}

export function MarkdownEditor({
  value,
  onChange,
  height = 400,
}: MarkdownEditorProps) {
  const { mode } = useThemeMode()

  return (
    <div data-color-mode={mode === 'system' ? 'auto' : mode}>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        preview="live"
        hideToolbar={false}
        enableScroll={true}
        visibleDragbar={false}
      />
    </div>
  )
}
