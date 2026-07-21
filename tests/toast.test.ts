import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dismissToast, showToast, toasts } from '../src/lib/ui/toast';

describe('toast notifications', () => {
  beforeEach(() => { vi.useFakeTimers(); toasts.set([]); });
  it('publishes a toast and removes it after its duration', () => {
    showToast('Settings saved.');
    expect(toasts).toBeDefined();
    let current: unknown[] = [];
    const unsubscribe = toasts.subscribe((value) => { current = value; });
    expect(current).toHaveLength(1);
    vi.advanceTimersByTime(3600);
    expect(current).toHaveLength(0);
    unsubscribe();
  });
  it('supports severity and manual dismissal', () => {
    showToast('Connection failed.', 'error');
    let id = 0;
    const unsubscribe = toasts.subscribe((value) => { id = value[0]?.id ?? 0; });
    dismissToast(id);
    let current: unknown[] = [];
    const check = toasts.subscribe((value) => { current = value; });
    expect(current).toHaveLength(0);
    check(); unsubscribe();
  });
});
