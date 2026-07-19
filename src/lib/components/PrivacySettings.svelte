<script lang="ts">
  import { blurLevel, blurStrength, blurStrengths, setBlurLevel } from '../ui/privacy';
  import { defaultVisibilitySettings, type ScopedView, type VisibilitySettings } from '../projects/scope';
  import { views } from '../ui/navigation';
  export let visibility: VisibilitySettings = { ...defaultVisibilitySettings };
  export let onChange: (visibility: VisibilitySettings) => void = () => undefined;
  const scopedViews = views as Array<{ id: ScopedView; label: string }>;
  function changeView(view: ScopedView): void { visibility = { ...visibility, [view]: !visibility[view] }; onChange(visibility); }
</script>
<section class="privacy-settings"><h4>Privacy and project visibility</h4><label class="range-label">Blur strength: <strong>{$blurStrength.toUpperCase()}</strong><input aria-label="Blur strength" type="range" min="0" max="5" step="1" value={blurLevel($blurStrength)} on:input={(event) => setBlurLevel(Number((event.currentTarget as HTMLInputElement).value))} /><span class="range-scale">{blurStrengths[0].toUpperCase()} · {blurStrengths[5].toUpperCase()}</span></label><p>Allow selected views to show records from every project.</p><div class="visibility-grid">{#each scopedViews as view}<label><input type="checkbox" checked={visibility[view.id]} on:change={() => changeView(view.id)} /> {view.label}</label>{/each}</div></section>
<style>
  .privacy-settings { display: grid; gap: .65rem; padding: 1.5rem 0; border-top: 1px solid var(--border-custom); } h4 { margin: 0; } p { margin: 0; color: var(--text-muted); font-size: .8rem; } .range-label { display: grid; grid-template-columns: auto auto; gap: .35rem .6rem; align-items: center; color: var(--text-main); font-size: .8rem; } input[type='range'] { grid-column: 1 / -1; width: 100%; accent-color: var(--accent-primary); } .range-scale { color: var(--text-muted); font-size: .65rem; } .visibility-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: .45rem; color: var(--text-muted); font-size: .75rem; }
</style>
