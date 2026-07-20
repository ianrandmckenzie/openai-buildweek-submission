<script lang="ts">
  import { activeView } from '../ui/navigation';
  export let view: string;
</script>

<main class="main-canvas" aria-label="Main workspace canvas">
  <div class="canvas-actions"><slot name="actions" /></div>
  <section class="view-container" data-view={$activeView}><slot><div class="empty-view"><h4>{view} is ready</h4><p>Content for this workspace will appear here.</p></div></slot></section>
</main>

<style>
  .main-canvas { min-width: 0; overflow: auto; padding: 1rem 1.25rem; background: var(--bg-primary); color: var(--text-main); }
  .canvas-actions { display: flex; align-items: center; justify-content: flex-end; gap: .5rem; margin-bottom: 1.25rem; }
  .view-container { min-height: calc(100% - 4rem); background: var(--bg-primary); }
  .empty-view { display: grid; place-content: center; min-height: 20rem; padding: 2rem; text-align: center; }
  h4 { margin: 0; font-size: 1.1rem; } .empty-view p { color: var(--text-muted); }
</style>
