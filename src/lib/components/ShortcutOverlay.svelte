<script lang="ts">
  import { shortcutAction } from '../controls/shortcuts';
  import { activeViewLabel } from '../ui/navigation';
</script>
{#if $shortcutAction}<div class="shortcut-toast" role="status">{#if $shortcutAction === 'new_event'}New event ready in {$activeViewLabel}. {:else if $shortcutAction === 'new_note'}Quicknote ready. {:else if $shortcutAction === 'focus_clerk'}Clerk focused. {:else}Settings opened.{/if}</div>{/if}
<style>.shortcut-toast { position: fixed; z-index: 20; right: 1rem; bottom: 1rem; padding: .7rem .9rem; border: 1px solid var(--border-custom); border-radius: .5rem; background: var(--bg-elevated); color: var(--text-main); box-shadow: 0 .5rem 1.5rem rgb(0 0 0 / .2); font-size: .78rem; }</style>
