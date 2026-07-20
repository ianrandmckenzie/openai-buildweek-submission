<script lang="ts">
  import { onMount } from 'svelte';
  import { sidebarView, showsClerkFooter } from '../ui/sidebar';
  import SidebarTabs from './SidebarTabs.svelte';
  import ClerkPanel from './ClerkPanel.svelte';
  import SearchSidebar from './SearchSidebar.svelte';
  import RoutinesSidebar from './RoutinesSidebar.svelte';
  import DocsSidebar from './DocsSidebar.svelte';
  import { clerkPanelMode, clerkDrafts, clerkSessions, newClerkChat, selectClerkChat, renameClerkChat, archiveClerkChat, deleteClerkChat, approveDraft, denyDraft } from '../clerk/state';
  onMount(() => { newClerkChat(); });
</script>

<aside class="clerk-sidebar" aria-label="Focus sidebar"><SidebarTabs /><div class="sidebar-content">
  {#if $sidebarView === 'clerk'}<div class="clerk-content">
    {#if $clerkPanelMode === 'chat'}<ClerkPanel />
    {:else if $clerkPanelMode === 'drafts'}<div class="clerk-mode"><header><h3>Drafts</h3><button on:click={newClerkChat}>New Chat</button></header><p>Review proposed workspace changes before they are applied.</p>{#each $clerkDrafts.filter((draft) => draft.status === 'pending') as draft}<article><strong>{draft.action.action.replace('_',' ')} {draft.action.object_type}</strong><p>{draft.action.summary}</p><pre>{JSON.stringify(draft.action.payload,null,2)}</pre><div><button on:click={() => approveDraft(draft.id)}>Approve</button><button on:click={() => denyDraft(draft.id)}>Deny</button></div></article>{:else}<p>No pending drafts.</p>{/each}</div>
    {:else}<div class="clerk-mode"><header><h3>History</h3><button on:click={newClerkChat}>New Chat</button></header>{#each $clerkSessions.filter((session) => !session.archived) as session}<article><button class="session-open" on:click={() => selectClerkChat(session.id)}><strong>{session.title}</strong><small>{new Date(session.updated_at).toLocaleString()}</small></button><div><button on:click={() => renameClerkChat(session.id, window.prompt('Rename chat', session.title) ?? session.title)}>Rename</button><button on:click={() => archiveClerkChat(session.id)}>Archive</button><button on:click={() => deleteClerkChat(session.id)}>Delete</button></div></article>{:else}<p>No chat sessions yet.</p>{/each}</div>{/if}
  </div>
  {:else if $sidebarView === 'search'}<SearchSidebar />{:else if $sidebarView === 'routines'}<RoutinesSidebar />{:else}<DocsSidebar />{/if}
</div>{#if showsClerkFooter($sidebarView)}<div class="clerk-sidebar-footer"><button class:active={$clerkPanelMode === 'chat'} on:click={() => clerkPanelMode.set('chat')}>Chat</button><button class:active={$clerkPanelMode === 'drafts'} on:click={() => clerkPanelMode.set('drafts')}>Drafts <b>{$clerkDrafts.filter((draft) => draft.status === 'pending').length}</b></button><button class:active={$clerkPanelMode === 'history'} on:click={() => clerkPanelMode.set('history')}>History</button></div>{/if}</aside>

<style>
  .clerk-sidebar{display:grid;grid-template-rows:auto minmax(0,1fr) auto;min-width:0;height:100%;border-right:1px solid var(--border-custom);background:var(--bg-primary);color:var(--text-main)}.sidebar-content{min-width:0;min-height:0;overflow:hidden}.clerk-content{display:grid;grid-template-rows:minmax(0,1fr);height:100%;min-height:0;padding:1rem}.clerk-mode{display:grid;align-content:start;gap:.7rem;min-height:0;overflow-y:auto}.clerk-mode header{display:flex;align-items:center;justify-content:space-between}.clerk-mode h3{margin:0}.clerk-mode article{padding:.7rem;border:1px solid var(--border-custom);border-radius:.55rem;background:var(--bg-elevated)}.clerk-mode article p{color:var(--text-muted)}.clerk-mode button{padding:.45rem .6rem;border:1px solid var(--border-custom);border-radius:.4rem;background:var(--bg-elevated);color:var(--text-main);cursor:pointer}.session-open{display:grid;width:100%;text-align:left}.session-open small{color:var(--text-muted)}.clerk-sidebar-footer{display:grid;grid-template-columns:repeat(3,1fr);padding:0;border-top:1px solid var(--border-custom);color:var(--text-muted);font-size:.72rem;text-align:center}.clerk-sidebar-footer button{position:relative;height:3.2rem;padding:0 .5rem;border:0;background:transparent;color:inherit;cursor:pointer}.clerk-sidebar-footer b{color:var(--text-main)}
  .clerk-sidebar,.sidebar-content,.clerk-content{min-height:0}.clerk-sidebar{overflow:hidden}.sidebar-content{display:grid;overflow:hidden}.clerk-content{overflow:hidden}.clerk-sidebar-footer button.active{color:var(--text-main);font-weight:700}.clerk-sidebar-footer button.active::after{position:absolute;right:0;bottom:0;left:0;height:3px;background:var(--text-main);content:""}
</style>
