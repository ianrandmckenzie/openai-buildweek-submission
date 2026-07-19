<script lang="ts">
  import { submitClerkInput, clerkMessages } from '../clerk/state';
  import { navigateTo, type ViewId } from '../ui/navigation';
  let prompt = '';
  function submit(): void { if (!prompt.trim()) return; const messages = submitClerkInput(prompt); const command = messages[0].command; if (command === 'open_view') { const view = messages[0].content.split(/\s+/).slice(1).join('') as ViewId; if (['calendar', 'launchpad', 'quicknotes', 'documents', 'time-logs', 'progress'].includes(view)) navigateTo(view); } prompt = ''; }
</script>

<div class="clerk-panel">
  <div class="message-list" aria-live="polite">{#if !$clerkMessages.length}<p class="empty-prompt">Try <code>/open calendar</code>, <code>/task Follow up</code>, or ask anything.</p>{/if}{#each $clerkMessages as message (message.id)}<div class:from-user={message.role === 'user'} class="message"><span>{message.role === 'user' ? 'You' : 'Clerk'}</span><p class="obfuscate-target">{message.content}</p></div>{/each}</div>
  <form class="prompt-form" on:submit|preventDefault={submit}><input aria-label="Ask Clerk" bind:value={prompt} placeholder="Ask Clerk…" /><button aria-label="Send to Clerk" type="submit">↑</button></form>
</div>

<style>
  .clerk-panel { display: grid; grid-template-rows: minmax(5rem, 1fr) auto; gap: .7rem; min-height: 10rem; } .message-list { display: grid; align-content: end; gap: .45rem; overflow: auto; max-height: 14rem; } .empty-prompt { margin: 0; color: var(--text-muted); font-size: .74rem; line-height: 1.5; } code { padding: .1rem .2rem; border-radius: .2rem; background: var(--accent-secondary); color: var(--text-main); } .message { padding: .45rem .55rem; border-radius: .45rem; background: var(--accent-secondary); font-size: .75rem; } .message.from-user { background: var(--bg-elevated); } .message span { color: var(--text-muted); font-size: .65rem; } .message p { margin: .2rem 0 0; } .prompt-form { display: flex; gap: .35rem; } input { min-width: 0; flex: 1; padding: .55rem; border: 1px solid var(--border-custom); border-radius: .4rem; background: var(--bg-elevated); color: var(--text-main); } button { width: 2rem; border: 1px solid var(--border-custom); border-radius: .4rem; background: var(--accent-primary); color: var(--text-inverse); cursor: pointer; }
</style>
