import { getFood } from "$lib/data/getFood.server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, setHeaders }) => {
  const query = url.searchParams.get("query");

  if (!query)
    return {
      noResults: true,
    };

  setHeaders({ "cache-control": "s-maxage=5000" });

  const food = await getFood(query);

  if (!food)
    return {
      query,
      noResults: true,
    };

  return { query, food };
};
