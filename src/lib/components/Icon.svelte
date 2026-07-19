<script lang="ts">
  export let name: string;
  export let label = '';
  export let size = '1rem';
</script>

<img class="icon" src={`/tmp-icons/${name}.svg`} alt={label} aria-hidden={label ? undefined : 'true'} width={size} height={size} />

<style>
  .icon { display: inline-block; flex: 0 0 auto; object-fit: contain; }
</style>
