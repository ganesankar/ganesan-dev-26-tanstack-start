import { createTheme, type ThemeOptions } from '@mui/material/styles'

const sharedTypography: ThemeOptions['typography'] = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  htmlFontSize: 16,
  h1: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 },
  h2: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 },
  h3: { fontWeight: 600, lineHeight: 1.3 },
  h4: { fontWeight: 600, lineHeight: 1.4 },
  h5: { fontWeight: 600, lineHeight: 1.5 },
  h6: { fontWeight: 600, lineHeight: 1.5 },
  subtitle1: { fontWeight: 500 },
  subtitle2: { fontWeight: 500, fontSize: '0.875rem' },
  body1: { lineHeight: 1.7 },
  body2: { fontSize: '0.875rem', lineHeight: 1.6 },
  button: { textTransform: 'none', fontWeight: 500 },
  overline: {
    fontWeight: 600,
    fontSize: '0.75rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
  },
}

const sharedComponents: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: 8 },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
  MuiCard: {
    styleOverrides: {
      root: { borderRadius: 12 },
    },
    defaultProps: {
      variant: 'outlined',
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 9999 },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: 12 },
    },
  },
  MuiContainer: {
    styleOverrides: {
      maxWidthLg: {
        maxWidth: '1536px !important',
      },
    },
  },
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1a1a1a' },
    secondary: { main: '#6b7280' },
    error: { main: '#dc2626' },
    warning: { main: '#d97706' },
    info: { main: '#2563eb' },
    success: { main: '#16a34a' },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0a0a0a',
      secondary: '#6b7280',
    },
    divider: '#e5e7eb',
  },
  typography: sharedTypography,
  shape: { borderRadius: 10 },
  components: {
    ...sharedComponents,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#0a0a0a',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#e5e5e5' },
    secondary: { main: '#9ca3af' },
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    info: { main: '#3b82f6' },
    success: { main: '#22c55e' },
    background: {
      default: '#0a0a0a',
      paper: '#171717',
    },
    text: {
      primary: '#fafafa',
      secondary: '#9ca3af',
    },
    divider: 'rgba(255,255,255,0.1)',
  },
  typography: sharedTypography,
  shape: { borderRadius: 10 },
  components: {
    ...sharedComponents,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0a0a0a',
          color: '#fafafa',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
  },
})
