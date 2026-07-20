<script lang="ts">
  import { activeViewLabel, clerkOpen, toggleClerk } from '../ui/navigation';
  import { syncLabel as syncLabels, syncState } from '../ui/sync';
  import { globalThemeMode, toggleGlobalTheme } from '../theme/theme';
  import { toggleSettings } from '../ui/settings';
  import PrivacyControl from './PrivacyControl.svelte';
  import { activeTimeLog, timerSetup, openTimerSetup, cancelTimerSetup, startTimer, pauseTimer, stopTimer, formatTime } from '../time/state';
  import { projects, selectedProjectId } from '../projects/state';
  let timerTitle = ''; let timerProject = '';
  $: if ($selectedProjectId && !timerProject) timerProject = $selectedProjectId;
  export let syncLabel: string | undefined;
</script>

<header class="top-bar">
  <div class="brand-group"><strong class="brand">Kenzie<span>Dashboard</span></strong><span class="project-pill">Default Project</span><button class="header-icon" class:dark-mode={$globalThemeMode === 'dark'} aria-label={$globalThemeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={$globalThemeMode === 'dark'} title={$globalThemeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} on:click={toggleGlobalTheme}><img src={`/tmp-icons/${$globalThemeMode === 'dark' ? 'sun' : 'moon'}.svg`} alt="" /></button><PrivacyControl /><button class="header-icon" aria-label="Settings" on:click={toggleSettings}><img src="/tmp-icons/settings-cog.svg" alt="" /></button><button class="header-icon" aria-label="Sync"><img src="/tmp-icons/sync.svg" alt="" /></button>{#if $activeTimeLog}<div class="timer-control"><button class="timer-button" aria-label="Pause timer" on:click={pauseTimer}><img src="/tmp-icons/pause.svg" alt="" /></button><button class="stop-button" aria-label="Stop timer" on:click={stopTimer}><img src="/tmp-icons/stop.svg" alt="" /></button></div><span class="running-label">RUNNING</span><time>{formatTime($activeTimeLog.duration_seconds)}</time>{:else}<button class="header-icon" aria-label="Start timer" on:click={openTimerSetup}><img src="/tmp-icons/play.svg" alt="" /></button>{/if}</div>
  {#if $timerSetup}<form class="timer-setup" on:submit|preventDefault={()=>startTimer(timerTitle,'',timerProject)}><input aria-label="Time entry title" bind:value={timerTitle} placeholder="What are you working on?" autofocus/><select aria-label="Time entry project" bind:value={timerProject}><option value="">Choose project</option>{#each $projects.filter((project)=>!project.deleted_at) as project}<option value={project.id}>{project.name}</option>{/each}</select><button type="submit">Done</button><button type="button" aria-label="Cancel timer setup" on:click={cancelTimerSetup}>×</button></form>{/if}
  <div class="title-group">{#if !$clerkOpen}<button class="control-button" aria-label="Open Clerk" on:click={toggleClerk}>☰</button>{/if}<div><p class="eyebrow">{$activeViewLabel}</p></div></div>
  <div class="top-actions">
    <span class="sync-status"><span class="status-dot" class:syncing={$syncState === 'syncing'} aria-hidden="true"></span>{syncLabel ?? syncLabels[$syncState]}</span>
  </div>
</header>

<style>
  .top-bar { display: flex; align-items: center; justify-content: space-between; min-height: 4rem; padding: 0 .65rem; border-bottom: 1px solid var(--border-custom); background: var(--bg-primary); }
  .brand-group, .title-group, .top-actions, .sync-status { display: flex; align-items: center; gap: .75rem; }
  .brand { font: 700 1.15rem Georgia, serif; color: var(--text-main); } .brand span { font-family: system-ui, sans-serif; font-weight: 400; } .project-pill { padding: .35rem .65rem; border: 1px solid var(--border-custom); border-radius: 1rem; background: var(--bg-secondary); color: var(--text-main); font-size: .72rem; } .header-icon { display: grid; place-items: center; border: 0; background: transparent; color: var(--text-main); cursor: pointer; } .header-icon img { width: 1.2rem; height: 1.2rem; }
  .eyebrow { margin: 0; color: var(--text-muted); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; }
  .timer-control { display: flex; position: relative; } .timer-control .stop-button { display: none; position: absolute; left: 2.3rem; top: 0; } .timer-control:hover .stop-button { display: grid; } .timer-button, .stop-button { display: grid; place-items: center; width: 2rem; height: 2rem; padding: .35rem; border: 1px solid var(--border-custom); border-radius: .4rem; background: var(--bg-elevated); cursor: pointer; } .timer-button img, .stop-button img { width: 1rem; height: 1rem; } .running-label { color: var(--text-muted); font-size: .72rem; } time { font: 1rem ui-monospace, monospace; }
  .timer-setup { position: absolute; z-index: 5; top: 4.2rem; left: 34%; display: flex; align-items: center; gap: .4rem; padding: .7rem; border: 1px solid var(--border-custom); border-radius: .5rem; background: var(--bg-primary); box-shadow: 0 .5rem 1.5rem rgb(0 0 0/.15); } .timer-setup input, .timer-setup select, .timer-setup button { padding: .55rem .7rem; border: 1px solid var(--border-custom); border-radius: .4rem; background: var(--bg-elevated); color: var(--text-main); } .timer-setup input { width: 20rem; } .timer-setup button[type="submit"] { background: var(--accent-primary); color: var(--text-inverse); cursor: pointer; }
  h2 { margin: .15rem 0 0; font-size: 1.25rem; }
  .sync-status { color: var(--text-muted); font-size: .78rem; }
  .status-dot { width: .45rem; height: .45rem; border-radius: 50%; background: var(--accent-primary); }
  .status-dot.syncing { animation: pulse 1s ease-in-out infinite; }
  .control-button { display: grid; place-items: center; min-width: 2rem; min-height: 2rem; padding: .35rem; border: 1px solid var(--border-custom); border-radius: .45rem; background: var(--bg-elevated); color: var(--text-main); cursor: pointer; }
  .control-button img { width: 1rem; height: 1rem; }
  @keyframes pulse { 50% { opacity: .35; } }
</style>
