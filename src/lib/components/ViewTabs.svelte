<script lang="ts">
  import { activeView, navigateTo, views } from '../ui/navigation';
</script>
<nav class="view-tabs" aria-label="Main views">{#each views as view}<button class:active={$activeView === view.id} on:click={() => navigateTo(view.id)}>{view.id === 'documents' ? 'Current Doc' : view.label}</button>{/each}</nav>
<style>
  .view-tabs { display: grid; grid-template-columns: repeat(6, 1fr); min-height: 3rem; border-bottom: 1px solid var(--border-custom); background: var(--bg-primary); } button { border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--text-muted); cursor: pointer; font: inherit; font-size: .8rem; } button.active { border-color: var(--text-main); color: var(--text-main); font-weight: 700; }
</style>
