import { derived, get, writable } from 'svelte/store';
import { selectedProjectId } from '../projects/state';
import { hydrateJsonState, readJsonState, writeJsonState } from '../storage/json-state';
export interface DocumentRecord { id:string; project_id:string; title:string; content:string; tags:string[]; archived:boolean; blurred?:boolean; created_at:number; updated_at:number; }
const KEY='dashboard.documents.v1';
function normalizeDocument(value: Partial<DocumentRecord>): DocumentRecord {
  let embedded: Partial<DocumentRecord> = {};
  if (typeof value.content === 'string') {
    try { embedded = JSON.parse(value.content); } catch { /* Regular document content is not Quicknotes metadata. */ }
  }
  return {
    ...(value as DocumentRecord),
    tags: Array.isArray(value.tags) ? value.tags : Array.isArray(embedded.tags) ? embedded.tags : [],
    archived: typeof value.archived === 'boolean' ? value.archived : Boolean(embedded.archived),
    blurred: typeof value.blurred === 'boolean' ? value.blurred : Boolean(embedded.blurred),
  };
}
const read=():DocumentRecord[]=>readJsonState<Partial<DocumentRecord>[]>(KEY,[]).map(normalizeDocument);
const write=(items:DocumentRecord[])=>writeJsonState(KEY,items);
export const documents=writable<DocumentRecord[]>(read()); export const currentDocument=writable<DocumentRecord|null>(null); export const docsScope=writable<'project'|'all'>('project'); export const showArchivedDocs=writable(false); export const selectedDocTags=writable<string[]>([]);
export const allDocTags=derived(documents,($docs)=>[...new Set($docs.flatMap((doc)=>doc.tags))].sort());
export const visibleDocuments=derived([documents,selectedProjectId,docsScope,showArchivedDocs,selectedDocTags],([$docs,projectId,scope,archived,tags])=>$docs.filter((doc)=>(scope==='all'||!projectId||doc.project_id===projectId)&&doc.archived===archived&&tags.every((tag)=>doc.tags.includes(tag))));
export async function loadDocuments(hydrate=true){documents.set(hydrate ? await hydrateJsonState(KEY,read()) : read())} export function openDocument(doc:DocumentRecord){let content=doc.content;try{const parsed=JSON.parse(content);if(parsed&&typeof parsed==='object'&&typeof parsed.body==='string'&&('checklist' in parsed||'pinned' in parsed||'archived' in parsed))content=parsed.body}catch{/* Keep ordinary Markdown unchanged. */}currentDocument.set({...doc,content,tags:[...doc.tags]})} export function toggleDocTag(tag:string){selectedDocTags.update((tags)=>tags.includes(tag)?tags.filter((item)=>item!==tag):[...tags,tag])}
export function createDocument(projectId=get(selectedProjectId)??'default'){const now=Date.now();const doc:DocumentRecord={id:crypto.randomUUID(),project_id:projectId,title:'Untitled Doc',content:'',tags:[],archived:false,created_at:now,updated_at:now};documents.update((items)=>[...items,doc]);write([...read(),doc]);currentDocument.set(doc);return doc}
export function ensureCurrentDocument(title='Untitled document', content='', projectId=get(selectedProjectId)??'default'): DocumentRecord { const current=get(currentDocument); if (current) return current; const doc=createDocument(projectId); saveCurrentDocument({ title, content }); return { ...doc, title, content }; }
export function saveCurrentDocument(patch:Partial<DocumentRecord>){const current=get(currentDocument);if(!current)return;const saved={...current,...patch,updated_at:Date.now()};documents.update((items)=>items.map((doc)=>doc.id===saved.id?saved:doc));currentDocument.set(saved);write(read().map((doc)=>doc.id===saved.id?saved:doc))}
export function updateDocument(id:string, patch:Partial<DocumentRecord>){const saved=read().map((doc)=>doc.id===id?{...doc,...patch,updated_at:Date.now()}:doc);documents.set(saved);write(saved);const current=get(currentDocument);if(current?.id===id)currentDocument.set(saved.find((doc)=>doc.id===id)??null)}
export function deleteDocument(id:string){const next=read().filter((doc)=>doc.id!==id);documents.set(next);write(next);if(get(currentDocument)?.id===id)currentDocument.set(null)}
