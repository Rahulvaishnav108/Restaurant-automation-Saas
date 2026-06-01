export const kdsTheme = {
  colors: {
    bg: {
      body: '#090d16',
      card: 'rgba(15, 23, 42, 0.75)',
      cardHover: 'rgba(15, 23, 42, 0.9)',
      sidebar: 'rgba(9, 13, 22, 0.95)',
      badge: 'rgba(30, 41, 59, 0.8)',
    },
    primary: {
      orange: '#f97316',
      orangeGlow: 'rgba(249, 115, 22, 0.35)',
      orangeSoft: 'rgba(249, 115, 22, 0.1)',
    },
    status: {
      new: {
        text: '#f8fafc',
        border: 'rgba(255, 255, 255, 0.08)',
        shadow: 'rgba(255, 255, 255, 0.01)',
      },
      prep: {
        text: '#f97316',
        border: 'rgba(249, 115, 22, 0.2)',
        shadow: 'rgba(249, 115, 22, 0.04)',
      },
      ready: {
        text: '#10b981',
        border: 'rgba(16, 185, 129, 0.2)',
        shadow: 'rgba(16, 185, 129, 0.04)',
      },
      delayed: {
        text: '#ef4444',
        border: 'rgba(239, 68, 68, 0.2)',
        shadow: 'rgba(239, 68, 68, 0.04)',
      }
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      muted: '#64748b',
    },
    border: {
      light: 'rgba(255, 255, 255, 0.06)',
      strong: 'rgba(255, 255, 255, 0.15)',
    }
  },
  typography: {
    fontBody: "'Inter', sans-serif",
    fontHeading: "'Outfit', 'Inter', sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      title: '2rem',
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    }
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.4)',
    md: '0 8px 24px rgba(0, 0, 0, 0.5)',
    lg: '0 16px 48px rgba(0, 0, 0, 0.6)',
    glow: '0 0 20px rgba(249, 115, 22, 0.15)',
  },
  transitions: {
    default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.15s ease-in-out',
  },
  breakpoints: {
    mobile: '767px',
    tablet: '1024px',
    desktop: '1280px',
  }
};

export type KdsThemeType = typeof kdsTheme;
