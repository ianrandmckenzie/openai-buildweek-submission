import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { allDocTags, currentDocument, createDocument, documents, docsScope, ensureCurrentDocument, openDocument, selectedDocTags, toggleDocTag, visibleDocuments } from '../src/lib/documents/state';
import { projectViewMode, selectedProjectId } from '../src/lib/projects/state';

describe('documents state', () => {
  it('creates and opens a persisted document-shaped record', () => {
    documents.set([]); const doc = createDocument('project-1');
    expect(doc.title).toBe('Untitled Doc'); expect(doc.project_id).toBe('project-1');
    openDocument(doc); let current = null; const stop = currentDocument.subscribe((value) => current = value); expect(current).toMatchObject({ id: doc.id }); stop();
  });
  it('supports multiple tag filters and derives all tags', () => {
    documents.set([{ id:'1', project_id:'p', title:'One', content:'', tags:['work','red'], archived:false, created_at:1, updated_at:1 }, { id:'2', project_id:'p', title:'Two', content:'', tags:['work'], archived:false, created_at:1, updated_at:1 }]);
    toggleDocTag('work'); toggleDocTag('red'); let tags:string[]=[]; const stop=allDocTags.subscribe((value)=>tags=value); expect(tags).toEqual(['red','work']); stop(); selectedDocTags.set([]);
  });
  it('materializes the current draft when editing starts', () => {
    documents.set([]); currentDocument.set(null);
    const doc = ensureCurrentDocument('Untitled document', '# Draft');
    expect(documents).toBeTruthy(); expect(doc).toMatchObject({ title: 'Untitled document', content: '# Draft' });
    let saved: any = null; const stop = currentDocument.subscribe((value) => saved = value); expect(saved).toMatchObject({ id: doc.id, content: '# Draft' }); stop();
  });
  it('keeps the Docs project scope independent from the global project view', () => {
    documents.set([{ id:'1', project_id:'p1', title:'One', content:'', tags:[], archived:false, created_at:1, updated_at:1 }, { id:'2', project_id:'p2', title:'Two', content:'', tags:[], archived:false, created_at:1, updated_at:1 }]);
    selectedProjectId.set('p1'); projectViewMode.set('all'); docsScope.set('project');
    expect(get(visibleDocuments).map((doc) => doc.id)).toEqual(['1']);
    docsScope.set('all');
    expect(get(visibleDocuments).map((doc) => doc.id)).toEqual(['1', '2']);
    selectedProjectId.set(null); docsScope.set('project'); projectViewMode.set('project');
  });
});
