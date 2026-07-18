<script lang="ts">
  import { activeViewLabel, clerkOpen, toggleClerk } from '../ui/navigation';
  import { syncLabel as syncLabels, syncState } from '../ui/sync';
  import PrivacyControl from './PrivacyControl.svelte';
  export let syncLabel: string | undefined;
</script>

<header class="top-bar">
  <div class="title-group">
    {#if !$clerkOpen}<button class="control-button" aria-label="Open Clerk" on:click={toggleClerk}>☰</button>{/if}
    <div><p class="eyebrow">Workspace</p><h2>{$activeViewLabel}</h2></div>
  </div>
  <div class="top-actions">
    <span class="sync-status"><span class="status-dot" class:syncing={$syncState === 'syncing'} aria-hidden="true"></span>{syncLabel ?? syncLabels[$syncState]}</span>
    <PrivacyControl />
    <button class="control-button" aria-label="Open settings"><img src="/icons/blank/empty.svg" alt="" /></button>
  </div>
</header>

<style>
  .top-bar { display: flex; align-items: center; justify-content: space-between; min-height: 4.5rem; padding: 0 1.5rem; border-bottom: 1px solid var(--border-custom); background: var(--bg-primary); }
  .title-group, .top-actions, .sync-status { display: flex; align-items: center; gap: .75rem; }
  .eyebrow { margin: 0; color: var(--text-muted); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; }
  h2 { margin: .15rem 0 0; font-size: 1.25rem; }
  .sync-status { color: var(--text-muted); font-size: .78rem; }
  .status-dot { width: .45rem; height: .45rem; border-radius: 50%; background: var(--accent-primary); }
  .status-dot.syncing { animation: pulse 1s ease-in-out infinite; }
  .control-button { display: grid; place-items: center; min-width: 2rem; min-height: 2rem; padding: .35rem; border: 1px solid var(--border-custom); border-radius: .45rem; background: var(--bg-elevated); color: var(--text-main); cursor: pointer; }
  .control-button img { width: 1rem; height: 1rem; }
  @keyframes pulse { 50% { opacity: .35; } }
</style>
