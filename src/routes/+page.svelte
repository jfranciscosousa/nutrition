<script lang="ts">
  import { navigating } from "$app/stores";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
</script>

<main class="h-screen w-screen flex flex-col items-center justify-center px-4">
  {#if $navigating?.type === "form"}
    <ProgressRadial />
  {:else}
    <form class="flex flex-col items-center w-full" action="/search">
      <!-- svelte-ignore a11y-autofocus -->
      <input
        class="max-w-[440px] w-full input p-2"
        placeholder="eg: 100g of kidney beans"
        name="query"
        autofocus
      />
      <button class="btn variant-filled-primary mt-4">Search</button>
    </form>
  {/if}
</main>
