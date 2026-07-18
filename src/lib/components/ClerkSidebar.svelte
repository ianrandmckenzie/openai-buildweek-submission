<script lang="ts">
  import { activeView, clerkOpen, navigateTo, views } from '../ui/navigation';
  import { get } from 'svelte/store';

  export let projects: string[] = [];
  const currentView = get(activeView);
</script>

<aside class="clerk-sidebar" aria-label="Clerk and project navigation">
  <div class="sidebar-header">
    <div class="brand-mark" aria-hidden="true">K</div>
    <div>
      <p class="eyebrow">Kenzie Dashboard</p>
      <h1>Clerk</h1>
    </div>
    <button class="icon-button" aria-label="Close Clerk" on:click={() => clerkOpen.set(false)}>×</button>
  </div>

  <div class="assistant-card">
    <span class="status-dot" aria-hidden="true"></span>
    <div><strong>Ready when you are</strong><p>Ask Clerk to organize your workspace.</p></div>
  </div>

  <nav aria-label="Workspace views">
    <p class="section-label">Workspace</p>
    {#each views as view}
      <button class:active={$activeView === view.id} class="nav-item" aria-current={$activeView === view.id ? 'page' : undefined} on:click={() => navigateTo(view.id)}>
        <span class="nav-icon" aria-hidden="true"><img src="/icons/blank/empty.svg" alt="" /></span>{view.label}
      </button>
    {/each}
  </nav>

  <div class="projects">
    <p class="section-label">Projects</p>
    {#if projects.length}
      {#each projects as project}<button class="project-item"><span class="project-dot" aria-hidden="true"></span>{project}</button>{/each}
    {:else}<p class="empty-projects">No projects yet</p>{/if}
  </div>

  <div class="sidebar-footer"><button class="settings-button"><img src="/icons/blank/empty.svg" alt="" /> Settings</button></div>
</aside>

<style>
  .clerk-sidebar { display: flex; flex-direction: column; min-width: 17rem; width: 17rem; height: 100%; padding: 1.25rem; border-right: 1px solid var(--border-custom); background: var(--bg-secondary); color: var(--text-main); }
  .sidebar-header { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.25rem; }
  .brand-mark { display: grid; place-items: center; width: 2.25rem; height: 2.25rem; border-radius: .65rem; background: var(--accent-primary); color: var(--text-inverse); font-weight: 800; }
  .eyebrow, .section-label { margin: 0; color: var(--text-muted); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; }
  h1 { margin: .15rem 0 0; font-size: 1.05rem; }
  .icon-button, .settings-button, .nav-item, .project-item { border: 0; cursor: pointer; font: inherit; }
  .icon-button { margin-left: auto; background: transparent; color: var(--text-muted); font-size: 1.3rem; }
  .assistant-card { display: flex; gap: .65rem; padding: .8rem; margin-bottom: 1.4rem; border: 1px solid var(--border-custom); border-radius: .7rem; background: var(--bg-elevated); font-size: .8rem; }
  .assistant-card p { margin: .25rem 0 0; color: var(--text-muted); font-size: .72rem; line-height: 1.35; }
  .status-dot, .project-dot { flex: 0 0 auto; width: .5rem; height: .5rem; margin-top: .28rem; border-radius: 50%; background: var(--accent-primary); }
  nav, .projects { display: grid; gap: .25rem; }
  .projects { margin-top: 1.4rem; }
  .nav-item, .project-item, .settings-button { display: flex; align-items: center; gap: .7rem; width: 100%; padding: .6rem .7rem; border-radius: .5rem; background: transparent; color: var(--text-muted); text-align: left; }
  .nav-item:hover, .nav-item.active, .project-item:hover, .settings-button:hover { background: var(--accent-secondary); color: var(--text-main); }
  .nav-icon img, .settings-button img { width: 1rem; height: 1rem; opacity: .7; }
  .empty-projects { margin: .35rem .7rem; color: var(--text-muted); font-size: .8rem; }
  .sidebar-footer { margin-top: auto; }
</style>
