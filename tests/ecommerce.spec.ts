import { expect, test } from "@playwright/test";

const siteURL = "https://automationexercise.com/";

test.describe("Ecommerce's product page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(siteURL);
    const acceptCookiesButton = page.getByRole("button", { name: "Consent" });
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
    }
  });

  test("should go to product page", async ({ page }) => {
    await page.getByRole("link", { name: "Products" }).click();
    await expect(page).toHaveURL("https://automationexercise.com/products");
    await expect(page).toHaveTitle("Automation Exercise - All Products");
  });

  test("should find a t-shirt", async ({ page }) => {
    await page.getByRole("link", { name: "Products" }).click();
    await expect(page).toHaveURL("https://automationexercise.com/products");

    await page.getByRole("textbox", { name: "Search Product" }).fill("t-shirt");
    await page.locator("#submit_search").click();

    const products = page.locator(".features_items .product-image-wrapper");

    await expect(products.first()).toBeVisible();

    // CORRECTION APPLIQUÉE ICI
    expect(await products.count()).toBeGreaterThan(0);
  });
});
