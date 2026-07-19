import { describe, expect, it } from 'vitest';
import { blurLevel, blurStrength, setBlurLevel } from '../src/lib/ui/privacy';
import { defaultVisibilitySettings, recordsForView } from '../src/lib/projects/scope';

describe('granular privacy and project scope', () => {
  it('maps the continuous blur slider to XS through 2XL', () => { expect(setBlurLevel(0)).toBe('xs'); expect(setBlurLevel(5)).toBe('2xl'); expect(setBlurLevel(99)).toBe('2xl'); expect(blurLevel('m')).toBe(2); let current = ''; const unsubscribe = blurStrength.subscribe((value) => { current = value; }); expect(current).toBe('2xl'); unsubscribe(); });
  it('allows visibility flags to widen only the selected view', () => { const records = [{ id: 'a', project_id: 'p1', deleted_at: null }, { id: 'b', project_id: 'p2', deleted_at: null }]; const settings = { activeProjectId: 'p1', showAllProjects: false }; expect(recordsForView(records, 'calendar', settings, { ...defaultVisibilitySettings, calendar: true })).toHaveLength(2); expect(recordsForView(records, 'documents', settings, defaultVisibilitySettings)).toHaveLength(1); });
});
