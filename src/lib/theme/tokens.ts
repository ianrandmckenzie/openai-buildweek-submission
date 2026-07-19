export type ColorMode = 'system' | 'light' | 'dark';
export type ResolvedColorMode = 'light' | 'dark';

export interface ThemeTokens {
  '--bg-primary': string;
  '--bg-secondary': string;
  '--bg-elevated': string;
  '--text-main': string;
  '--text-muted': string;
  '--text-inverse': string;
  '--border-custom': string;
  '--accent-primary': string;
  '--accent-secondary': string;
  '--focus-ring': string;
}

export const lightTokens: ThemeTokens = {
  '--bg-primary': '#ffffff', '--bg-secondary': '#f6f7f9', '--bg-elevated': '#ffffff',
  '--text-main': '#17191c', '--text-muted': '#626a73', '--text-inverse': '#ffffff',
  '--border-custom': '#d9dde3', '--accent-primary': '#3457d5', '--accent-secondary': '#e5eaff', '--focus-ring': '#3457d5',
};

export const darkTokens: ThemeTokens = {
  '--bg-primary': '#000000', '--bg-secondary': '#0c111d', '--bg-elevated': '#101727',
  '--text-main': '#edf3ff', '--text-muted': '#8b9bb5', '--text-inverse': '#000000',
  '--border-custom': '#1e3558', '--accent-primary': '#f4f7ff', '--accent-secondary': '#111c31', '--focus-ring': '#8ea9d5',
};

export function tokensForMode(mode: ResolvedColorMode, overrides: Partial<ThemeTokens> = {}): ThemeTokens {
  return { ...(mode === 'dark' ? darkTokens : lightTokens), ...overrides };
}

export function isHexColor(value: string): boolean {
  return /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(value);
}

export function sanitizeTokenOverrides(overrides: Partial<ThemeTokens>): Partial<ThemeTokens> {
  return Object.fromEntries(Object.entries(overrides).filter(([, value]) => typeof value === 'string' && isHexColor(value))) as Partial<ThemeTokens>;
}
