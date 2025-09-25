import test from "@playwright/test";

test.describe("Ecommerce's product page", () => {
  test("should go to product page", async ({ page }) => {
    await page.goto("https://automationexercise.com/");

    // Ceci est un Locator, il permet de localiser un élément de la page
    // https://playwright.dev/docs/api/class-framelocator#frame-locator-get-by-label
    // Ici nous localisons le lien vers la page products.
    const nav = page.getByRole("navigation");
  });
});
