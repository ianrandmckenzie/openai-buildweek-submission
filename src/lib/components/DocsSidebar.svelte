<script lang="ts">
  import { onMount } from 'svelte';
  import { sidebarView } from '../ui/sidebar';
  import { navigateTo } from '../ui/navigation';
  import type { DocumentRecord } from '../documents/state';
  import { docsScope, showArchivedDocs, selectedDocTags, visibleDocuments, allDocTags, openDocument, createDocument, toggleDocTag, loadDocuments, updateDocument, deleteDocument } from '../documents/state';

  onMount(loadDocuments);
  $: if ($sidebarView === 'docs') void loadDocuments();
  let menu: string | null = null;
  let deleteTarget: DocumentRecord | null = null;

  function editDocument(document: DocumentRecord): void {
    openDocument(document);
    menu = null;
    navigateTo('documents');
  }

  function requestDelete(document: DocumentRecord): void {
    menu = null;
    deleteTarget = document;
  }

  function confirmDelete(): void {
    if (!deleteTarget) return;
    deleteDocument(deleteTarget.id);
    deleteTarget = null;
  }
</script>

<div class="focus-panel">
  <div class="panel-heading"><h2>Docs</h2><div>
    <button on:click={() => docsScope.set($docsScope === 'project' ? 'all' : 'project')}>{$docsScope === 'project' ? 'This project' : 'All projects'}</button>
    <button on:click={() => showArchivedDocs.update((value) => !value)}>{$showArchivedDocs ? 'Active docs' : 'Archived'}</button>
    <button aria-label="New document" on:click={() => createDocument()}><img src="/tmp-icons/add-plus.svg" alt="" /></button>
  </div></div>
  <div class="doc-list">
    {#each $visibleDocuments as document (document.id)}
      <div class="doc-row" on:mouseleave={() => menu = null}>
        <button class:blurred={document.blurred} class="doc-name" on:click={() => { openDocument(document); navigateTo('documents'); }}>{document.title || 'Untitled Doc'}</button>
        <div class="hover-actions">
          <button aria-label="Toggle document blur" on:click={() => updateDocument(document.id, { blurred: !document.blurred })}><img src={`/tmp-icons/${document.blurred ? 'obfuscated' : 'obfuscation'}.svg`} alt="" /></button>
          <button aria-label="Document actions" on:click={() => menu = menu === document.id ? null : document.id}><img src="/tmp-icons/overflow-ellipsis.svg" alt="" /></button>
          {#if menu === document.id}<div class="menu">
            <button on:click={() => editDocument(document)}><img src="/tmp-icons/pencil.svg" alt="" /> Edit</button>
            <button on:click={() => updateDocument(document.id, { archived: !document.archived })}><img src="/tmp-icons/archive.svg" alt="" /> {document.archived ? 'Unarchive' : 'Archive'}</button>
            <button on:click={() => requestDelete(document)}><img src="/tmp-icons/trash.svg" alt="" /> Delete</button>
          </div>{/if}
        </div>
      </div>
    {:else}<p>No documents yet.</p>{/each}
  </div>
  <div class="tags"><small>Tags</small>{#each $allDocTags as tag}<button class:active={$selectedDocTags.includes(tag)} on:click={() => toggleDocTag(tag)}>#{tag}</button>{/each}</div>
</div>

{#if deleteTarget}
  <div class="backdrop" role="presentation" on:click={(event) => event.target === event.currentTarget && (deleteTarget = null)}>
    <section class="confirm-modal" role="dialog" aria-modal="true" aria-label="Delete document" on:click|stopPropagation>
      <h3>Delete document?</h3><p>This document will be permanently removed.</p>
      <footer><button on:click={() => deleteTarget = null}>Cancel</button><button class="danger" on:click={confirmDelete}>Delete</button></footer>
    </section>
  </div>
{/if}

<style>
  .focus-panel{display:grid;grid-template-rows:auto 1fr auto;gap:.8rem;height:100%;padding:1.15rem 1rem}.panel-heading,.panel-heading div{display:flex;align-items:center;justify-content:space-between;gap:.35rem}h2{margin:0;font-size:1.05rem}button{padding:.45rem .6rem;border:1px solid var(--border-custom);border-radius:.35rem;background:var(--bg-elevated);color:var(--text-main);cursor:pointer;font-size:.7rem}button img{width:1rem;height:1rem;vertical-align:middle}.doc-list{display:grid;align-content:start;gap:.2rem}.doc-row{position:relative;display:flex;align-items:center;gap:.2rem}.doc-name{flex:1;border-color:transparent;background:transparent;text-align:left}.hover-actions{display:none}.doc-row:hover .hover-actions{display:flex}.hover-actions button{padding:.3rem}.menu{position:absolute;right:0;top:2rem;z-index:3;display:grid;min-width:7rem;padding:.25rem;border:1px solid var(--border-custom);border-radius:.4rem;background:var(--bg-primary);box-shadow:0 .4rem 1rem rgb(0 0 0/.12)}.menu button{text-align:left;border:0}.menu img{margin-right:.3rem}.blurred{filter:blur(var(--blur-intensity))}.tags{display:flex;align-items:center;gap:.35rem;flex-wrap:wrap;padding-top:.7rem;border-top:1px solid var(--border-custom)}.tags small{width:100%;color:var(--text-muted)}.tags button.active{background:var(--accent-secondary);font-weight:700}.backdrop{position:fixed;inset:0;z-index:20;display:grid;place-items:center;background:rgb(8 18 38/.48)}.confirm-modal{width:min(26rem,calc(100vw - 2rem));padding:1.25rem;border:1px solid var(--border-custom);border-radius:.7rem;background:var(--bg-primary);box-shadow:0 1rem 3rem rgb(0 0 0/.2)}.confirm-modal h3{margin:0 0 .5rem}.confirm-modal p{color:var(--text-muted)}.confirm-modal footer{display:flex;justify-content:flex-end;gap:.5rem;margin-top:1.25rem}.confirm-modal .danger{background:#9f2f3f;color:#fff}
</style>
