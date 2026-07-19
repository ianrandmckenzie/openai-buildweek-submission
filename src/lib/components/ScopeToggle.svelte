<script lang="ts">
  import { projectViewMode, selectedProject, setProjectViewMode } from '../projects/state';
</script>
<div class="scope-toggle" role="group" aria-label="Project scope"><button class:active={$projectViewMode === 'project'} disabled={!$selectedProject} on:click={() => setProjectViewMode('project')}>This project</button><button class:active={$projectViewMode === 'all'} on:click={() => setProjectViewMode('all')}>All projects</button></div>
<style>.scope-toggle { display: inline-flex; border: 1px solid var(--border-custom); border-radius: .4rem; overflow: hidden; } button { padding: .45rem .65rem; border: 0; border-right: 1px solid var(--border-custom); background: var(--bg-elevated); color: var(--text-muted); cursor: pointer; font-size: .72rem; } button:last-child { border-right: 0; } button.active { background: var(--accent-secondary); color: var(--text-main); font-weight: 700; } button:disabled { cursor: not-allowed; opacity: .45; }</style>
