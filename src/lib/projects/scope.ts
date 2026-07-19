import type { Project } from '../storage/models';
export interface ScopedRecord { id: string; project_id?: string; deleted_at?: number | null; }
export interface ProjectScopeSettings { activeProjectId: string | null; showAllProjects: boolean; }
export type ScopedView = 'calendar' | 'launchpad' | 'quicknotes' | 'documents' | 'time-logs' | 'progress';
export type VisibilitySettings = Record<ScopedView, boolean>;
export const defaultVisibilitySettings: VisibilitySettings = { calendar: false, launchpad: false, quicknotes: false, documents: false, 'time-logs': false, progress: false };
export function activeProjects(projects: Project[]): Project[] { return projects.filter((project) => project.deleted_at === null); }
export function archiveProject(project: Project, now = Date.now()): Project { return { ...project, deleted_at: now, updated_at: now }; }
export function restoreProject(project: Project, now = Date.now()): Project { return { ...project, deleted_at: null, updated_at: now }; }
export function recordsForScope<T extends ScopedRecord>(records: T[], settings: ProjectScopeSettings): T[] { return records.filter((record) => record.deleted_at === null && (settings.showAllProjects || !settings.activeProjectId || record.project_id === settings.activeProjectId)); }
export function recordsForView<T extends ScopedRecord>(records: T[], view: ScopedView, settings: ProjectScopeSettings, visibility: VisibilitySettings): T[] { return recordsForScope(records, view ? { ...settings, showAllProjects: settings.showAllProjects || visibility[view] } : settings); }
export function cascadeProjectDelete<T extends ScopedRecord>(records: T[], projectId: string, now = Date.now()): T[] { return records.map((record) => record.project_id === projectId ? { ...record, deleted_at: now } : record); }
