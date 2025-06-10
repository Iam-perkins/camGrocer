import { themeConfig, ThemeColors, ThemeSpacing, ThemeBorderRadius, ThemeBreakpoints } from './config';

export const getThemeColor = (color: ColorKey, variant: ColorVariant = 'DEFAULT') => {
  return themeConfig.colors[color][variant];
};

export const getThemeSpacing = (spacing: SpacingKey) => {
  return themeConfig.spacing[spacing];
};

export const getThemeBorderRadius = (radius: BorderRadiusKey) => {
  return themeConfig.borderRadius[radius];
};

export const getThemeBreakpoint = (breakpoint: BreakpointKey) => {
  return themeConfig.breakpoints[breakpoint];
};

export const themeClasses = {
  container: {
    base: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    full: 'max-w-full mx-auto px-4 sm:px-6 lg:px-8',
  },
  text: {
    heading: 'font-bold text-2xl sm:text-3xl md:text-4xl',
    subheading: 'font-semibold text-xl sm:text-2xl',
    body: 'text-base sm:text-lg',
    small: 'text-sm sm:text-base',
  },
  button: {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'hover:bg-accent/10',
  },
  card: {
    base: 'bg-background border border-border rounded-lg shadow-sm',
    hover: 'hover:shadow-md transition-shadow',
  },
};

export const themeVars = {
  colors: {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    accent: 'var(--accent)',
    background: 'var(--background)',
    text: 'var(--foreground)',
    border: 'var(--border)',
  },
};
