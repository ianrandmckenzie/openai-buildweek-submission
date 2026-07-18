import { describe, expect, it, vi } from 'vitest';
import { createBackgroundLoop, createDownloadAdapter, createWindowAdapter, detectRuntime } from '../src/lib/utils/runtime';

describe('runtime detection', () => {
  it('detects browser and native desktop platforms', () => {
    expect(detectRuntime({ userAgent: 'Mozilla/5.0', navigatorPlatform: 'MacIntel', tauriMarker: false })).toMatchObject({ platform: 'macos', isDesktop: true, isWeb: true });
    expect(detectRuntime({ userAgent: 'Mozilla/5.0 (Windows NT 10.0)', navigatorPlatform: 'Win32', tauriMarker: true })).toMatchObject({ platform: 'windows', isTauri: true, isDesktop: true, isWeb: false });
  });
  it('detects mobile platforms from user agents', () => { expect(detectRuntime({ userAgent: 'Mozilla/5.0 (Linux; Android 14)' }).platform).toBe('android'); expect(detectRuntime({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)' }).platform).toBe('ios'); });
});

describe('runtime bridges', () => {
  it('routes window actions to Tauri invoke when available and otherwise safely no-ops', async () => { const invoke = vi.fn().mockResolvedValue(undefined); const nativeWindow = createWindowAdapter(invoke); await nativeWindow.minimize(); await nativeWindow.maximize(); await nativeWindow.close(); expect(invoke.mock.calls.map(([command]) => command)).toEqual(['minimize_window', 'maximize_window', 'close_window']); await createWindowAdapter().close(); });
  it('runs a single background loop and stops cleanly', () => { const setInterval = vi.fn(() => 1); const clearInterval = vi.fn(); const loop = createBackgroundLoop(vi.fn(), 1000, { setInterval, clearInterval }); loop.start(); loop.start(); expect(loop.running).toBe(true); expect(setInterval).toHaveBeenCalledTimes(1); loop.stop(); expect(clearInterval).toHaveBeenCalledWith(1); expect(loop.running).toBe(false); });
  it('rejects unsafe loop intervals', () => { expect(() => createBackgroundLoop(vi.fn(), 0)).toThrow(); });
  it('creates browser download links', async () => { const click = vi.fn(); const originalCreate = (document as any).createElement; const originalUrl = (globalThis as any).URL; (document as any).createElement = vi.fn(() => ({ click })); (globalThis as any).URL = { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() }; await createDownloadAdapter().download(new Blob(['data']), 'export.txt'); expect(click).toHaveBeenCalled(); (document as any).createElement = originalCreate; (globalThis as any).URL = originalUrl; });
});
