import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultThemeConfiguration, resolveColorMode, ThemeController, THEME_SETTING_KEY } from '../src/lib/theme/theme';
import { darkTokens, lightTokens, sanitizeTokenOverrides, tokensForMode } from '../src/lib/theme/tokens';

describe('theme tokens', () => {
  it('provides readable inverse text for accent buttons in both modes', () => { expect(lightTokens['--text-inverse']).toBe('#ffffff'); expect(darkTokens['--text-inverse']).toBe('#000000'); });
  it('maps light and dark modes to complete token sets', () => { expect(tokensForMode('light')).toEqual(lightTokens); expect(tokensForMode('dark')).toEqual(darkTokens); });
  it('resolves system mode from appearance preference', () => { expect(resolveColorMode('system', true)).toBe('dark'); expect(resolveColorMode('system', false)).toBe('light'); expect(resolveColorMode('dark', false)).toBe('dark'); });
  it('filters invalid custom token values', () => { expect(sanitizeTokenOverrides({ '--accent-primary': '#abc', '--text-main': 'red' })).toEqual({ '--accent-primary': '#abc' }); });
  it('uses neutral slate accents instead of blue or indigo in light mode', () => {
    expect(lightTokens['--accent-primary']).toBe('#1f2937');
    expect(lightTokens['--accent-secondary']).toBe('#f1f5f9');
    expect(lightTokens['--focus-ring']).toBe('#475569');
  });
});

describe('theme controller', () => {
  beforeEach(() => { document.documentElement.removeAttribute('data-theme'); document.documentElement.removeAttribute('style'); });
  it('applies mode and CSS variables to the document root', async () => { const controller = new ThemeController(); await controller.setMode('dark'); expect(document.documentElement.dataset.theme).toBe('dark'); expect(document.documentElement.style.getPropertyValue('--bg-primary')).toBe(darkTokens['--bg-primary']); controller.destroy(); });
  it('loads and persists settings through storage', async () => { const storage = { get: vi.fn().mockResolvedValue(undefined), create: vi.fn().mockResolvedValue(undefined), update: vi.fn() } as any; const controller = new ThemeController(storage); expect(await controller.load()).toEqual(defaultThemeConfiguration); await controller.setMode('light'); expect(storage.create).toHaveBeenCalledWith('settings', expect.objectContaining({ id: THEME_SETTING_KEY, value: expect.objectContaining({ mode: 'light' }) })); controller.destroy(); });
  it('reacts to system appearance changes', () => { const listeners: Array<(event: MediaQueryListEvent) => void> = []; vi.stubGlobal('window', { matchMedia: vi.fn(() => ({ matches: false, addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => listeners.push(listener), removeEventListener: vi.fn() })) }); const controller = new ThemeController(); expect(document.documentElement.dataset.theme).toBe('light'); (window.matchMedia('(prefers-color-scheme: dark)').matches as unknown as boolean); controller.destroy(); });
});
