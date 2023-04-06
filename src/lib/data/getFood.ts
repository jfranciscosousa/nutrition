import camelcaseKeys from 'camelcase-keys';
import { APP_ID, APP_KEY } from '$env/static/private';

export interface FoodElement {
	foodName: string;
	brandName?: string;
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
	nixBrandName?: string;
	nixBrandId?: string;
	nixItemName?: string;
	nixItemId?: string;
	upc?: string;
	consumedAt: Date;
	metadata: Metadata;
	source: number;
	ndbNo: number;
	tags: Tags;
	altMeasures: AltMeasure[];
	lat?: string;
	lng?: string;
	mealType: number;
	photo: Photo;
	subRecipe?: string;
	classCode?: string;
	brickCode?: string;
	tagId?: string;
}

export interface AltMeasure {
	servingWeight: number;
	measure: string;
	seq?: number;
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
	measure: string;
	quantity: string;
	foodGroup: number;
	tagId: number;
}

export async function getFood(query: string, remoteUserId = '0'): Promise<FoodElement> {
	const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-app-id': APP_ID,
			'x-app-key': APP_KEY,
			'x-remote-user-id': remoteUserId
		},
		body: JSON.stringify({
			query
		})
	});
	const json = await response.json();

	return camelcaseKeys(json?.foods?.[0], { deep: true });
}
