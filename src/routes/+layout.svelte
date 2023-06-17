<script>
  import { page } from "$app/stores";

  import "@skeletonlabs/skeleton/themes/theme-modern.css";
  import "@skeletonlabs/skeleton/styles/all.css";
  import "../app.postcss";
</script>

<svelte:head>
  <title>{$page.data.meta?.title || "Nutrition Bay"}</title>
</svelte:head>

<slot />
