<script lang="ts">
  import { activeView, clerkOpen, toggleClerk, navigateTo } from '../ui/navigation';
  import { syncLabel as syncLabels, syncState } from '../ui/sync';
  import { globalThemeMode, globalThemeSetting, toggleGlobalTheme } from '../theme/theme';
  import { toggleSettings } from '../ui/settings';
  import PrivacyControl from './PrivacyControl.svelte';
  import { syncAll } from '../sync/backend-sync';
  import { createCalendarRequest } from '../calendar/open';
  import { createLaunchpadLinkRequest } from '../launchpad/open';
  import { createQuicknoteRequest } from '../quicknotes/open';
  import { createDocument } from '../documents/state';
  import {
    activeTimeLog,
    timerSetup,
    openTimerSetup,
    cancelTimerSetup,
    startTimer,
    pauseTimer,
    stopTimer,
    formatTime,
  } from '../time/state';
  import { projects, selectedProject, selectedProjectId } from '../projects/state';
  let timerTitle = '';
  let timerProject = '';
  let syncing = false;
  let syncMessage = '';
  async function runSync(): Promise<void> { if (syncing) return; syncing = true; syncMessage = 'Syncing…'; const result = await syncAll(); syncMessage = result === 'synced' ? 'Synced' : result === 'skipped' ? 'Local only' : 'Sync failed'; syncing = false; setTimeout(() => (syncMessage = ''), 2200); }
  $: if ($selectedProjectId && !timerProject) timerProject = $selectedProjectId;
  export let syncLabel: string | undefined;
  function createAction(view: string): void { if (view === 'calendar') return createCalendarRequest.set('event'); if (view === 'launchpad') return createLaunchpadLinkRequest.set(true); if (view === 'quicknotes') return createQuicknoteRequest.set(true); if (view === 'documents') { createDocument(); navigateTo('documents'); return; } if (view === 'time-logs') return openTimerSetup(); }
</script>

<header class="top-bar">
  <div class="brand-group">
    <strong class="brand">Kenzie<span>DeskClerk</span></strong><span
      class="project-pill">{$selectedProject?.name ?? 'All projects'}</span
    ><button
      class="header-icon"
      class:dark-mode={$globalThemeMode === 'dark'}
      aria-label={`Theme: ${$globalThemeSetting}`}
      aria-pressed={$globalThemeSetting === 'dark'}
      title={`Theme: ${$globalThemeSetting}. Click to switch.`}
      on:click={toggleGlobalTheme}
      ><img
        src={`tmp-icons/${$globalThemeSetting === 'dark' ? 'sun' : $globalThemeSetting === 'light' ? 'moon' : 'system'}.svg`}
        alt=""
      /></button
    ><PrivacyControl /><button
      class="header-icon"
      aria-label="Settings"
      on:click={toggleSettings}
      ><img src="tmp-icons/settings-cog.svg" alt="" /></button
    ><button class="header-icon" aria-label="Sync" title={syncMessage || 'Sync now'} disabled={syncing} on:click={runSync}
    ><img src="tmp-icons/sync.svg" alt="" /></button
    >{#if $activeTimeLog}<div class="timer-control">
        <button
          class="timer-button"
          aria-label="Pause timer"
          on:click={pauseTimer}
          ><img src="tmp-icons/pause.svg" alt="" /></button
        ><button
          class="stop-button"
          aria-label="Stop timer"
          on:click={stopTimer}><img src="tmp-icons/stop.svg" alt="" /></button
        >
      </div>
      <span class="running-label">RUNNING</span><time
        >{formatTime($activeTimeLog.duration_seconds)}</time
      >{:else}<button
        class="header-icon"
        aria-label="Start timer"
        on:click={openTimerSetup}
        ><img src="tmp-icons/play.svg" alt="" /></button
      >{/if}
  </div>
  {#if $timerSetup}<form
      class="timer-setup"
      on:submit|preventDefault={() => startTimer(timerTitle, '', timerProject)}
    >
      <input
        aria-label="Time entry title"
        bind:value={timerTitle}
        placeholder="What are you working on?"
        autofocus
      /><select aria-label="Time entry project" bind:value={timerProject}
        ><option value="">Choose project</option
        >{#each $projects.filter((project) => !project.deleted_at) as project}<option
            value={project.id}>{project.name}</option
          >{/each}</select
      ><button type="submit">Done</button><button
        type="button"
        aria-label="Cancel timer setup"
        on:click={cancelTimerSetup}>×</button
      >
    </form>{/if}
  <div class="title-group">
    {#if !$clerkOpen}<button
        class="control-button"
        aria-label="Open Clerk"
        on:click={toggleClerk}>☰</button
      >{/if}
    <div class="sync-status"><span class="status-dot" class:syncing={$syncState === 'syncing'}></span>{syncLabel ?? syncLabels[$syncState]}</div>
  </div>
  <div class="top-actions">
    {#if $activeView === 'calendar'}<button class="create-button" on:click={() => createCalendarRequest.set('event')}>New Event</button><button class="create-button" on:click={() => createCalendarRequest.set('task')}>New Task</button>{:else if $activeView === 'launchpad'}<button class="create-button" on:click={() => createAction('launchpad')}>New Link</button>{:else if $activeView === 'quicknotes'}<button class="create-button" on:click={() => createAction('quicknotes')}>New Note</button>{:else if $activeView === 'documents'}<button class="create-button" on:click={() => createAction('documents')}>New Doc</button>{:else if $activeView === 'time-logs'}<button class="create-button" on:click={() => createAction('time-logs')}>Manual Entry</button>{/if}
  </div>
</header>

<style>
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 4rem;
    padding: 0 0.65rem;
    border-bottom: 1px solid var(--border-custom);
    background: var(--bg-primary);
  }
  .brand-group,
  .title-group,
  .top-actions,
  .sync-status {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .create-button {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-custom);
    border-radius: 0.45rem;
    background: var(--bg-elevated);
    color: var(--text-main);
    font: inherit;
    font-size: 0.78rem;
    cursor: pointer;
  }
  .create-button:hover,
  .create-button:focus-visible {
    border-color: var(--accent-primary);
    background: var(--accent-secondary);
  }
  .brand {
    font:
      700 1.3rem 'Grenze Gotisch',
      serif;
    color: var(--text-main);
  }
  .brand span {
    font-family: 'Raleway', sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }
  .project-pill {
    padding: 0.35rem 0.65rem;
    border: 1px solid var(--border-custom);
    border-radius: 1rem;
    background: var(--bg-secondary);
    color: var(--text-main);
    font-size: 0.72rem;
  }
  .header-icon {
    display: grid;
    place-items: center;
    border: 0;
    background: transparent;
    color: var(--text-main);
    cursor: pointer;
  }
  .header-icon img {
    width: 1.2rem;
    height: 1.2rem;
  }
  .eyebrow {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .timer-control {
    display: flex;
    position: relative;
    padding-right: 2.25rem;
  }
  .timer-control .stop-button {
    display: none;
    position: absolute;
    left: 2.3rem;
    top: 0;
  }
  .timer-control:hover .stop-button {
    display: grid;
  }
  .timer-button,
  .stop-button {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    padding: 0.35rem;
    border: 1px solid var(--border-custom);
    border-radius: 0.4rem;
    background: var(--bg-elevated);
    cursor: pointer;
  }
  .timer-button img,
  .stop-button img {
    width: 1rem;
    height: 1rem;
  }
  .running-label {
    color: var(--text-muted);
    font-size: 0.72rem;
  }
  time {
    font:
      1rem ui-monospace,
      monospace;
  }
  .timer-setup {
    position: absolute;
    z-index: 5;
    top: 4.2rem;
    left: 34%;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.7rem;
    border: 1px solid var(--border-custom);
    border-radius: 0.5rem;
    background: var(--bg-primary);
    box-shadow: 0 0.5rem 1.5rem rgb(0 0 0/0.15);
  }
  .timer-setup input,
  .timer-setup select,
  .timer-setup button {
    padding: 0.55rem 0.7rem;
    border: 1px solid var(--border-custom);
    border-radius: 0.4rem;
    background: var(--bg-elevated);
    color: var(--text-main);
  }
  .timer-setup input {
    width: 20rem;
  }
  .timer-setup button[type='submit'] {
    background: var(--accent-primary);
    color: var(--text-inverse);
    cursor: pointer;
  }
  h2 {
    margin: 0.15rem 0 0;
    font-size: 1.25rem;
  }
  .sync-status {
    color: var(--text-muted);
    font-size: 0.78rem;
  }
  .status-dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: var(--accent-primary);
  }
  .status-dot.syncing {
    animation: pulse 1s ease-in-out infinite;
  }
  .control-button {
    display: grid;
    place-items: center;
    min-width: 2rem;
    min-height: 2rem;
    padding: 0.35rem;
    border: 1px solid var(--border-custom);
    border-radius: 0.45rem;
    background: var(--bg-elevated);
    color: var(--text-main);
    cursor: pointer;
  }
  .control-button img {
    width: 1rem;
    height: 1rem;
  }
  @keyframes pulse {
    50% {
      opacity: 0.35;
    }
  }
</style>
