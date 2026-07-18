<script lang="ts">
  import { activeView, activeViewLabel, clerkOpen } from '../ui/navigation';
  import ClerkSidebar from './ClerkSidebar.svelte';
  import CalendarView from './CalendarView.svelte';
  import LaunchpadView from './LaunchpadView.svelte';
  import QuicknotesView from './QuicknotesView.svelte';
  import DocumentsView from './DocumentsView.svelte';
  import ProgressView from './ProgressView.svelte';
  import MainCanvas from './MainCanvas.svelte';
  import TopBar from './TopBar.svelte';
  export let projects: string[] = [];
</script>

<div class="app-shell" class:clerk-collapsed={!$clerkOpen}>
  {#if $clerkOpen}<ClerkSidebar {projects} />{/if}
  <div class="content-column"><TopBar /><MainCanvas view={$activeViewLabel}>{#if $activeView === 'calendar'}<CalendarView />{:else if $activeView === 'launchpad'}<LaunchpadView />{:else if $activeView === 'quicknotes'}<QuicknotesView />{:else if $activeView === 'documents'}<DocumentsView />{:else if $activeView === 'progress'}<ProgressView />{/if}</MainCanvas></div>
</div>

<style>
  .app-shell { display: grid; grid-template-columns: 17rem minmax(0, 1fr); height: 100vh; min-height: 32rem; overflow: hidden; background: var(--bg-primary); color: var(--text-main); }
  .app-shell.clerk-collapsed { grid-template-columns: minmax(0, 1fr); }
  .content-column { display: grid; grid-template-rows: auto minmax(0, 1fr); min-width: 0; min-height: 0; }
  @media (max-width: 720px) { .app-shell { grid-template-columns: minmax(0, 1fr); } :global(.clerk-sidebar) { position: absolute; z-index: 2; width: min(17rem, 88vw); box-shadow: 0 1rem 3rem rgb(0 0 0 / .2); } }
</style>
