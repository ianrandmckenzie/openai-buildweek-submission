<script lang="ts">
  import { dismissToast, toasts } from '../ui/toast';
</script>

<div class="toast-region" aria-live="polite" aria-atomic="true">
  {#each $toasts as toast (toast.id)}
    <div class="toast" class:error={toast.tone === 'error'} class:info={toast.tone === 'info'} role={toast.tone === 'error' ? 'alert' : 'status'}>
      <span>{toast.message}</span>
      <button aria-label="Dismiss notification" on:click={() => dismissToast(toast.id)}>×</button>
    </div>
  {/each}
</div>

<style>
  .toast-region { position: fixed; z-index: 10000; right: 1rem; bottom: 1rem; display: grid; gap: .6rem; width: min(24rem, calc(100vw - 2rem)); pointer-events: none; }
  .toast { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; padding: .85rem 1rem; border: 1px solid color-mix(in srgb, var(--accent-primary) 45%, var(--border-custom)); border-radius: .55rem; background: var(--bg-primary); color: var(--text-main); box-shadow: 0 .8rem 2.5rem rgb(0 0 0 / .28); font-size: .82rem; pointer-events: auto; }
  .toast.error { border-color: #c84d5d; }
  .toast.info { border-color: var(--border-custom); }
  button { flex: 0 0 auto; border: 0; background: transparent; color: inherit; font-size: 1.1rem; line-height: 1; cursor: pointer; }
</style>
