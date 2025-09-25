import test, { expect, Page } from "@playwright/test";

async function acceptCookies(page: Page) {
  // On localise le bouton "Accepter les cookies" et on clique dessus
  const acceptCookiesButton = page.getByRole("button", { name: "Consent" });

  // On vérifie si le bouton est visible avant de cliquer
  if (await acceptCookiesButton.isVisible()) {
    await acceptCookiesButton.click();
  }
}

test.describe("Ecommerce's product page", () => {
  // Avant chaque test, on va sur la page d'accueil du site ecommerce
  // et on accepte les cookies
  test.beforeEach(async ({ page }) => {
    // On va sur la page d'accueil du site ecommerce
    await page.goto("https://automationexercise.com/");
    await acceptCookies(page);
  });

  test("should go to product page", async ({ page }) => {
    // Ceci est un Locator, il permet de localiser un élément de la page
    // https://playwright.dev/docs/api/class-framelocator#frame-locator-get-by-label
    // Ici nous localisons le lien vers la page products.
    const nav = page.getByRole("navigation");

    await expect(nav).toBeVisible();
  });

  test("should go to product page", async ({ page }) => {
    // Ceci est un Locator, il permet de localiser un élément de la page
    // https://playwright.dev/docs/api/class-framelocator#frame-locator-get-by-label
    // Ici nous localisons le lien vers la page products.
    await page.getByRole("link", { name: " Products" }).click();

    // On vérifie que l'URL de la page est bien celle de la page des produits
    expect(page).toHaveURL("https://automationexercise.com/products");
    // On vérifie que le titre de la page est bien celui de la page des produits
    expect(await page.title()).toBe("Automation Exercise - All Products");
  });
});
