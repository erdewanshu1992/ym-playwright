import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { Environment } from '../config/environment';

/**
 * Base Page Class - Contains common functionality for all page objects
 * Implements the Page Object Model pattern with enhanced features
 */
export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected env = Environment.get();

  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
  }

  // Navigation methods
  async navigateTo(url: string): Promise<void> {
    this.logger.info(`Navigating to: ${url}`);
    // await this.page.goto(url, { waitUntil: 'networkidle' });
    // await this.page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    // await this.page.goto(url, { waitUntil: 'load' });

  }

  async navigateToRelative(path: string): Promise<void> {
    const fullUrl = `${this.env.baseUrl}${path}`;
    await this.navigateTo(fullUrl);
  }

  // Wait methods
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ 
      state: 'visible', 
      timeout: timeout || this.env.timeouts.medium 
    });
  }

  async waitForElementToDisappear(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ 
      state: 'hidden', 
      timeout: timeout || this.env.timeouts.medium 
    });
  }

  async waitForPageLoad(): Promise<void> {
    // await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Click methods
  async click(locator: Locator, options?: { timeout?: number; force?: boolean }): Promise<void> {
    await this.waitForElement(locator, options?.timeout);
    await locator.click({ force: options?.force });
    this.logger.debug(`Clicked element: ${locator}`);
  }

  async doubleClick(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.dblclick();
    this.logger.debug(`Double-clicked element: ${locator}`);
  }

  async rightClick(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click({ button: 'right' });
    this.logger.debug(`Right-clicked element: ${locator}`);
  }

  // Input methods
  async fill(locator: Locator, text: string, options?: { clear?: boolean }): Promise<void> {
    await this.waitForElement(locator);
    if (options?.clear !== false) {
      await locator.clear();
    }
    await locator.fill(text);
    this.logger.debug(`Filled element with text: ${text}`);
  }

  async type(locator: Locator, text: string, delay?: number): Promise<void> {
    await this.waitForElement(locator);
    await locator.type(text, { delay: delay || 50 });
    this.logger.debug(`Typed text: ${text}`);
  }

  async selectOption(locator: Locator, option: string | string[]): Promise<void> {
    await this.waitForElement(locator);
    await locator.selectOption(option);
    this.logger.debug(`Selected option: ${option}`);
  }

  // Assertion methods
  async verifyElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async verifyElementHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  async verifyElementText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toHaveText(expectedText);
  }

  async verifyElementContainsText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  async verifyElementValue(locator: Locator, expectedValue: string): Promise<void> {
    await expect(locator).toHaveValue(expectedValue);
  }

  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async verifyPageURL(expectedURL: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedURL);
  }

  // async verifyPageURL(expectedPattern: RegExp): Promise<void> {
  //   const currentURL = this.page.url();
  //     if (!expectedPattern.test(currentURL)) {
  //       throw new Error(`URL mismatch: Expected pattern ${expectedPattern}, but got ${currentURL}`);
  //     }
  //     this.logger.info(`URL verified: ${currentURL}`);
  //   }


  // Utility methods
  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  async getValue(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.inputValue();
  }

  async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
    await this.waitForElement(locator);
    return await locator.getAttribute(attribute);
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await this.waitForElement(locator, 2000);
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  async isElementEnabled(locator: Locator): Promise<boolean> {
    await this.waitForElement(locator);
    return await locator.isEnabled();
  }

  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  // Screenshot methods
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
    this.logger.info(`Screenshot saved: ${name}-${timestamp}.png`);
  }

  async takeElementScreenshot(locator: Locator, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await locator.screenshot({ 
      path: `screenshots/${name}-${timestamp}.png` 
    });
    this.logger.info(`Element screenshot saved: ${name}-${timestamp}.png`);
  }

  // Scroll methods
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  // Dialog handling
  async handleAlert(accept: boolean = true): Promise<void> {
    this.page.on('dialog', async dialog => {
      this.logger.info(`Dialog message: ${dialog.message()}`);
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  // Local storage methods
  async setLocalStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate(({ key, value }) => {
      localStorage.setItem(key, value);
    }, { key, value });
  }

  async getLocalStorage(key: string): Promise<string | null> {
    return await this.page.evaluate(key => {
      return localStorage.getItem(key);
    }, key);
  }

  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  // Cookie methods
  async addCookie(name: string, value: string, domain?: string): Promise<void> {
    await this.page.context().addCookies([{
      name,
      value,
      domain: domain || new URL(this.env.baseUrl).hostname,
      path: '/'
    }]);
  }

  async getCookies(): Promise<any[]> {
    return await this.page.context().cookies();
  }

  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }
}
