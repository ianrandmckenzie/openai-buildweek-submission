<script lang="ts">
  import { cycleObfuscation, obfuscationLabel, obfuscationMode } from '../ui/privacy';
</script>

<div class="privacy-control">
  <button class="control-button" aria-label={obfuscationLabel($obfuscationMode)} aria-pressed={$obfuscationMode !== 'none'} title={obfuscationLabel($obfuscationMode)} on:click={cycleObfuscation}><img src={`tmp-icons/${$obfuscationMode === 'all' ? 'obfuscate-all' : $obfuscationMode === 'some' ? 'obfuscated' : 'obfuscation'}.svg`} alt="" /></button>
</div>

<style>
  .privacy-control { display: flex; align-items: center; }
  .control-button { display: grid; place-items: center; min-width: 2rem; min-height: 2rem; padding: .35rem; border: 0; background: transparent; color: var(--text-main); cursor: pointer; }
  .control-button img { width: 1rem; height: 1rem; }
</style>
