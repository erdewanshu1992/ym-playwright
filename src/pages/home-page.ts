import {expect, Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import chalk from 'chalk';

/**
 * Home Page Object Model
 * Represents the YesMadam home page with all its elements and actions
 */
export class HomePage extends BasePage {
  // Locators
  private readonly logo: Locator;
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly services: Locator;
  private readonly locationSelector: Locator;
  private readonly locationEnter: Locator;
  private readonly mainCategories: Locator;
  private readonly serviceCategories: Locator;
  private readonly bottomSheetCrossBtn: Locator;
  private readonly serviceCards: Locator;
  private readonly cartIcon: Locator;
  private readonly heroSection: Locator;
  private readonly featuredServices: Locator;
  private readonly howItWorksSection: Locator;
  private readonly customerReviews: Locator;
  private readonly footer: Locator;
  private readonly accountBtn: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.logo = page.locator('button', { hasText: 'Get App' });
    this.searchBox = page.locator('.lucide.lucide-search');
    this.searchButton = page.locator('.flex-grow.outline-none.text-sm.font-semibold');
    this.services = page.locator('.grid.grid-cols-4.gap-3.mt-4');
    this.locationSelector = page.locator('.flex.items-center.gap-3');
    this.locationEnter = page.locator('.flex.items-center.gap-3');
    this.mainCategories = page.locator('p.text-xs.text-center.text-black');
    this.serviceCategories = page.locator('p.text-xs.text-center.font-inter');
    this.bottomSheetCrossBtn = page.locator('.lucide.lucide-x');

    this.serviceCards = this.page.locator('a.w-full:has(p)');

    this.cartIcon = page.locator('[data-testid="cart-icon"], .cart-icon');
    this.heroSection = page.locator('.flex.items-center.flex-grow.gap-2');

    this.featuredServices = page.locator('p.text-xs.text-center.text-black');
    this.howItWorksSection = page.locator('.text-sm.font-semibold.text-black, .how-it-works');

    this.customerReviews = page.locator('[data-testid="customer-reviews"], .reviews');
    this.footer = page.locator('.text-base.font-semibold.my-2, footer');
    this.accountBtn = page.locator('div.font-medium.text-stone-500', { hasText: 'Account' }).nth(1);
  }

  // Page actions
  async navigateToHomePage(): Promise<void> {
    await this.navigateToRelative('/');
    await this.waitForPageLoad();
    
  }

  async navigateToAccountPage(): Promise<void> {
    await this.accountBtn.click();
    // await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToLogin(): Promise<void> {
    await this.click(this.accountBtn);
    await this.waitForPageLoad();
  }

  async navigateToSignup(): Promise<void> {
    await this.click(this.accountBtn);
    await this.waitForPageLoad();
  }

  async searchForService(serviceName: string): Promise<void> {
    await this.searchBox.click();
    await this.page.waitForLoadState('domcontentloaded');
    this.logger.info(`Searching for service: ${serviceName}`);
    await this.fill(this.searchButton, serviceName);
    await this.waitForPageLoad();

  }

  async waitForSearchResults(): Promise<void> {
      const searchResults = this.page.locator('.text-xs.font-semibold').first();
      await this.waitForElement(searchResults);
      await searchResults.waitFor({ state: 'visible', timeout: 5000 });

      // Click the first suggestion directly
      await searchResults.click();
      await this.waitForPageLoad();
    }


    async selectLocation(location: string): Promise<void> {
      await this.navigateToRelative('/');
      await this.waitForPageLoad();
      this.logger.info(`Selecting location: ${location}`);
      await this.click(this.locationSelector);
      await expect(this.locationSelector).toBeVisible({ timeout: 15000 });
      const locationOption = this.page.locator('//input[@placeholder="Search for area, street name…"]');
      await this.fill(locationOption, location);

    }

  async clickServiceCategory(categoryName: string): Promise<void> {
  const locator = this.page.locator('p.text-black.text-center', {
    hasText: categoryName
  });

  await expect(locator).toBeVisible({ timeout: 15000 });

  await Promise.all([
    // this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    this.page.waitForLoadState('domcontentloaded'),
    locator.first().click()
  ]);
}

async getServicesList(): Promise<string[]> {
  const servicesGrid = this.page.locator('div.grid.grid-cols-3.gap-6');
  const serviceItems = servicesGrid.locator('p.text-xs.text-center.font-inter');

  await expect(serviceItems.first()).toBeVisible({ timeout: 10000 });

  const count = await serviceItems.count();
  const services: string[] = [];

  for (let i = 0; i < count; i++) {
    const text = await serviceItems.nth(i).textContent();
    if (text?.trim()) {
      services.push(text.trim());
    }
  }

  return services;
}


async clickMainCategoryAndGetServices(categoryName: string): Promise<string[]> {
  const mainCategory = this.page.locator('p.text-black.text-center', {
    hasText: categoryName
  });

  await expect(mainCategory.first()).toBeVisible({ timeout: 15000 });

  await Promise.all([
    this.page.waitForLoadState('domcontentloaded'),
    mainCategory.first().click()
  ]);

  // Step 1: Focus only on the grid that contains services
  const servicesGrid = this.page.locator('div.grid.grid-cols-3.gap-6');

  // Step 2: Extract <p> only inside services grid
  const serviceLocator = servicesGrid.locator('p.text-xs.text-center.font-inter');

  await expect(serviceLocator.first()).toBeVisible({ timeout: 10000 });

  const count = await serviceLocator.count();
  const services: string[] = [];

  for (let i = 0; i < count; i++) {
    const text = await serviceLocator.nth(i).textContent();
    if (text?.trim()) {
      services.push(text.trim());
    }
  }

  return services;
}


async clickService(serviceName: string): Promise<void> {
  const serviceLocator = this.page.locator('p.text-xs.text-center.font-inter', { hasText: serviceName });
  await expect(serviceLocator).toBeVisible({ timeout: 10000 });
  await Promise.all([
    this.page.waitForLoadState('domcontentloaded'),
    serviceLocator.first().click()
  ]);
}

  async openCart(): Promise<void> {
    await this.click(this.cartIcon);
  }

  async getCartItemCount(): Promise<number> {
    const cartBadge = this.cartIcon.locator('.cart-count, .badge');
    if (await this.isElementVisible(cartBadge)) {
      const countText = await this.getText(cartBadge);
      return parseInt(countText) || 0;
    }
    return 0;
  }

  // Verification methods
  async verifyHomePageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.logo);
    await this.verifyElementVisible(this.heroSection);
    await this.verifyElementVisible(this.services);
    this.logger.info('Home page loaded successfully');
  }

async verifyServicePageLoaded(city: string, slug: string): Promise<void> {
  const url = `https://www.yesmadam.com/${city}/${slug}`;
  await this.page.goto(url, { waitUntil: 'domcontentloaded' });

  // Assert that at least one service card is visible
  await expect(this.page.locator('a.w-full:has(p)').first()).toBeVisible({ timeout: 5000 });

  this.logger.info(`Services loaded for /${city}/${slug}`);
}

async verifyServiceMainCategoriesDisplayed(): Promise<void> {
  console.time('⏱️ verifyServiceCategoriesDisplayed');

  const categoryCount = await this.mainCategories.count();
  if (categoryCount === 0) {
    throw new Error(chalk.red('No service categories found'));
  }

  const visibleCategories: string[] = [];

  for (let i = 0; i < categoryCount; i++) {
    const element = this.mainCategories.nth(i);
    await expect(element).toBeVisible();
    const text = (await element.textContent())?.trim() || `#${i + 1}`;
    visibleCategories.push(chalk.blueBright(text));
    await this.page.waitForTimeout(500);
  }

  // this.logger.info(
  //   chalk.blueBright(`All ${categoryCount} service categories are visible:`) +
  //   '\n  ' + visibleCategories.join('\n  ')
  // );

  this.logger.info(chalk.greenBright(`All ${categoryCount} service categories are visible:`));
  this.logger.info(visibleCategories.map(cat => chalk.underline(`  ${cat}`)).join('\n'));
  // this.logger.info(chalk.greenBright(visibleCategories.join('\n ')));

  console.timeEnd('⏱️ verifyServiceCategoriesDisplayed');

}


async verifyFeaturedServicesDisplayedAfterCategoryClick(): Promise<void> {
  const mainCategory = this.mainCategories.first();
  await this.verifyElementVisible(mainCategory);
  await mainCategory.click();

  // Wait for the services grid to load
  const services = await this.getServicesList();

  if (services.length === 0) {
    throw new Error('No featured services found after clicking category');
  }

  this.logger.info(chalk.underline(`Featured services loaded: ${services.join('\n ')}`));
  this.logger.info(chalk.blueBright(`Found ${services.length} visible featured services after category click`));

  await this.page.getByRole('button').click();
  this.logger.info(chalk.magentaBright('Bottom sheet closed after verifying featured services'));


}


  async verifyHowItWorksSectionDisplayed(): Promise<void> {
    await this.scrollToElement(this.howItWorksSection);
    await this.verifyElementVisible(this.howItWorksSection);
    this.logger.info('How It Works section is displayed');
  }

  async verifyCustomerReviewsDisplayed(): Promise<void> {
    await this.scrollToElement(this.customerReviews);
    await this.verifyElementVisible(this.customerReviews);
    const reviewCount = await this.getElementCount(this.customerReviews.locator('.review-item, .customer-review'));
    if (reviewCount === 0) {
      throw new Error('No customer reviews found');
    }
    this.logger.info(`Found ${reviewCount} customer reviews`);
  }

  async verifyFooterDisplayed(): Promise<void> {
    await this.scrollToElement(this.footer);
    await this.verifyElementVisible(this.footer);
    this.logger.info('Footer is displayed');
  }

  // Utility methods
  async getFeaturedServicesList(): Promise<string[]> {
    // const serviceElements = this.featuredServices.locator('.service-title, .service-name');
    const serviceElements = this.featuredServices;
    const serviceCount = await serviceElements.count();
    const services: string[] = [];
    
    for (let i = 0; i < serviceCount; i++) {
      const serviceName = await serviceElements.nth(i).textContent();
      if (serviceName) {
        services.push(serviceName.trim());
      }
    }
    
    return services;
  }

  async getMainServiceCategoriesList(): Promise<string[]> {
  console.time('⏱️ Main Categories Fetch Time');

  const categoryElements = this.mainCategories;
  const count = await categoryElements.count();
  const categories: string[] = [];

  for (let i = 0; i < count; i++) {
    const text = await categoryElements.nth(i).textContent();
    if (text?.trim()) {
      categories.push(text.trim());
    }
  }

  console.timeEnd('⏱️ Main Categories Fetch Time');
  return categories;
}

  async getServiceCategoriesList(): Promise<string[]> {
  console.time('⏱️ Service Categories Fetch Time');

  const categoryElements = this.serviceCategories;
  const count = await categoryElements.count();
  const services: string[] = [];

  for (let i = 0; i < count; i++) {
    const text = await categoryElements.nth(i).textContent();
    if (text?.trim()) {
      services.push(text.trim());
    }
  }

  console.timeEnd('⏱️ Service Categories Fetch Time');
  return services;
}





  // async waitForSearchResults(): Promise<void> {
  //   const searchResults = this.page.locator('[data-testid="search-results"], .search-results');
  //   await this.waitForElement(searchResults);
  // }
}

