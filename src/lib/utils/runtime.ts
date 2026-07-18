export type RuntimePlatform = 'web' | 'android' | 'ios' | 'windows' | 'macos' | 'linux';

export interface RuntimeInfo {
  platform: RuntimePlatform;
  isTauri: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isWeb: boolean;
}

export interface RuntimeEnvironment {
  userAgent?: string;
  tauriMarker?: boolean;
  navigatorPlatform?: string;
}

export function detectRuntime(environment: RuntimeEnvironment = {}): RuntimeInfo {
  const userAgent = (environment.userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '')).toLowerCase();
  const platform = (environment.navigatorPlatform ?? (typeof navigator !== 'undefined' ? navigator.platform : '')).toLowerCase();
  const isTauri = environment.tauriMarker ?? Boolean((globalThis as { __TAURI__?: unknown }).__TAURI__);
  let detected: RuntimePlatform = 'web';
  if (/android/.test(userAgent)) detected = 'android';
  else if (/iphone|ipad|ipod/.test(userAgent) || /mac/.test(platform) && /mobile/.test(userAgent)) detected = 'ios';
  else if (/win/.test(platform) || /windows/.test(userAgent)) detected = 'windows';
  else if (/mac/.test(platform) || /macintosh|mac os/.test(userAgent)) detected = 'macos';
  else if (/linux|x11/.test(platform) || /linux/.test(userAgent)) detected = 'linux';
  const isMobile = detected === 'android' || detected === 'ios';
  const isDesktop = detected === 'windows' || detected === 'macos' || detected === 'linux';
  return { platform: detected, isTauri, isMobile, isDesktop, isWeb: !isTauri };
}

export const runtime = detectRuntime();

export interface DownloadAdapter { download(blob: Blob, filename: string): Promise<void>; }

export function createDownloadAdapter(): DownloadAdapter {
  return {
    async download(blob, filename) {
      if (typeof document === 'undefined' || typeof URL === 'undefined') throw new Error('Downloads are unavailable outside a browser runtime');
      const url = URL.createObjectURL(blob);
      try {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
      } finally { URL.revokeObjectURL(url); }
    },
  };
}

export interface WindowAdapter { minimize(): Promise<void>; maximize(): Promise<void>; close(): Promise<void>; }

type Invoke = (command: string) => Promise<unknown>;
function tauriInvoke(): Invoke | undefined {
  const candidate = (globalThis as { __TAURI__?: { core?: { invoke?: Invoke }; invoke?: Invoke } }).__TAURI__;
  return candidate?.core?.invoke ?? candidate?.invoke;
}

export function createWindowAdapter(invoke: Invoke | undefined = tauriInvoke()): WindowAdapter {
  const call = async (command: string) => { if (invoke) await invoke(command); };
  return { minimize: () => call('minimize_window'), maximize: () => call('maximize_window'), close: () => call('close_window') };
}

export interface BackgroundLoop { start(): void; stop(): void; running: boolean; }

export interface TimerAdapter { setInterval(callback: () => void, intervalMs: number): unknown; clearInterval(handle: unknown): void; }

export function createBackgroundLoop(callback: () => void, intervalMs: number, timerApi: TimerAdapter = globalThis): BackgroundLoop {
  if (!Number.isFinite(intervalMs) || intervalMs <= 0) throw new Error('Background loop interval must be positive');
  let handle: unknown;
  return {
    get running() { return handle !== undefined; },
    start() { if (handle === undefined) handle = timerApi.setInterval(callback, intervalMs); },
    stop() { if (handle !== undefined) { timerApi.clearInterval(handle); handle = undefined; } },
  };
}
