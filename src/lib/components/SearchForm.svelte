<script lang="ts">

  export let row = false;
  export let value: string | null | undefined = undefined;
</script>

<form class="flex items-center w-full gap-2" class:row class:column={!row} action="/search">
  <!-- svelte-ignore a11y-autofocus -->
  <input
    class="max-w-[440px] w-full input p-2"
    placeholder="eg: 100g of kidney beans"
    name="query"
    autofocus
    bind:value
  />
  <button class="btn variant-filled-primary">Search</button>
</form>

<style>
  .row {
    @apply flex-row items-center;
  }

  .column {
    @apply flex-col;
  }
</style>
