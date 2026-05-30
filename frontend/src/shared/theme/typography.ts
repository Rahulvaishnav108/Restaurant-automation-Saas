export const typographyTheme = {
  // Unified font family across headings, body, buttons, inputs, tables
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  
  // Standard hierarchical sizes matching Admin Dashboard styling
  sizes: {
    h1: 'text-xl font-bold tracking-tight',       // Primary Page Header, e.g. "Dashboard"
    h2: 'text-base font-semibold tracking-tight', // Card Header / Primary Section, e.g. "Active Kitchen Tickets"
    h3: 'text-sm font-semibold tracking-tight',   // Subheaders, e.g. "Smart Auto-Batch Suggestions"
    body: 'text-sm font-normal leading-relaxed',  // Standard descriptions/paragraphs
    label: 'text-xs font-semibold uppercase tracking-wider', // Active Batches headers, small tags
    small: 'text-xs font-normal',                 // Tiny details/descriptions
  },

  // Color palette matching Admin Panel text colors across light and dark modes
  colors: {
    primary: 'text-gray-900 dark:text-white',       // H1, Card titles, Active values
    secondary: 'text-gray-600 dark:text-gray-400',  // Subheadings, instructions, notifications
    muted: 'text-gray-400 dark:text-gray-500',      // Muted time stamps, small labels
  },

  // Direct CSS style objects for absolute overrides
  style: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
    },
    body: {
      fontFamily: "'Inter', sans-serif",
    }
  }
};

export const fontTheme = {
  heading: 'font-sans font-bold tracking-tight',
  body: 'font-sans',
  style: {
    heading: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
    },
    body: {
      fontFamily: "'Inter', sans-serif",
    }
  }
};
