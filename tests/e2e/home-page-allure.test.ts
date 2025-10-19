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
    allure.label("testType", "smoke");
    allure.description("Verify that the home page loads correctly and has the correct title");

    await homePage.verifyHomePageLoaded();
    await homePage.verifyPageTitle(
      "Luxury Salon At Home in Delhi At Home Services | Best Salon Near Me"
    );
  });

  test("should display all main sections @regression", async () => {
    allure.description("Check if all main sections are displayed on the home page");

    await homePage.verifyServiceMainCategoriesDisplayed();
    await homePage.verifyHowItWorksSectionDisplayed();
    await homePage.verifyFooterDisplayed();
    await homePage.verifyFeaturedServicesDisplayedAfterCategoryClick();

    await allure.attachment(
      "Main Sections Screenshot",
      await page.screenshot({ path: "main-sections.png", fullPage: true }),
      "image/png"
    );
  });

  test("should display featured services @regression", async () => {
    const featuredServices = await homePage.getFeaturedServicesList();
    expect(featuredServices.length).toBeGreaterThan(0);
  });

  test("get all category names from home page", async () => {
    const categories = await homePage.getMainServiceCategoriesList();
    console.log("🧾 Main Categories:", categories);

    await allure.attachment(
      "Category List",
      categories.join("\n"),
      "text/plain"
    );

    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain("Salon At Home");

    await homePage.takeScreenshot("categories-list");
  });

  test("should navigate to service categories @regression", async () => {
    const categories = await homePage.getMainServiceCategoriesList();
    await homePage.clickServiceCategory(categories[0]);
  });

  test("should navigate to category and list services @regression", async () => {
    const categories = await homePage.getServiceCategoriesList();
    const services = await homePage.getServicesList();

    await allure.attachment(
      "Service List",
      services.join("\n"),
      "text/plain"
    );

    expect(services.length).toBeGreaterThan(0);
  });

  test("should navigate to specific service under Salon At Home", async () => {
    await homePage.clickService("Waxing");
    await homePage.verifyPageURL(/.*waxing.*/);
  });

  test("should work on mobile viewport @mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const homePage = new HomePage(page);
    await homePage.verifyServicePageLoaded("delhi", "waxing");
  });

  test("should work on tablet viewport @tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const homePage = new HomePage(page);
    await homePage.verifyServicePageLoaded("delhi", "waxing");
  });

  // Skipped tests with Allure tags
  test.skip("should handle location selection @regression", async () => {
    await homePage.selectLocation("Delhi");
    await homePage.takeScreenshot("location-selected");
  });

  test.skip("should allow service search @smoke @regression", async () => {
    await homePage.verifyHomePageLoaded();
    await homePage.verifyPageTitle(
      "Luxury Salon At Home in Delhi At Home Services | Best Salon Near Me"
    );
    const searchTerm = "hair cut";
    await homePage.searchForService(searchTerm);
    await homePage.waitForSearchResults();
    await homePage.verifyPageURL(/.*search.*/);
  });

  // Performance Group
  test.describe("Performance Tests", () => {
    test("should load within acceptable time @performance", async () => {
      const start = Date.now();
      await homePage.navigateToHomePage();
      const loadTime = Date.now() - start;

      allure.attachment("Page Load Time", `${loadTime} ms`, "text/plain");

      expect(loadTime).toBeLessThan(5000);
    });
  });

  // Accessibility Group
  test.describe("Accessibility Tests", () => {
    test("should have proper heading structure @a11y", async () => {
      await page.goto("/");
      const h1Count = await page.locator("h1").count();
      const headings = await page.locator("h1, h2, h3, h4, h5, h6").allTextContents();

      await allure.attachment("Headings", headings.join("\n"), "text/plain");
    });

    test("should have alt text for images @a11y", async () => {
      await page.goto("/");
      const images = page.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const alt = await images.nth(i).getAttribute("alt");
        expect(alt, `Image at index ${i} is missing alt text`).toBeTruthy();
      }
    });

    test("should have no broken links @a11y", async ({ request }) => {
      await page.goto("/");
      const links = page.locator("a");
      const linkCount = await links.count();
      const brokenLinks: string[] = [];

      for (let i = 0; i < linkCount; i++) {
        const href = await links.nth(i).getAttribute("href");
        if (href && !href.startsWith("javascript")) {
          const url = href.startsWith("http") ? href : new URL(href, page.url()).toString();
          try {
            const res = await request.get(url);
            if (res.status() >= 400) {
              brokenLinks.push(`${url} → Status: ${res.status()}`);
            }
          } catch (err) {
            brokenLinks.push(`${url} → Error: ${err}`);
          }
        }
      }

      if (brokenLinks.length > 0) {
        await allure.attachment("Broken Links", brokenLinks.join("\n"), "text/plain");
      }

      expect(brokenLinks, `Broken links:\n${brokenLinks.join("\n")}`).toEqual([]);
    });
  });
});



// NODE_ENV=production npx playwright test --headed tests/e2e/home-page-allure.test.ts
// npm run allure:generate && ts-node src/utils/send-email-report.ts
// npm run allure:email
// npx allure generate allure-results --clean -o allure-report
// allure open ./allure-report  
