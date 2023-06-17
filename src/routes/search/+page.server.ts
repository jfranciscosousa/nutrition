import { getFoods } from "$lib/data/getFood.server";
import type { PageServerLoad } from "./$types";

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const load: PageServerLoad = async ({ url, setHeaders }) => {
  const query = url.searchParams.get("query");

  if (!query)
    return {
      noResults: true,
    };

  setHeaders({ "cache-control": "s-maxage=5000" });

  const foodResult = await getFoods(query);

  if (foodResult.error) console.error(foodResult.error);

  if (!foodResult.food)
    return {
      query,
      noResults: true,
      meta: {
        title: "No results!",
      },
    };

  return { query, food: foodResult.food, meta: { title: capitalize(query) } };
};
