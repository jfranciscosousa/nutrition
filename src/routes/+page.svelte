<script lang="ts">
  import { navigating } from "$app/stores";
  import SearchForm from "$lib/components/SearchForm.svelte";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
</script>

<main class="h-screen w-screen flex flex-col items-center justify-center px-4">
  {#if $navigating?.type === "form"}
    <ProgressRadial />
  {:else}
    <SearchForm />
  {/if}
</main>
