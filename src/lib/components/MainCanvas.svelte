<script lang="ts">
  import { activeView } from '../ui/navigation';
  export let view: string;
</script>

<main class="main-canvas" aria-label="Main workspace canvas">
  <div class="canvas-heading"><div><p class="eyebrow">Active view</p><h3>{view}</h3></div><slot name="actions" /></div>
  <section class="view-container" data-view={$activeView}><slot><div class="empty-view"><h4>{view} is ready</h4><p>Content for this workspace will appear here.</p></div></slot></section>
</main>

<style>
  .main-canvas { min-width: 0; overflow: auto; padding: 1.5rem; background: var(--bg-primary); color: var(--text-main); }
  .canvas-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .eyebrow { margin: 0; color: var(--text-muted); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; }
  h3 { margin: .2rem 0 0; font-size: 1.65rem; }
  .view-container { min-height: calc(100% - 4rem); border: 1px solid var(--border-custom); border-radius: .8rem; background: var(--bg-secondary); }
  .empty-view { display: grid; place-content: center; min-height: 20rem; padding: 2rem; text-align: center; }
  h4 { margin: 0; font-size: 1.1rem; } .empty-view p { color: var(--text-muted); }
</style>
