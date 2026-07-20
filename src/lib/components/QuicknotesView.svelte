<script lang="ts">
  import { onMount } from 'svelte';
  import { PersistentCollection } from '../storage/persistent';
  import type { Note, Task, Event } from '../storage/models';
  import { selectedProjectId, projects } from '../projects/state';
  import {
    ensureQuicknoteId,
    partitionPinned,
    sortPinned,
    type ChecklistItem,
  } from '../quicknotes/board';
  import type { DocumentRecord } from '../documents/state';
  import { loadDocuments } from '../documents/state';
  import { quicknotesScope } from '../quicknotes/state';
  import EventModal from './EventModal.svelte';
  import TaskModal from './TaskModal.svelte';

  type Card = Note & {
    pinned?: boolean;
    archived?: boolean;
    blurred?: boolean;
    checklist: ChecklistItem[];
  };
  class QuicknoteStore {
    private key = 'dashboard.documents.v1';
    private read(): Note[] {
      if (typeof localStorage === 'undefined') return [];
      try {
        return (
          JSON.parse(localStorage.getItem(this.key) ?? '[]') as DocumentRecord[]
        ).map((doc) => ({ ...doc, deleted_at: null, synced_at: null }));
      } catch {
        return [];
      }
    }
    private write(items: Note[]): void {
      localStorage.setItem(this.key, JSON.stringify(items));
    }
    async load(projectId?: string): Promise<Note[]> {
      return this.read().filter(
        (note) => !projectId || note.project_id === projectId
      );
    }
    async create(
      input: Omit<
        Note,
        'created_at' | 'updated_at' | 'deleted_at' | 'synced_at'
      >
    ): Promise<Note> {
      const now = Date.now();
      const note = {
        ...ensureQuicknoteId(input),
        created_at: now,
        updated_at: now,
        deleted_at: null,
        synced_at: null,
      };
      this.write([...this.read(), note]);
      loadDocuments();
      return note;
    }
    async update(note: Note): Promise<Note> {
      const saved = { ...note, updated_at: Date.now() };
      this.write(
        this.read().map((item) => (item.id === saved.id ? saved : item))
      );
      loadDocuments();
      return saved;
    }
    async softDelete(id: string): Promise<void> {
      this.write(this.read().filter((item) => item.id !== id));
      loadDocuments();
    }
  }
  const collection = new QuicknoteStore();
  const taskCollection = new PersistentCollection('tasks');
  const eventCollection = new PersistentCollection('events');
  let cards: Card[] = [];
  let showArchived = false;
  let selected: Card | undefined;
  let title = '';
  let body = '';
  let checklistText = '';
  let query = '';
  let conversion: 'task' | 'event' | undefined;
  const decode = (note: Note): Card => {
    try {
      const parsed = JSON.parse(note.content);
      return {
        ...note,
        body: parsed.body ?? '',
        checklist: parsed.checklist ?? [],
        pinned: !!parsed.pinned,
        archived: !!parsed.archived,
        blurred: !!parsed.blurred,
      };
    } catch {
      return { ...note, body: note.content, checklist: [] };
    }
  };
  const encode = (card: Card): Note => ({
    ...card,
    content: JSON.stringify({
      body: card.body,
      checklist: card.checklist,
      pinned: card.pinned,
      archived: card.archived,
      blurred: card.blurred,
    }),
  });
  async function load(): Promise<void> {
    cards = (await collection.load($quicknotesScope === 'all' ? undefined : ($selectedProjectId ?? undefined)))
      .filter((note) => note.deleted_at === null)
      .map(decode) as Card[];
  }
  onMount(() => {
    void load();
  });
  $: if ($selectedProjectId !== undefined || $quicknotesScope) void load();
  $: visible = sortPinned(
    cards.filter(
      (card) => (showArchived ? card.archived : !card.archived)
    )
  );
  $: sections = partitionPinned(visible);
  function open(card: Card): void {
    selected = {
      ...card,
      checklist: card.checklist.map((item) => ({ ...item })),
    };
  }
  async function save(): Promise<void> {
    if (!selected || !selected.title.trim()) return;
    const saved = await collection.update(
      encode({ ...selected, title: selected.title.trim() })
    );
    cards = cards.map((card) => (card.id === saved.id ? decode(saved) : card));
    selected = undefined;
  }
  async function add(): Promise<void> {
    if (!title.trim() && !body.trim()) return;
    const note = await collection.create({
      project_id: $selectedProjectId ?? 'default',
      title: title.trim() || 'Untitled',
      content: JSON.stringify({
        body,
        checklist: [],
        pinned: false,
        archived: false,
        blurred: false,
      }),
    });
    cards = [...cards, decode(note)];
    title = '';
    body = '';
  }
  async function remove(): Promise<void> {
    if (!selected) return;
    await collection.softDelete(selected.id);
    cards = cards.filter((card) => card.id !== selected?.id);
    selected = undefined;
  }
  async function toggle(
    card: Card,
    field: 'pinned' | 'archived' | 'blurred'
  ): Promise<void> {
    const saved = decode(
      await collection.update(encode({ ...card, [field]: !card[field] }))
    );
    cards = cards.map((item) => (item.id === card.id ? saved : item));
  }
  function addChecklist(): void {
    if (!selected || !checklistText.trim()) return;
    selected = {
      ...selected,
      checklist: [
        ...selected.checklist,
        {
          id: crypto.randomUUID(),
          text: checklistText.trim(),
          completed: false,
        },
      ],
    };
    checklistText = '';
  }
  function projectName(id: string): string {
    return $projects.find((project) => project.id === id)?.name ?? 'Project';
  }
  async function convertTask(task: Task): Promise<void> {
    await taskCollection.create({
      ...task,
      id: crypto.randomUUID(),
      project_id: selected?.project_id ?? 'default',
      title: selected?.title ?? task.title,
      notes: selected?.body ?? task.notes,
    });
    conversion = undefined;
  }
  async function convertEvent(event: Event): Promise<void> {
    await eventCollection.create({
      ...event,
      id: crypto.randomUUID(),
      project_id: selected?.project_id ?? 'default',
      title: selected?.title ?? event.title,
      description: selected?.body ?? event.description,
    });
    conversion = undefined;
  }
</script>

<div class="quicknotes-view" aria-label="Quicknotes">
  <div class="notes-toolbar">
    <div>
      <p class="eyebrow">Capture quickly</p>
      <h4>Quicknotes</h4>
    </div>
    <div class="toolbar-actions">
      <input
        aria-label="Search quicknotes"
        hidden
        bind:value={query}
        placeholder="Search notes…"
      /><button on:click={() => (showArchived = !showArchived)}
        >{showArchived ? 'Hide Archived' : 'Show Archived'}</button
      >
      <form on:submit|preventDefault={add}>
        <input
          aria-label="New note title"
          bind:value={title}
          placeholder="Title"
        /><input
          aria-label="New note body"
          bind:value={body}
          placeholder="Write a note…"
        /><button type="submit">Add note</button>
      </form>
    </div>
  </div>
  {#if visible.length}{#if sections.pinned.length}<section
        class="pinned-section"
      >
        <h5>Pinned</h5>
        <div class="note-grid">
          {#each sections.pinned as card (card.id)}<article
              class:pinned={card.pinned}
              class:blurred={card.blurred}
              class="note-card"
              on:click={() => open(card)}
            >
              <div class="card-header">
                <h5>{card.title}</h5>
                <div class="hover-actions">
                  <button
                    aria-label="Toggle blur"
                    on:click|stopPropagation={() => toggle(card, 'blurred')}
                    ><img src="/tmp-icons/obfuscation.svg" alt="" /></button
                  ><button
                    aria-label="Archive quicknote"
                    on:click|stopPropagation={() => toggle(card, 'archived')}
                    ><img src="/tmp-icons/archive.svg" alt="" /></button
                  ><button
                    aria-label={card.pinned
                      ? 'Unpin quicknote'
                      : 'Pin quicknote'}
                    on:click|stopPropagation={() => toggle(card, 'pinned')}
                    ><img
                      src={`/tmp-icons/${card.pinned ? 'pin-filled' : 'pin'}.svg`}
                      alt=""
                    /></button
                  >
                </div>
              </div>
              <small>{projectName(card.project_id)}</small>{#if card.body}<p>
                  {card.body}
                </p>{/if}{#if card.checklist.length}<div class="checklist">
                  {#each card.checklist as item}<label
                      ><input
                        type="checkbox"
                        checked={item.completed}
                        on:click|stopPropagation
                      /><span>{item.text}</span></label
                    >{/each}
                </div>{/if}
            </article>{/each}
        </div>
      </section>{/if}{#if sections.other.length}<section class="other-section">
        <h5>Other quicknotes</h5>
        <div class="note-grid">
          {#each sections.other as card (card.id)}<article
              class:pinned={card.pinned}
              class:blurred={card.blurred}
              class="note-card"
              on:click={() => open(card)}
            >
              <div class="card-header">
                <h5>{card.title}</h5>
                <div class="hover-actions">
                  <button
                    aria-label="Toggle blur"
                    on:click|stopPropagation={() => toggle(card, 'blurred')}
                    ><img src="/tmp-icons/obfuscation.svg" alt="" /></button
                  ><button
                    aria-label="Archive quicknote"
                    on:click|stopPropagation={() => toggle(card, 'archived')}
                    ><img src="/tmp-icons/archive.svg" alt="" /></button
                  ><button
                    aria-label={card.pinned
                      ? 'Unpin quicknote'
                      : 'Pin quicknote'}
                    on:click|stopPropagation={() => toggle(card, 'pinned')}
                    ><img
                      src={`/tmp-icons/${card.pinned ? 'pin-filled' : 'pin'}.svg`}
                      alt=""
                    /></button
                  >
                </div>
              </div>
              {#if card.body}<p>
                  {card.body}
                </p>{/if}{#if card.checklist.length}<div class="checklist">
                  {#each card.checklist as item}<label
                      ><input
                        type="checkbox"
                        checked={item.completed}
                        on:click|stopPropagation
                      /><span>{item.text}</span></label
                    >{/each}
                </div>{/if}
            </article>{/each}
        </div>
      </section>{/if}{:else}<div class="empty-state">
      <h5>{showArchived ? 'No archived quicknotes' : 'Your board is clear'}</h5>
    </div>{/if}
</div>

{#if selected}<div
    class="backdrop"
    role="presentation"
    on:click={(event) =>
      event.target === event.currentTarget && (selected = undefined)}
  >
    <section
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-label="Edit quicknote"
      on:click|stopPropagation
    >
      <header>
        <input aria-label="Quicknote title" bind:value={selected.title} />
        <div>
          <button
            aria-label="Pin quicknote"
            on:click={() => toggle(selected!, 'pinned')}
            ><img src="/tmp-icons/pin.svg" alt="" /></button
          ><button
            aria-label="Archive quicknote"
            on:click={() => toggle(selected!, 'archived')}
            ><img src="/tmp-icons/archive.svg" alt="" /></button
          ><button aria-label="Delete quicknote" on:click={remove}
            ><img src="/tmp-icons/trash.svg" alt="" /></button
          ><button aria-label="Close" on:click={() => (selected = undefined)}
            ><img src="/tmp-icons/close-x.svg" alt="" /></button
          >
        </div>
      </header>
      <select aria-label="Quicknote project" bind:value={selected.project_id}
        >{#each $projects.filter((project) => !project.deleted_at) as project}<option
            value={project.id}>{project.name}</option
          >{/each}</select
      ><textarea aria-label="Quicknote body" bind:value={selected.body}
      ></textarea>
      <div class="checklist-editor">
        {#each selected.checklist as item}<label
            ><input type="checkbox" bind:checked={item.completed} /><input
              aria-label="Checklist item"
              bind:value={item.text}
            /></label
          >{/each}
        <div>
          <input
            aria-label="New checklist item"
            bind:value={checklistText}
            placeholder="Add checklist item"
          /><button on:click={addChecklist}>Add</button>
        </div>
      </div>
      <footer>
        <button aria-label="Save quicknote" on:click={save}
          ><img src="/tmp-icons/save.svg" alt="" /> Save</button
        ><button
          aria-label="Convert to task"
          on:click={() => (conversion = 'task')}
          ><img src="/tmp-icons/checkbox.svg" alt="" /></button
        ><button
          aria-label="Convert to event"
          on:click={() => (conversion = 'event')}
          ><img src="/tmp-icons/calendar-plus.svg" alt="" /></button
        >
      </footer>
    </section>
  </div>{/if}
{#if conversion === 'task' && selected}<TaskModal
    mode="create"
    date={new Date()}
    projectId={selected.project_id}
    on:save={(event) => convertTask(event.detail)}
    on:close={() => (conversion = undefined)}
  />{:else if conversion === 'event' && selected}<EventModal
    mode="create"
    date={new Date()}
    projectId={selected.project_id}
    on:save={(event) => convertEvent(event.detail)}
    on:close={() => (conversion = undefined)}
  />{/if}

<style>
  .quicknotes-view {
    padding: 1rem;
  }
  .notes-toolbar {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .toolbar-actions,
  form {
    display: flex;
    gap: 0.4rem;
    align-items: center;
  }
  input,
  textarea,
  select {
    padding: 0.55rem 0.65rem;
    border: 1px solid var(--border-custom);
    border-radius: 0.4rem;
    background: var(--bg-elevated);
    color: var(--text-main);
  }
  button {
    padding: 0.5rem 0.65rem;
    border: 1px solid var(--border-custom);
    border-radius: 0.4rem;
    background: var(--accent-primary);
    color: var(--text-inverse);
    cursor: pointer;
  }
  .note-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 0.8rem;
  }
  .note-card {
    min-height: 8rem;
    padding: 0.8rem;
    border: 1px solid var(--border-custom);
    border-radius: 0.65rem;
    background: var(--bg-elevated);
    cursor: pointer;
  }
  .note-card.pinned {
    border-color: var(--accent-primary);
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .card-header h5 {
    margin: 0;
  }
  .hover-actions {
    display: flex;
    opacity: 0;
  }
  .note-card:hover .hover-actions {
    opacity: 1;
  }
  .hover-actions button,
  .modal header button {
    padding: 0.2rem;
    background: transparent;
    border: 0;
  }
  .hover-actions img,
  .modal img {
    width: 1rem;
    height: 1rem;
  }
  .note-card p {
    white-space: pre-wrap;
  }
  .blurred p,
  .blurred h5 {
    filter: blur(var(--blur-intensity));
  }
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: grid;
    place-items: center;
    background: rgb(0 0 0/0.55);
  }
  .modal {
    display: grid;
    gap: 1rem;
    width: min(42rem, calc(100vw - 2rem));
    padding: 1.2rem;
    border: 1px solid var(--border-custom);
    border-radius: 0.7rem;
    background: var(--bg-primary);
  }
  .modal header {
    display: flex;
    justify-content: space-between;
  }
  .modal header input {
    flex: 1;
    font-size: 1.1rem;
    font-weight: 700;
  }
  .modal textarea {
    min-height: 10rem;
  }
  .checklist-editor {
    display: grid;
    gap: 0.4rem;
  }
  .checklist-editor label {
    display: flex;
    gap: 0.4rem;
  }
  .modal footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.4rem;
  }
  .empty-state {
    text-align: center;
    padding: 4rem;
  }
  .eyebrow {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.68rem;
  }
  @media (max-width: 800px) {
    .notes-toolbar,
    .toolbar-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
