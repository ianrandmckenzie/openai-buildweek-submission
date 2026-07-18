<script lang="ts">
  import { parseLinkInput, filterLinks, allTags, type LaunchpadLinkInput } from '../launchpad/links';
  export let projectId = 'default';
  export let initialLinks: Array<LaunchpadLinkInput & { id: string }> = [];
  export let onChange: (links: Array<LaunchpadLinkInput & { id: string }>) => void = () => undefined;

  let links = initialLinks;
  let url = ''; let title = ''; let tags = ''; let query = ''; let selectedTag = ''; let error = '';
  $: visibleLinks = filterLinks(links, query, selectedTag || undefined);
  $: tagsList = allTags(links);

  function addLink(): void {
    try { const input = parseLinkInput(url, title, tags, projectId); links = [{ ...input, id: crypto.randomUUID() }, ...links]; onChange(links); url = ''; title = ''; tags = ''; error = ''; }
    catch (cause) { error = cause instanceof Error ? cause.message : 'Unable to add link'; }
  }
  function removeLink(id: string): void { links = links.filter((link) => link.id !== id); onChange(links); }
</script>

<div class="launchpad-view" aria-label="Launchpad">
  <div class="launchpad-toolbar"><div><p class="eyebrow">Quick access</p><h4>Launchpad</h4></div><input aria-label="Search links" bind:value={query} placeholder="Search links…" /></div>
  <form class="link-form" on:submit|preventDefault={addLink}>
    <input aria-label="Link URL" bind:value={url} placeholder="https://example.com" inputmode="url" />
    <input aria-label="Link title" bind:value={title} placeholder="Title (optional)" />
    <input aria-label="Link tags" bind:value={tags} placeholder="Tags, comma separated" />
    <button type="submit">Add link</button>
  </form>
  {#if error}<p class="form-error" role="alert">{error}</p>{/if}
  {#if tagsList.length}<div class="tag-row"><button class:active={!selectedTag} on:click={() => selectedTag = ''}>All</button>{#each tagsList as tag}<button class:active={selectedTag === tag} on:click={() => selectedTag = tag}>#{tag}</button>{/each}</div>{/if}
  {#if visibleLinks.length}
    <div class="link-grid">{#each visibleLinks as link}<article class="link-tile"><a href={link.url} target="_blank" rel="noreferrer"><span class="favicon" aria-hidden="true">{link.title.slice(0, 1).toUpperCase()}</span><span class="link-copy"><strong class="obfuscate-target">{link.title}</strong><small>{new URL(link.url).hostname}</small></span></a><button class="delete-button" aria-label={`Delete ${link.title}`} on:click={() => removeLink(link.id)}>×</button>{#if link.tags?.length}<div class="tile-tags">{#each link.tags as tag}<span>#{tag}</span>{/each}</div>{/if}</article>{/each}</div>
  {:else}<div class="empty-state"><h5>No links found</h5><p>Add a destination above or adjust your search.</p></div>{/if}
</div>

<style>
  .launchpad-view { padding: 1rem; } .launchpad-toolbar, .link-form, .tag-row, .link-tile a { display: flex; align-items: center; }
  .launchpad-toolbar { justify-content: space-between; margin-bottom: 1rem; } .eyebrow { margin: 0; color: var(--text-muted); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; } h4 { margin: .2rem 0 0; font-size: 1.1rem; }
  input { min-width: 0; padding: .6rem .7rem; border: 1px solid var(--border-custom); border-radius: .45rem; background: var(--bg-elevated); color: var(--text-main); } .launchpad-toolbar input { width: min(18rem, 45%); }
  .link-form { gap: .5rem; } .link-form input { flex: 1; } button { padding: .6rem .75rem; border: 1px solid var(--border-custom); border-radius: .45rem; background: var(--accent-primary); color: var(--text-inverse); cursor: pointer; } .form-error { color: var(--text-main); font-size: .78rem; }
  .tag-row { gap: .35rem; margin: 1rem 0; overflow-x: auto; } .tag-row button { padding: .35rem .55rem; background: var(--bg-elevated); color: var(--text-muted); font-size: .72rem; } .tag-row button.active { background: var(--accent-secondary); color: var(--text-main); }
  .link-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr)); gap: .75rem; } .link-tile { position: relative; min-height: 7rem; padding: .85rem; border: 1px solid var(--border-custom); border-radius: .65rem; background: var(--bg-elevated); } .link-tile a { gap: .65rem; color: var(--text-main); text-decoration: none; } .favicon { display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: .5rem; background: var(--accent-secondary); color: var(--text-main); font-weight: 700; } .link-copy { display: grid; gap: .25rem; min-width: 0; } .link-copy strong, .link-copy small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .link-copy small { color: var(--text-muted); font-size: .7rem; }
  .delete-button { position: absolute; top: .45rem; right: .45rem; padding: .1rem .35rem; background: transparent; color: var(--text-muted); font-size: 1rem; } .tile-tags { display: flex; gap: .3rem; margin-top: .85rem; color: var(--text-muted); font-size: .68rem; } .empty-state { padding: 4rem 1rem; text-align: center; } h5 { margin: 0; font-size: 1rem; } .empty-state p { color: var(--text-muted); }
  @media (max-width: 720px) { .launchpad-toolbar, .link-form { align-items: stretch; flex-direction: column; } .launchpad-toolbar input { width: 100%; } }
</style>
