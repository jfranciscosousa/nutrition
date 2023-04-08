import camelcaseKeys from "camelcase-keys";
import { APP_ID, APP_KEY } from "$env/static/private";
import { GET_FOOD_MOCK } from "./getFood.mock";

export interface FoodElement {
  foodName: string;
  brandName: string | null;
  servingQty: number;
  servingUnit: string;
  servingWeightGrams: number;
  nfCalories: number;
  nfTotalFat: number;
  nfSaturatedFat: number;
  nfCholesterol: number;
  nfSodium: number;
  nfTotalCarbohydrate: number;
  nfDietaryFiber: number;
  nfSugars: number;
  nfProtein: number;
  nfPotassium: number;
  nfP: number;
  fullNutrients: FullNutrient[];
  nixBrandName: string | null;
  nixBrandId: string | null;
  nixItemName: string | null;
  nixItemId: string | null;
  upc: string | null;
  consumedAt: string;
  metadata: Metadata;
  source: number;
  ndbNo: number;
  tags: Tags;
  altMeasures: AltMeasure[];
  lat: string | null;
  lng: string | null;
  mealType: number;
  photo: Photo;
  subRecipe: string | null;
  classCode: string | null;
  brickCode: string | null;
  tagId: string | null;
}

export interface AltMeasure {
  servingWeight: number;
  measure: string;
  seq: number | null;
  qty: number;
}

export interface FullNutrient {
  attrId: number;
  value: number;
}

export interface Metadata {
  isRawFood: boolean;
}

export interface Photo {
  thumb: string;
  highres: string;
  isUserUploaded: boolean;
}

export interface Tags {
  item: string;
  measure: string | null;
  quantity: string;
  foodGroup: number;
  tagId: number;
}

export async function getFood(query: string, remoteUserId = "0"): Promise<FoodElement> {
  if (import.meta.env.MODE === "e2e") return GET_FOOD_MOCK;

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

  return camelcaseKeys(json?.foods?.[0], { deep: true });
}
