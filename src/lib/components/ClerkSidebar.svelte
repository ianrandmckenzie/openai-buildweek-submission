<script lang="ts">
  import { clerkOpen } from '../ui/navigation';
  import { sidebarView, showsClerkFooter } from '../ui/sidebar';
  import SidebarTabs from './SidebarTabs.svelte';
  import ClerkPanel from './ClerkPanel.svelte';
  import SearchSidebar from './SearchSidebar.svelte';
  import RoutinesSidebar from './RoutinesSidebar.svelte';
  import DocsSidebar from './DocsSidebar.svelte';
</script>
<aside class="clerk-sidebar" aria-label="Focus sidebar"><SidebarTabs /><div class="sidebar-content">{#if $sidebarView === 'clerk'}<div class="clerk-content"><div class="clerk-empty"><p>Type or speak a request below.</p><small>e.g. “What's on my calendar this week?” or “Add a meeting with Sarah tomorrow at 2pm”</small></div><ClerkPanel /></div>{:else if $sidebarView === 'search'}<SearchSidebar />{:else if $sidebarView === 'routines'}<RoutinesSidebar />{:else}<DocsSidebar />{/if}</div>{#if showsClerkFooter($sidebarView)}<div class="sidebar-footer"><span>Chat</span><span>Drafts <b>0</b></span><span>History</span></div>{/if}</aside>
<style>.clerk-sidebar { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; min-width: 0; height: 100%; border-right: 1px solid var(--border-custom); background: var(--bg-primary); color: var(--text-main); }  .sidebar-content { min-width: 0; min-height: 0; overflow: hidden; } .sidebar-content > :global(.focus-panel) { min-height: 100%; } .clerk-content { display: grid; grid-template-rows: minmax(0, 1fr) auto; height: 100%; padding: 1rem; } .clerk-empty { display: grid; align-content: center; justify-items: center; color: var(--text-muted); text-align: center; } .clerk-empty p { margin: 0; font-size: .8rem; } .clerk-empty small { max-width: 25rem; margin-top: .35rem; font-size: .7rem; line-height: 1.4; } .sidebar-footer { display: grid; grid-template-columns: repeat(3, 1fr); padding: .7rem 0; border-top: 1px solid var(--border-custom); color: var(--text-muted); font-size: .72rem; text-align: center; } .sidebar-footer span:first-child { color: var(--text-main); font-weight: 700; } b { color: var(--text-main); }</style>
