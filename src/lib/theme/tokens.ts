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
  '--border-custom': '#d1d5db', '--accent-primary': '#1f2937', '--accent-secondary': '#f1f5f9', '--focus-ring': '#475569',
};

export const darkTokens: ThemeTokens = {
  '--bg-primary': '#000000', '--bg-secondary': '#0c111d', '--bg-elevated': '#101727',
  '--text-main': '#edf3ff', '--text-muted': '#8b9bb5', '--text-inverse': '#000000',
  '--border-custom': '#334155', '--accent-primary': '#f8fafc', '--accent-secondary': '#1e293b', '--focus-ring': '#94a3b8',
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
