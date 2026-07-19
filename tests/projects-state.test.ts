import { beforeEach, describe, expect, it } from 'vitest';
import { createProject, deleteProjectById, projectViewMode, projects, rekeyProject, selectProject, selectedProjectId, setProjectViewMode } from '../src/lib/projects/state';

beforeEach(() => { projects.set([]); selectedProjectId.set(null); projectViewMode.set('all'); });
describe('project navigation state', () => {
  it('creates dynamic projects and selects them', () => { const project = createProject('Personal'); let selected: string | null = null; const unsubscribe = selectedProjectId.subscribe((id) => { selected = id; }); expect(selected).toBe(project.id); unsubscribe(); });
  it('switches between this-project and all-project scope', () => { const project = createProject('Work'); setProjectViewMode('all'); let mode = 'project'; const unsubscribe = projectViewMode.subscribe((value) => { mode = value; }); expect(mode).toBe('all'); selectProject(project.id); expect(mode).toBe('project'); unsubscribe(); });
  it('deletes a project and clears its selection', () => { const project = createProject('Temporary'); deleteProjectById(project.id); let selected: string | null = 'stale'; const unsubscribe = selectedProjectId.subscribe((id) => { selected = id; }); expect(selected).toBe(null); unsubscribe(); });
  it('allows a selected project id to be edited without losing selection', () => { const project = createProject('Rename id'); rekeyProject(project.id, 'custom-id'); let selected: string | null = null; const unsubscribe = selectedProjectId.subscribe((id) => { selected = id; }); expect(selected).toBe('custom-id'); unsubscribe(); });
});
