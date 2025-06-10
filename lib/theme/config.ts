export const themeConfig = {
  colors: {
    primary: {
      light: '#FF6B6B',
      DEFAULT: '#FF3D3D',
      dark: '#C51111',
    },
    secondary: {
      light: '#4CAF50',
      DEFAULT: '#2E7D32',
      dark: '#1B5E20',
    },
    accent: {
      light: '#2196F3',
      DEFAULT: '#1976D2',
      dark: '#0D47A1',
    },
    background: {
      light: '#FFFFFF',
      DEFAULT: '#F5F5F5',
      dark: '#121212',
    },
    text: {
      light: '#1A1A1A',
      DEFAULT: '#333333',
      dark: '#FFFFFF',
    },
    border: {
      light: '#E0E0E0',
      DEFAULT: '#BDBDBD',
      dark: '#424242',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export type ColorVariant = keyof typeof themeConfig.colors.primary;
export type ColorKey = keyof typeof themeConfig.colors;
export type SpacingKey = keyof typeof themeConfig.spacing;
export type BorderRadiusKey = keyof typeof themeConfig.borderRadius;
export type BreakpointKey = keyof typeof themeConfig.breakpoints;

export type ThemeColors = typeof themeConfig.colors;
export type ThemeSpacing = typeof themeConfig.spacing;
export type ThemeBorderRadius = typeof themeConfig.borderRadius;
export type ThemeBreakpoints = typeof themeConfig.breakpoints;
