import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
      light: '#818cf8',
      dark: '#3730a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f97316',
      light: '#fb923c',
      dark: '#c2410c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f5fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: 0.2,
    },
  },
  shape: {
    borderRadius: 14,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(15, 23, 42, 0.08)',
    '0px 4px 12px rgba(15, 23, 42, 0.08)',
    '0px 8px 24px rgba(15, 23, 42, 0.08)',
    ...Array(22).fill('0px 8px 24px rgba(15, 23, 42, 0.08)'),
  ],
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          paddingBlock: 10,
        },
        containedPrimary: {
          boxShadow: '0px 10px 30px rgba(79, 70, 229, 0.35)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0px 15px 45px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 10px 30px rgba(79, 70, 229, 0.25)',
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #101827 0%, #1f2937 100%)',
          color: '#e5e7eb',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBlock: 4,
          '&.Mui-selected': {
            background:
              'linear-gradient(120deg, rgba(99,102,241,0.85) 0%, rgba(59,130,246,0.85) 100%)',
            color: '#ffffff',
            '& .MuiListItemIcon-root': {
              color: '#ffffff',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#c7d2fe',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 12px 32px rgba(15, 23, 42, 0.06)',
        },
      },
    },
  },
});

export default theme;







