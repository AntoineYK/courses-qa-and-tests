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
});
