<script lang="ts">
  import { onDestroy } from 'svelte';
  import { TaskTimer, formatTimer, type TimerClock } from '../time/timer';
  export let tasks: Array<{ id: string; title: string }> = [];
  export let onLog: (log: { taskId: string; startedAt: number; endedAt: number; duration_seconds: number }) => void = () => undefined;
  const timer = new TaskTimer(); let selectedTask = ''; let active: any = null;
  const unsubscribe = timer.active.subscribe((value) => { active = value; });
  function toggle(): void { if (active) { const log = timer.stop(); if (log) onLog(log); } else if (selectedTask) timer.start(selectedTask); }
  onDestroy(() => { unsubscribe(); timer.destroy(); });
</script>

<div class="time-logs-view" aria-label="Time Logs"><div class="time-toolbar"><div><p class="eyebrow">Live tracking</p><h4>Time Logs</h4></div><div class="timer-controls"><select aria-label="Task to track" bind:value={selectedTask}><option value="">Choose a task</option>{#each tasks as task}<option value={task.id}>{task.title}</option>{/each}</select><button disabled={!active && !selectedTask} on:click={toggle}>{active ? 'Stop timer' : 'Start timer'}</button></div></div>{#if active}<div class="active-timer"><span class="pulse"></span><div><strong>{tasks.find((task) => task.id === active.taskId)?.title ?? active.taskId}</strong><small>Tracking now</small></div><time>{formatTimer(active.elapsedSeconds)}</time></div>{:else}<div class="empty-state"><h5>No active timer</h5><p>Select a task to begin tracking.</p></div>{/if}</div>

<style>
  .time-logs-view { padding: 1rem; } .time-toolbar, .timer-controls, .active-timer { display: flex; align-items: center; } .time-toolbar { justify-content: space-between; gap: 1rem; } .eyebrow { margin: 0; color: var(--text-muted); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; } h4 { margin: .2rem 0 0; font-size: 1.1rem; } select, button { padding: .55rem .7rem; border: 1px solid var(--border-custom); border-radius: .4rem; background: var(--bg-elevated); color: var(--text-main); } button { background: var(--accent-primary); color: var(--text-inverse); cursor: pointer; } button:disabled { cursor: not-allowed; opacity: .5; } .timer-controls { gap: .4rem; }
  .active-timer { gap: .75rem; margin-top: 1.25rem; padding: 1rem; border: 1px solid var(--accent-primary); border-radius: .65rem; background: var(--bg-elevated); } .active-timer div { display: grid; gap: .2rem; flex: 1; } .active-timer small { color: var(--text-muted); } time { font: 1.5rem ui-monospace, monospace; } .pulse { width: .6rem; height: .6rem; border-radius: 50%; background: var(--accent-primary); animation: pulse 1s infinite; } .empty-state { padding: 4rem 1rem; color: var(--text-muted); text-align: center; } .empty-state h5 { margin: 0; color: var(--text-main); } @keyframes pulse { 50% { opacity: .3; } } @media (max-width: 720px) { .time-toolbar { align-items: stretch; flex-direction: column; } .timer-controls { width: 100%; } select, button { flex: 1; } }
</style>
