<script lang="ts">
  import { activeView, activeViewLabel, clerkOpen } from '../ui/navigation';
  import { loadProjects } from '../projects/state';
  import ClerkSidebar from './ClerkSidebar.svelte';
  import CalendarView from './CalendarView.svelte';
  import LaunchpadView from './LaunchpadView.svelte';
  import QuicknotesView from './QuicknotesView.svelte';
  import DocumentsView from './DocumentsView.svelte';
  import ProgressView from './ProgressView.svelte';
  import TimeLogsView from './TimeLogsView.svelte';
  import SettingsPanel from './SettingsPanel.svelte';
  import { settingsOpen, settingsTab } from '../ui/settings';
  import { createShortcutListener } from '../controls/shortcuts';
  import ShortcutOverlay from './ShortcutOverlay.svelte';
  import { onMount } from 'svelte';
  import ProjectRail from './ProjectRail.svelte';
  import ViewTabs from './ViewTabs.svelte';
  onMount(() => { void loadProjects(); return createShortcutListener().destroy; });
  import MainCanvas from './MainCanvas.svelte';
  import TopBar from './TopBar.svelte';
  export let projects: string[] = [];
</script>

<div class="app-shell" class:clerk-collapsed={!$clerkOpen}>
  <div class="header-row"><TopBar /></div>
  <div class="body-row"><ProjectRail />{#if $clerkOpen}<ClerkSidebar />{/if}<div class="content-column"><ViewTabs /><MainCanvas view={$activeViewLabel}>{#if $activeView === 'calendar'}<CalendarView />{:else if $activeView === 'launchpad'}<LaunchpadView />{:else if $activeView === 'quicknotes'}<QuicknotesView />{:else if $activeView === 'documents'}<DocumentsView />{:else if $activeView === 'progress'}<ProgressView />{:else if $activeView === 'time-logs'}<TimeLogsView />{/if}</MainCanvas></div>
  </div>
  {#if $settingsOpen}<SettingsPanel initialTab={$settingsTab} />{/if}
  <ShortcutOverlay />
</div>

<style>
  .app-shell { display: grid; grid-template-rows: auto minmax(0, 1fr); height: 100vh; min-height: 32rem; overflow: hidden; background: var(--bg-primary); color: var(--text-main); } .header-row { min-width: 0; } .body-row { display: grid; grid-template-columns: 4rem 27rem minmax(0, 1fr); min-height: 0; } .app-shell.clerk-collapsed .body-row { grid-template-columns: 4rem minmax(0, 1fr); } .content-column { display: grid; grid-template-rows: auto minmax(0, 1fr); min-width: 0; min-height: 0; } :global(h1), :global(h2), :global(h3), :global(h4), :global(h5) { font-family: Georgia, 'Times New Roman', serif; } @media (max-width: 900px) { .body-row { grid-template-columns: 4rem minmax(0, 1fr); } :global(.clerk-sidebar) { position: absolute; z-index: 3; left: 4rem; width: min(27rem, calc(100vw - 4rem)); height: calc(100vh - 4rem); box-shadow: 0 1rem 3rem rgb(0 0 0 / .2); } }
</style>
