import { describe, expect, it } from 'vitest';
import { allDocTags, currentDocument, createDocument, documents, openDocument, selectedDocTags, toggleDocTag } from '../src/lib/documents/state';

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
});
