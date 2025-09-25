import test from "@playwright/test";

test.describe("Ecommerce's product page", () => {
  test("should go to product page", async ({ page }) => {
    await page.goto("https://automationexercise.com/");
  });
});
