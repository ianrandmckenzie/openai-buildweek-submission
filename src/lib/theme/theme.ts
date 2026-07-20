import { writable, get, type Readable } from 'svelte/store';
import type { Storage } from '../storage/idb';
import type { Setting } from '../storage/models';
import { sanitizeTokenOverrides, tokensForMode, type ColorMode, type ResolvedColorMode, type ThemeTokens } from './tokens';

export const THEME_SETTING_KEY = 'theme.configuration';

export interface ThemeConfiguration {
  mode: ColorMode;
  customTokens: Partial<ThemeTokens>;
}

export const defaultThemeConfiguration: ThemeConfiguration = { mode: 'system', customTokens: {} };
export const globalThemeSetting = writable<ColorMode>('system');
export const globalThemeMode = writable<ResolvedColorMode>('light');
export function applyGlobalTheme(mode: ColorMode): ResolvedColorMode { globalThemeSetting.set(mode); const resolved = resolveColorMode(mode, prefersDarkMode()); const tokens = tokensForMode(resolved); globalThemeMode.set(resolved); setDocumentTheme(resolved, tokens); return resolved; }
export function toggleGlobalTheme(): ResolvedColorMode { const current = get(globalThemeSetting); const next: ColorMode = current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark'; return applyGlobalTheme(next); }

export function resolveColorMode(mode: ColorMode, prefersDark: boolean): ResolvedColorMode {
  return mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;
}

function prefersDarkMode(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function setDocumentTheme(mode: ResolvedColorMode, tokens: ThemeTokens): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = mode;
  for (const [name, value] of Object.entries(tokens)) root.style.setProperty(name, value);
}

export class ThemeController {
  readonly configuration = writable<ThemeConfiguration>(defaultThemeConfiguration);
  readonly resolvedMode = writable<ResolvedColorMode>(resolveColorMode('system', prefersDarkMode()));
  readonly tokens = writable<ThemeTokens>(tokensForMode('light'));
  private mediaQuery?: MediaQueryList;
  private mediaListener?: (event: MediaQueryListEvent) => void;

  constructor(private readonly storage?: Storage) {
    this.mediaQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : undefined;
    this.mediaListener = () => this.apply();
    this.mediaQuery?.addEventListener?.('change', this.mediaListener);
    this.apply();
  }

  async load(): Promise<ThemeConfiguration> {
    const setting = await this.storage?.get('settings', THEME_SETTING_KEY);
    const value = setting?.value as Partial<ThemeConfiguration> | undefined;
    const configuration: ThemeConfiguration = {
      mode: value?.mode === 'light' || value?.mode === 'dark' || value?.mode === 'system' ? value.mode : 'system',
      customTokens: sanitizeTokenOverrides(value?.customTokens ?? {}),
    };
    this.configuration.set(configuration);
    this.apply(configuration);
    return configuration;
  }

  async setMode(mode: ColorMode): Promise<void> {
    const current = this.currentConfiguration();
    await this.save({ ...current, mode });
  }

  async setCustomTokens(customTokens: Partial<ThemeTokens>): Promise<void> {
    const current = this.currentConfiguration();
    await this.save({ ...current, customTokens: sanitizeTokenOverrides(customTokens) });
  }

  apply(configuration = this.currentConfiguration()): void {
    const resolved = resolveColorMode(configuration.mode, this.mediaQuery?.matches ?? prefersDarkMode());
    this.resolvedMode.set(resolved);
    const tokens = tokensForMode(resolved, configuration.customTokens);
    this.tokens.set(tokens);
    setDocumentTheme(resolved, tokens);
  }

  destroy(): void {
    if (this.mediaQuery && this.mediaListener) this.mediaQuery.removeEventListener?.('change', this.mediaListener);
  }

  private currentConfiguration(): ThemeConfiguration {
    let current = defaultThemeConfiguration;
    const unsubscribe = this.configuration.subscribe((value) => { current = value; });
    unsubscribe();
    return current;
  }

  private async save(configuration: ThemeConfiguration): Promise<void> {
    this.configuration.set(configuration);
    this.apply(configuration);
    if (!this.storage) return;
    const existing = await this.storage.get('settings', THEME_SETTING_KEY);
    if (existing) await this.storage.update('settings', { ...existing, key: THEME_SETTING_KEY, value: configuration });
    else await this.storage.create('settings', { id: THEME_SETTING_KEY, key: THEME_SETTING_KEY, value: configuration });
  }
}

export function themeStore(controller: ThemeController): Readable<ThemeConfiguration> { return { subscribe: controller.configuration.subscribe }; }
