import { writable } from 'svelte/store';

export type ObfuscationMode = 'none' | 'some' | 'all';
export type BlurStrength = 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';
export const blurStrengths: BlurStrength[] = ['xs', 's', 'm', 'l', 'xl', '2xl'];

export const blurValues: Record<BlurStrength, string> = { xs: '2px', s: '4px', m: '8px', l: '12px', xl: '18px', '2xl': '26px' };
export const obfuscationMode = writable<ObfuscationMode>('none');
export const blurStrength = writable<BlurStrength>('m');

export function cycleObfuscation(): ObfuscationMode {
  let next: ObfuscationMode = 'none';
  obfuscationMode.update((current) => { next = current === 'none' ? 'some' : current === 'some' ? 'all' : 'none'; return next; });
  applyObfuscation(next);
  return next;
}

export function setObfuscation(mode: ObfuscationMode): void { obfuscationMode.set(mode); applyObfuscation(mode); }
export function setBlurStrength(strength: BlurStrength): void { blurStrength.set(strength); if (typeof document !== 'undefined') document.documentElement.style.setProperty('--blur-intensity', blurValues[strength]); }
export function setBlurLevel(level: number): BlurStrength { const index = Math.max(0, Math.min(blurStrengths.length - 1, Math.round(level))); const strength = blurStrengths[index]; setBlurStrength(strength); return strength; }
export function blurLevel(strength: BlurStrength): number { return blurStrengths.indexOf(strength); }

export function applyObfuscation(mode: ObfuscationMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('obfuscate-none', 'obfuscate-some', 'obfuscate-all');
  root.classList.add(`obfuscate-${mode}`);
  root.style.setProperty('--blur-intensity', blurValues[getBlurStrength()]);
}

function getBlurStrength(): BlurStrength { let current: BlurStrength = 'm'; const unsubscribe = blurStrength.subscribe((value) => { current = value; }); unsubscribe(); return current; }

export function obfuscationLabel(mode: ObfuscationMode): string { return mode === 'none' ? 'Privacy off' : mode === 'some' ? 'Some text blurred' : 'All text blurred'; }
