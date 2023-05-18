import { expect, test } from "@playwright/test";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { GET_FOOD_MOCK } from "../src/lib/data/getFood.mock.ts";

test("index page has expected h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("textbox")).toBeVisible();
});

test("searches for foods", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("textbox").fill("beans");
  await page.getByText("Search").click();

  await expect(page.getByText(GET_FOOD_MOCK.foodName)).toBeVisible();
  await expect(page.getByText(GET_FOOD_MOCK.nfTotalFat.toString())).toBeVisible();
});
