import { createTheme, ThemeOptions } from '@mui/material/styles';

// Brand colors configuration
export interface BrandColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
}

export const defaultBrandColors: BrandColors = {
  primary: '#e50914',
  primaryHover: '#b8070f',
  secondary: '#1a1a1a',
  background: '#0f0f0f',
  surface: '#1a1a1a',
  text: '#ffffff',
  textSecondary: '#cccccc',
  textMuted: '#888888',
  accent: '#ffd700',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  border: 'rgba(255,255,255,0.1)',
};

// Theme variants
export const themeVariants = {
  default: defaultBrandColors,
  dark: {
    ...defaultBrandColors,
    background: '#000000',
    surface: '#111111',
  },
  blue: {
    ...defaultBrandColors,
    primary: '#007bff',
    primaryHover: '#0056b3',
  },
  purple: {
    ...defaultBrandColors,
    primary: '#6f42c1',
    primaryHover: '#5a2d91',
  },
  green: {
    ...defaultBrandColors,
    primary: '#28a745',
    primaryHover: '#1e7e34',
  },
};

export function createAppTheme(colors: BrandColors = defaultBrandColors) {
  const themeOptions: ThemeOptions = {
    palette: {
      mode: 'dark',
      primary: {
        main: colors.primary,
        dark: colors.primaryHover,
        contrastText: '#ffffff',
      },
      secondary: {
        main: colors.secondary,
        contrastText: '#ffffff',
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.text,
        secondary: colors.textSecondary,
        disabled: colors.textMuted,
      },
      error: {
        main: colors.error,
      },
      warning: {
        main: colors.warning,
      },
      success: {
        main: colors.success,
      },
      divider: colors.border,
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: colors.background,
            color: colors.text,
            scrollbarWidth: 'thin',
            scrollbarColor: `${colors.primary} ${colors.surface}`,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: colors.surface,
            },
            '&::-webkit-scrollbar-thumb': {
              background: colors.primary,
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: colors.primaryHover,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255,255,255,0.05)',
              '& fieldset': {
                borderColor: colors.border,
              },
              '&:hover fieldset': {
                borderColor: colors.primary,
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary,
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${colors.border}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: `${colors.primary}20`,
            color: colors.primary,
            border: `1px solid ${colors.primary}40`,
            '&:hover': {
              backgroundColor: `${colors.primary}30`,
            },
          },
        },
      },
      MuiRating: {
        styleOverrides: {
          root: {
            color: colors.accent,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            backgroundColor: colors.border,
            '& .MuiLinearProgress-bar': {
              backgroundColor: colors.primary,
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            color: colors.primary,
            '& .MuiSlider-thumb': {
              backgroundColor: colors.primary,
              '&:hover': {
                boxShadow: `0 0 0 8px ${colors.primary}20`,
              },
            },
            '& .MuiSlider-track': {
              backgroundColor: colors.primary,
            },
            '& .MuiSlider-rail': {
              backgroundColor: colors.border,
            },
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
}

export const defaultTheme = createAppTheme();