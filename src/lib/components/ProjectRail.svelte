<script lang="ts">
  import { projects, selectedProjectId, selectProject } from '../projects/state';
  import { openSettings } from '../ui/settings';
  import CreateProjectModal from './CreateProjectModal.svelte';
  let createOpen = false;
  function initials(name: string): string { return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }
</script>
<aside class="project-rail" aria-label="Projects"><button class:active={!$selectedProjectId} aria-label="All projects" on:click={() => selectProject(null)}>All</button>{#each $projects.filter((project) => project.deleted_at === null) as project}<button class:active={$selectedProjectId === project.id} aria-label={`Project ${project.name}`} title={project.name} on:click={() => selectProject(project.id)}>{initials(project.name)}</button>{/each}<div class="rail-footer"><button aria-label="Add project" on:click={() => createOpen = true}><img src="/tmp-icons/add-plus.svg" alt="" /></button><button aria-label="Manage projects" on:click={() => openSettings('projects')}><img src="/tmp-icons/settings-cog.svg" alt="" /></button></div></aside>{#if createOpen}<CreateProjectModal on:close={() => createOpen = false} />{/if}
<style>
  .project-rail { display: flex; flex-direction: column; gap: .5rem; width: 4rem; padding: .55rem .45rem; border-right: 1px solid var(--border-custom); background: var(--bg-primary); } button { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border: 1px solid var(--border-custom); border-radius: .7rem; background: var(--bg-elevated); color: var(--text-main); cursor: pointer; font-weight: 700; } button.active { background: #111a32; color: #fff; } .rail-footer { display: grid; gap: .5rem; margin-top: auto; }
</style>
