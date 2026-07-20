import { describe, expect, it } from 'vitest';
import { applyGlobalTheme, globalThemeMode, globalThemeSetting, toggleGlobalTheme } from '../src/lib/theme/theme';

describe('global theme mode', () => {
  it('applies dark tokens to the document root', () => { expect(applyGlobalTheme('dark')).toBe('dark'); expect(document.documentElement.dataset.theme).toBe('dark'); expect(document.documentElement.style.getPropertyValue('--bg-primary')).toBe('#000000'); expect(document.documentElement.style.getPropertyValue('--border-custom')).toBe('#1e3558'); });
  it('toggles between dark and light token sets and updates shared state', () => { applyGlobalTheme('dark'); expect(toggleGlobalTheme()).toBe('light'); expect(document.documentElement.style.getPropertyValue('--bg-primary')).toBe('#ffffff'); let mode = 'dark'; const unsubscribe = globalThemeMode.subscribe((value) => { mode = value; }); expect(mode).toBe('light'); unsubscribe(); });
  it('cycles dark, light, and system settings', () => { applyGlobalTheme('dark'); toggleGlobalTheme(); expect(globalThemeSetting).toBeTruthy(); expect(document.documentElement.dataset.theme).toBe('light'); toggleGlobalTheme(); expect(document.documentElement.dataset.theme).toBe('light'); toggleGlobalTheme(); expect(document.documentElement.dataset.theme).toBe('dark'); });
});
