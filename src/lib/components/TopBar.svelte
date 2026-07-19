<script lang="ts">
  import { activeViewLabel, clerkOpen, toggleClerk } from '../ui/navigation';
  import { syncLabel as syncLabels, syncState } from '../ui/sync';
  import PrivacyControl from './PrivacyControl.svelte';
  import { toggleSettings } from '../ui/settings';
  import { globalThemeMode, toggleGlobalTheme } from '../theme/theme';
  export let syncLabel: string | undefined;
</script>

<header class="top-bar">
  <div class="brand-group"><strong class="brand">Kenzie<span>Dashboard</span></strong><span class="project-pill">Default Project</span><button class="header-icon" class:dark-mode={$globalThemeMode === 'dark'} aria-label={$globalThemeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={$globalThemeMode === 'dark'} title={$globalThemeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} on:click={toggleGlobalTheme}>{$globalThemeMode === 'dark' ? '☀' : '☾'}</button><button class="header-icon" aria-label="Privacy">◉</button><button class="header-icon" aria-label="Settings" on:click={toggleSettings}>⚙</button><button class="header-icon" aria-label="Sync">↻</button><button class="header-icon" aria-label="Start timer">▷</button></div>
  <div class="title-group">{#if !$clerkOpen}<button class="control-button" aria-label="Open Clerk" on:click={toggleClerk}>☰</button>{/if}<div><p class="eyebrow">{$activeViewLabel}</p></div></div>
  <div class="top-actions">
    <span class="sync-status"><span class="status-dot" class:syncing={$syncState === 'syncing'} aria-hidden="true"></span>{syncLabel ?? syncLabels[$syncState]}</span>
    <PrivacyControl />
    <button class="control-button" aria-label="Open settings" on:click={toggleSettings}>⚙</button>
  </div>
</header>

<style>
  .top-bar { display: flex; align-items: center; justify-content: space-between; min-height: 4rem; padding: 0 .65rem; border-bottom: 1px solid var(--border-custom); background: var(--bg-primary); }
  .brand-group, .title-group, .top-actions, .sync-status { display: flex; align-items: center; gap: .75rem; }
  .brand { font: 700 1.15rem Georgia, serif; color: var(--text-main); } .brand span { font-family: system-ui, sans-serif; font-weight: 400; } .project-pill { padding: .35rem .65rem; border: 1px solid var(--border-custom); border-radius: 1rem; background: var(--bg-secondary); color: var(--text-main); font-size: .72rem; } .header-icon { border: 0; background: transparent; color: var(--text-main); font-size: 1.2rem; cursor: pointer; }
  .eyebrow { margin: 0; color: var(--text-muted); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; }
  h2 { margin: .15rem 0 0; font-size: 1.25rem; }
  .sync-status { color: var(--text-muted); font-size: .78rem; }
  .status-dot { width: .45rem; height: .45rem; border-radius: 50%; background: var(--accent-primary); }
  .status-dot.syncing { animation: pulse 1s ease-in-out infinite; }
  .control-button { display: grid; place-items: center; min-width: 2rem; min-height: 2rem; padding: .35rem; border: 1px solid var(--border-custom); border-radius: .45rem; background: var(--bg-elevated); color: var(--text-main); cursor: pointer; }
  .control-button img { width: 1rem; height: 1rem; }
  @keyframes pulse { 50% { opacity: .35; } }
</style>
