<script lang="ts">
  import { sidebarView, sidebarViews, setSidebarView } from '../ui/sidebar';
</script>
<nav class="sidebar-tabs" aria-label="Focus views">{#each sidebarViews as view}<button class:active={$sidebarView === view.id} on:click={() => setSidebarView(view.id)}>{view.label}</button>{/each}</nav>
<style>.sidebar-tabs { display: grid; grid-template-columns: repeat(4, 1fr); min-height: 3rem; border-bottom: 1px solid var(--border-custom); } button { border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--text-muted); cursor: pointer; font: inherit; font-size: .78rem; } button.active { border-color: var(--text-main); color: var(--text-main); font-weight: 700; }</style>
