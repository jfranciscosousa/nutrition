import camelcaseKeys, { type CamelCaseKeys } from "camelcase-keys";
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

export async function getFood(
  query: string,
  remoteUserId = "0",
): Promise<{ food?: FoodElement; error?: never } | { error: unknown; food?: never }> {
  if (import.meta.env.MODE === "e2e") return { food: GET_FOOD_MOCK };

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

  if (parseResult.success)
    return { food: camelcaseKeys(parseResult.data.foods[0], { deep: true }) };

  return { error: parseResult.error };
}
