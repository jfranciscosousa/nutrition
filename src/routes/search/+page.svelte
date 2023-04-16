<script lang="ts">
  import { ConicGradient, ProgressRadial, type ConicStop } from "@skeletonlabs/skeleton";
  import type { PageData } from "./$types";
  import SearchForm from "$lib/components/SearchForm.svelte";
  import { navigating } from "$app/stores";

  export let data: PageData;
  let stats: ConicStop[];

  $: if (data.food) {
    const { nfTotalFat, nfProtein, nfTotalCarbohydrate, nfDietaryFiber } = data.food;
    const total = nfTotalFat + nfProtein + nfTotalCarbohydrate + nfDietaryFiber;
    const protein = Math.round((nfProtein * 100) / total);
    const carbs = Math.round((nfTotalCarbohydrate * 100) / total);
    const fat = Math.round((nfTotalFat * 100) / total);
    const fiber = Math.round((nfDietaryFiber * 100) / total);

    stats = [
      { label: "Protein", color: "red", start: 0, end: protein },
      { label: "Carbs", color: "green", start: protein, end: protein + carbs },
      { label: "Fat", color: "yellow", start: protein + carbs, end: protein + carbs + fat },
      {
        label: "Fiber",
        color: "brown",
        start: protein + carbs + fat,
        end: protein + carbs + fat + fiber,
      },
    ];
  }
</script>

{#if $navigating?.type === "form"}
  <main class="h-screen w-screen flex flex-col items-center justify-center px-4">
    <ProgressRadial />
  </main>
{:else}
  <main class="max-w-xl mx-auto py-16 px-4">
    <div class="mb-8">
      <SearchForm row value={data.query} />
    </div>

    {#if data.food}
      <h1 class="capitalize">{data.food.foodName}</h1>

      <div class="grid grid-cols-2 md:grid-cols-1">
        <div class="mt-8 flex flex-col gap-2">
          <p class="text-lg font-semibold">Serving size: {data.food.servingWeightGrams}g</p>
          <p>{data.food.nfCalories}kcal</p>
          <p>{data.food.nfTotalFat}g total fat</p>
          <p>{data.food.nfSaturatedFat}g saturated fat</p>
          <p>{data.food.nfProtein}g protein</p>
          <p>{data.food.nfTotalCarbohydrate}g carbs</p>
          <p>{data.food.nfSugars}g sugars</p>
          <p>{data.food.nfDietaryFiber}g fiber</p>
        </div>

        <div class="w-[200px] md:mt-12">
          <ConicGradient stops={stats} legend />
        </div>
      </div>
    {:else}
      <p>No results!</p>
    {/if}

    <a href="/" class="mt-12 block">Back</a>
  </main>
{/if}
