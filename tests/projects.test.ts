import { describe, expect, it } from 'vitest';
import { activeProjects, archiveProject, cascadeProjectDelete, recordsForScope, restoreProject } from '../src/lib/projects/scope';
const project = { id: 'p1', name: 'One', created_at: 1, updated_at: 1, deleted_at: null, synced_at: null };
describe('project scope', () => {
  it('archives and restores projects without losing metadata', () => { const archived = archiveProject(project, 10); expect(archived.deleted_at).toBe(10); expect(activeProjects([archived])).toHaveLength(0); expect(restoreProject(archived, 20)).toMatchObject({ deleted_at: null, created_at: 1, updated_at: 20 }); });
  it('filters records by active project or global visibility', () => { const records = [{ id: 'a', project_id: 'p1', deleted_at: null }, { id: 'b', project_id: 'p2', deleted_at: null }, { id: 'c', project_id: 'p1', deleted_at: 3 }]; expect(recordsForScope(records, { activeProjectId: 'p1', showAllProjects: false })).toHaveLength(1); expect(recordsForScope(records, { activeProjectId: 'p1', showAllProjects: true })).toHaveLength(2); });
  it('soft-deletes related records during a project cascade', () => { const records = [{ id: 'a', project_id: 'p1', deleted_at: null }, { id: 'b', project_id: 'p2', deleted_at: null }]; expect(cascadeProjectDelete(records, 'p1', 99)[0].deleted_at).toBe(99); expect(cascadeProjectDelete(records, 'p1', 99)[1].deleted_at).toBeNull(); });
});
