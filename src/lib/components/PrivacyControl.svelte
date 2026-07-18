<script lang="ts">
  import { blurStrength, cycleObfuscation, obfuscationLabel, obfuscationMode, setBlurStrength } from '../ui/privacy';
  import { blurValues, type BlurStrength } from '../ui/privacy';
</script>

<div class="privacy-control">
  <button class="control-button" aria-label="Cycle privacy obfuscation" aria-pressed={$obfuscationMode !== 'none'} title={obfuscationLabel($obfuscationMode)} on:click={cycleObfuscation}><img src="/icons/blank/empty.svg" alt="" /></button>
  <label class="blur-control"> <span>Blur</span><select aria-label="Blur strength" value={$blurStrength} on:change={(event) => setBlurStrength((event.currentTarget as HTMLSelectElement).value as BlurStrength)}>{#each Object.keys(blurValues) as strength}<option value={strength}>{strength.toUpperCase()}</option>{/each}</select></label>
</div>

<style>
  .privacy-control { display: flex; align-items: center; gap: .5rem; }
  .control-button { display: grid; place-items: center; min-width: 2rem; min-height: 2rem; padding: .35rem; border: 1px solid var(--border-custom); border-radius: .45rem; background: var(--bg-elevated); color: var(--text-main); cursor: pointer; }
  .control-button img { width: 1rem; height: 1rem; }
  .blur-control { display: flex; align-items: center; gap: .3rem; color: var(--text-muted); font-size: .72rem; }
  select { max-width: 3.8rem; padding: .28rem; border: 1px solid var(--border-custom); border-radius: .35rem; background: var(--bg-elevated); font-size: .7rem; }
</style>
