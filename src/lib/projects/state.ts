import { writable, derived, get } from 'svelte/store';
import type { Project } from '../storage/models';
import { archiveProject, restoreProject } from './scope';
import { PersistentCollection } from '../storage/persistent';

export type ProjectViewMode = 'project' | 'all';
export const projects = writable<Project[]>([]);
export const selectedProjectId = writable<string | null>(null);
export const projectViewMode = writable<ProjectViewMode>('project');
export const selectedProject = derived([projects, selectedProjectId], ([$projects, id]) => $projects.find((project) => project.id === id && project.deleted_at === null));
const persistedProjects = new PersistentCollection('projects');
let projectsLoaded = false;
export async function loadProjects(): Promise<void> { const records = await persistedProjects.load(); if (records.length) { projects.set(records); if (!get(selectedProjectId)) selectedProjectId.set(records.find((project) => project.deleted_at === null)?.id ?? null); } else { const defaultProject: Project = { id: 'default-project', name: 'Default Project', created_at: Date.now(), updated_at: Date.now(), deleted_at: null, synced_at: null }; projects.set([defaultProject]); selectedProjectId.set(defaultProject.id); await persistedProjects.create(defaultProject); } projectsLoaded = true; }
export function createProject(name: string): Project { const trimmed = name.trim(); if (!trimmed) throw new Error('Project name is required'); const now = Date.now(); const project: Project = { id: crypto.randomUUID(), name: trimmed, created_at: now, updated_at: now, deleted_at: null, synced_at: null }; projects.update((items) => [...items, project]); if (projectsLoaded) void persistedProjects.create(project); selectedProjectId.set(project.id); projectViewMode.set('project'); return project; }
export function selectProject(id: string | null): void { selectedProjectId.set(id); projectViewMode.set(id ? 'project' : 'all'); }
export function setProjectViewMode(mode: ProjectViewMode): void { projectViewMode.set(mode); }
export function renameProject(id: string, name: string): void { const trimmed = name.trim(); if (!trimmed) throw new Error('Project name is required'); projects.update((items) => items.map((project) => project.id === id ? { ...project, name: trimmed, updated_at: Date.now() } : project)); }
export function rekeyProject(id: string, nextId: string): void { const trimmed = nextId.trim(); if (!trimmed) throw new Error('Project id is required'); if (get(projects).some((project) => project.id === trimmed && project.id !== id)) throw new Error('Project id is already in use'); projects.update((items) => items.map((project) => project.id === id ? { ...project, id: trimmed, updated_at: Date.now() } : project)); if (get(selectedProjectId) === id) selectedProjectId.set(trimmed); }
export function archiveProjectById(id: string): void { projects.update((items) => items.map((project) => project.id === id ? archiveProject(project) : project)); if (get(selectedProjectId) === id) selectProject(null); }
export function restoreProjectById(id: string): void { projects.update((items) => items.map((project) => project.id === id ? restoreProject(project) : project)); }
export function deleteProjectById(id: string): void { projects.update((items) => items.filter((project) => project.id !== id)); if (get(selectedProjectId) === id) selectProject(null); }
