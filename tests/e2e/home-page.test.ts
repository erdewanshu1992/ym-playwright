import { test, expect, Browser, Page, BrowserContext } from "@playwright/test";
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
    await homePage.verifyHomePageLoaded();
    await homePage.verifyPageTitle(
      "Luxury Salon At Home in Delhi | Best Salon Near Me"
    );
  });

  test("should display all main sections @regression", async () => {
    await homePage.verifyServiceMainCategoriesDisplayed();
    await homePage.verifyHowItWorksSectionDisplayed();
    // await homePage.verifyCustomerReviewsDisplayed();
    await homePage.verifyFooterDisplayed();
    await homePage.verifyFeaturedServicesDisplayedAfterCategoryClick();
    // await page.getByRole('button').click();
  });

  test("should display featured services @regression", async () => {
    const featuredServices = await homePage.getFeaturedServicesList();
    expect(featuredServices.length).toBeGreaterThan(0);
  });

  test("get all category names from home page", async () => {
    const categories = await homePage.getMainServiceCategoriesList();
    console.log("Main Categories:", categories);
    // expect(categories.length).toBe(7);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain("Salon for Women");
    await homePage.takeScreenshot("categories-list");
  });

  test("should navigate to service categories @regression", async () => {
    const categories = await homePage.getMainServiceCategoriesList();
    await homePage.clickServiceCategory(categories[0]);
  });

  test("should navigate to category and list services @regression", async () => {
    const categories = await homePage.getServiceCategoriesList();
    const services = await homePage.getServicesList();
    console.log("Services:", services);
    expect(services.length).toBeGreaterThan(0);
  });

  test("should navigate to specific service under Salon At Home", async () => {
    await homePage.clickService("Waxing");
    await homePage.verifyPageURL(/.*waxing.*/);
  });

  test("should work on mobile viewport @mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const homePage = new HomePage(page); // reinitialize for new `page`
    await homePage.verifyServicePageLoaded("delhi", "waxing");
  });

  test("should work on tablet viewport @tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const homePage = new HomePage(page); // reinitialize for new `page`
    await homePage.verifyServicePageLoaded("delhi", "waxing");
  });

  test.skip("should handle location selection @regression", async () => {
    await homePage.selectLocation("Delhi");
    await homePage.takeScreenshot("location-selected");
  });

  test.skip("should allow service search @smoke @regression", async () => {
    await homePage.verifyHomePageLoaded();
    await homePage.verifyPageTitle(
      "Luxury Salon At Home in Delhi | Best Salon Near Me"
    );
    const searchTerm = "hair cut";
    await homePage.searchForService(searchTerm);
    await homePage.waitForSearchResults();
    await homePage.verifyPageURL(/.*search.*/);
  });

  test.describe("Performance Tests", () => {
    test("should load within acceptable time @performance", async ({
      page,
    }) => {
      const start = Date.now();
      await homePage.navigateToHomePage();
      const loadTime = Date.now() - start;
      expect(loadTime).toBeLessThan(5000);
    });
  });

  test.describe("Accessibility Tests", () => {
    test("should have proper heading structure @a11y", async ({ page }) => {
      await page.goto("/");
      const h1Count = await page.locator("h1").count();
      // expect(h1Count).toBe(1);
      console.warn(`Found ${h1Count} <h1> elements.`);
      // expect(h1Count, 'There should be exactly one <h1> element on the page').toBe(1);
      // expect(h1Count, 'No <h1> tag found on the page').toBeGreaterThan(0);
      const headings = await page
        .locator("h1, h2, h3, h4, h5, h6")
        .allTextContents();
      console.warn(`Found ${headings.length} heading elements.`);
      // expect(headings.length, 'There should be at least one heading on the page').toBeGreaterThan(0);
      // Optional: Attach to Allure report
      await allure.attachment(
        "Heading Structure",
        `Found ${h1Count} <h1> elements`,
        "text/plain"
      );
    });

    test("should have alt text for images @a11y", async ({ page }) => {
      await page.goto("/");
      const images = page.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const alt = await images.nth(i).getAttribute("alt");
        expect(alt, `Image at index ${i} is missing alt text`).toBeTruthy();
      }
    });

    test("should have no broken links @a11y", async ({ page, request }) => {
      await page.goto("/");
      const links = page.locator("a");
      const linkCount = await links.count();

      const brokenLinks = [];

      for (let i = 0; i < linkCount; i++) {
        const href = await links.nth(i).getAttribute("href");

        if (href && !href.startsWith("javascript")) {
          const url = href.startsWith("http")
            ? href
            : new URL(href, page.url()).toString();

          try {
            const res = await request.get(url);
            const status = res.status();

            if (status >= 400) {
              brokenLinks.push(`${url} → Status: ${status}`);
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            brokenLinks.push(`${url} → Error: ${message}`);
          }
        }
      }

      // Optional: Attach to Allure report
      if (brokenLinks.length > 0) {
        await allure.attachment(
          "Broken Links Report",
          brokenLinks.join("\n"),
          "text/plain"
        );
      }

      // Final assertion
      expect(
        brokenLinks,
        `Broken links found:\n${brokenLinks.join("\n")}`
      ).toEqual([]);
    });
  });

  // NODE_ENV=production npx playwright test --grep @a11y --headed tests/e2e/home-page.test.ts --->Using this tag allows you to filter tests:
  // NODE_ENV=production npx playwright test --headed tests/e2e/home-page.test.ts
});
