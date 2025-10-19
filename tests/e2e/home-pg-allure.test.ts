import { test, expect, BrowserContext, Page } from "@playwright/test";
import { HomePage } from "../../src/pages/home-page";
import { allure } from "allure-playwright";

test.describe("Home Page Tests", () => {
  let browserContext: BrowserContext;
  let page: Page;
  let homePage: HomePage;

  test.beforeAll(async ({ browser }) => {
    browserContext = await browser.newContext();
    page = await browserContext.newPage();
    homePage = new HomePage(page);
    await homePage.navigateToHomePage();
  });

  test.afterAll(async () => {
    await browserContext.close();
  });

  test("should load home page successfully @smoke @regression", async () => {
    // Add Allure labels
    allure.label("layer", "UI");
    allure.epic("Home Page");
    allure.feature("Homepage Load");
    allure.story("As a user, I want to load the homepage");

    // Step-wise logging
    await test.step("Verify homepage loaded", async () => {
      await homePage.verifyHomePageLoaded();
      allure.attachment("Screenshot", await page.screenshot(), "image/png");
    });

    await test.step("Verify title", async () => {
      await homePage.verifyPageTitle(
        "Luxury Salon At Home in Delhi At Home Services | Best Salon Near Me"
      );
    });

    allure.severity("critical"); // can be: blocker, critical, normal, minor, trivial
  });

  test("should display all main sections @regression", async () => {
    allure.label("layer", "UI");
    allure.feature("Homepage Sections");
    allure.story("As a user, I should see main sections");

    await test.step("Verify main categories", async () => {
      await homePage.verifyServiceMainCategoriesDisplayed();
    });

    await test.step("Verify 'How it works'", async () => {
      await homePage.verifyHowItWorksSectionDisplayed();
    });

    await test.step("Verify footer", async () => {
      await homePage.verifyFooterDisplayed();
    });

    await test.step("Verify featured services after category click", async () => {
      await homePage.verifyFeaturedServicesDisplayedAfterCategoryClick();
    });

    allure.severity("normal");
  });
});




// NODE_ENV=production npx playwright test --headed tests/e2e/home-pg-allure.test.ts
// npm run allure:generate && ts-node src/utils/send-email-report.ts
// npm run allure:email
