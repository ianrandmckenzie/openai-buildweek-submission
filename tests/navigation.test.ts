import { beforeEach, describe, expect, it } from 'vitest';
import { activeView, clerkOpen, navigateTo, toggleClerk, views } from '../src/lib/ui/navigation';

describe('shell navigation state', () => {
  beforeEach(() => { activeView.set('calendar'); clerkOpen.set(true); });
  it('exposes the six main workspace views', () => { expect(views.map((view) => view.id)).toEqual(['calendar', 'launchpad', 'quicknotes', 'documents', 'time-logs', 'progress']); });
  it('navigates between views without mutating the view registry', () => { navigateTo('documents'); let value = ''; const unsubscribe = activeView.subscribe((current) => { value = current; }); expect(value).toBe('documents'); unsubscribe(); });
  it('toggles the Clerk pane', () => { toggleClerk(); let value = true; const unsubscribe = clerkOpen.subscribe((open) => { value = open; }); expect(value).toBe(false); unsubscribe(); });
});
