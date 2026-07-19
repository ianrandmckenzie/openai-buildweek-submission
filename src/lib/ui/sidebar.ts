import { writable } from 'svelte/store';
export type SidebarView = 'clerk' | 'search' | 'routines' | 'docs';
export const sidebarView = writable<SidebarView>('clerk');
export const sidebarViews: Array<{ id: SidebarView; label: string }> = [{ id: 'clerk', label: 'Clerk' }, { id: 'search', label: 'Search' }, { id: 'routines', label: 'Routines' }, { id: 'docs', label: 'Docs' }];
export function setSidebarView(view: SidebarView): void { sidebarView.set(view); }
export function showsClerkFooter(view: SidebarView): boolean { return view === 'clerk'; }
