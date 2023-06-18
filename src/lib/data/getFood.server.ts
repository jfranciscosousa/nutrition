import camelcaseKeys, { type CamelCaseKeys } from "camelcase-keys";
import { LRUCache } from "lru-cache";
import { APP_ID, APP_KEY } from "$env/static/private";
import { GET_FOOD_MOCK } from "./getFood.mock";
import { z } from "zod";

const zNumberDefaultZero = z
  .number()
  .nullable()
  .transform((v) => v ?? 0);

export const schema = z.object({
  foods: z.array(
    z.object({
      food_name: z.string(),
      serving_qty: z.number(),
      serving_unit: z.string(),
      serving_weight_grams: z.number(),
      nf_calories: zNumberDefaultZero,
      nf_total_fat: zNumberDefaultZero,
      nf_saturated_fat: zNumberDefaultZero,
      nf_cholesterol: zNumberDefaultZero,
      nf_sodium: zNumberDefaultZero,
      nf_total_carbohydrate: zNumberDefaultZero,
      nf_dietary_fiber: zNumberDefaultZero,
      nf_sugars: zNumberDefaultZero,
      nf_protein: zNumberDefaultZero,
      nf_potassium: zNumberDefaultZero,
      nf_p: zNumberDefaultZero,
    }),
  ),
});

export type FoodElement = CamelCaseKeys<z.TypeOf<typeof schema>, true>["foods"][0];

const cache = new LRUCache<string, FoodElement>({ ttl: 86_400_000 } as any);

export async function getFood(
  query: string,
  remoteUserId = "0",
): Promise<{ food?: FoodElement; error?: never } | { error: unknown; food?: never }> {
  if (import.meta.env.MODE === "e2e") return { food: GET_FOOD_MOCK };

  if (cache.get(query)) return { food: cache.get(query) };

  const response = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-id": APP_ID,
      "x-app-key": APP_KEY,
      "x-remote-user-id": remoteUserId,
    },
    body: JSON.stringify({
      query,
    }),
  });
  const json = await response.json();

  if (!json.foods?.length) return { food: undefined };

  const parseResult = schema.safeParse(json);

  if (parseResult.success) {
    const foodElement = camelcaseKeys(parseResult.data.foods[0], { deep: true });

    cache.set(query, foodElement);

    return { food: foodElement };
  }

  return { error: parseResult.error };
}

export async function getFoods(
  query: string,
): Promise<{ food?: FoodElement; error?: never } | { error: unknown; food?: never }> {
  if (cache.get(query)) return { food: cache.get(query) };

  const foodList = query.split(",");
  const foodResults = await Promise.all(foodList.map((food) => getFood(food)));
  const foodElement: FoodElement = {
    nfCalories: 0,
    nfCholesterol: 0,
    nfDietaryFiber: 0,
    nfP: 0,
    nfPotassium: 0,
    nfProtein: 0,
    nfSaturatedFat: 0,
    nfSodium: 0,
    nfSugars: 0,
    nfTotalCarbohydrate: 0,
    nfTotalFat: 0,
    servingQty: 0,
    servingUnit: "list",
    servingWeightGrams: 0,
    foodName: query,
  };

  const hasError = foodResults.some((foodResult) => {
    if (foodResult.error || !foodResult.food) return true;

    foodElement.nfCalories += foodResult.food.nfCalories;
    foodElement.nfCholesterol += foodResult.food.nfCholesterol;
    foodElement.nfDietaryFiber += foodResult.food.nfDietaryFiber;
    foodElement.nfP += foodResult.food.nfP;
    foodElement.nfPotassium += foodResult.food.nfPotassium;
    foodElement.nfProtein += foodResult.food.nfProtein;
    foodElement.nfSaturatedFat += foodResult.food.nfSaturatedFat;
    foodElement.nfSodium += foodResult.food.nfSodium;
    foodElement.nfSugars += foodResult.food.nfSugars;
    foodElement.nfTotalCarbohydrate += foodResult.food.nfTotalCarbohydrate;
    foodElement.nfTotalFat += foodResult.food.nfTotalFat;
    foodElement.servingWeightGrams += foodResult.food.servingWeightGrams;
  });

  if (hasError) return { error: "Some food has error" };

  cache.set(query, foodElement);

  return { food: foodElement };
}
