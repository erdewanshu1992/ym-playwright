// pages/MobileHomeScreen.ts
import { Page } from '@playwright/test';
import { IMobileHomeScreen } from '../interfaces/IMobileHomeScreen';

export class MobileHomeScreen implements IMobileHomeScreen {
  constructor(private page: Page) {}

  async isPageLoaded(): Promise<boolean> {
    return await this.page.locator('text=Home').isVisible();
  }

  async performSearch(term: string): Promise<void> {
    await this.page.getByPlaceholder('Search').click();
    await this.page.getByPlaceholder('Search').fill(term);
    await this.page.keyboard.press('Enter');
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async navigateToTab(tabName: string): Promise<void> {
    await this.page.getByRole('tab', { name: tabName }).click();
  }

  async handlePermissions(): Promise<void> {
    // Simulating permissions popup
    const allowButton = this.page.getByText('Allow');
    if (await allowButton.isVisible()) {
      await allowButton.click();
    }
  }

  async swipeLeft(): Promise<void> {
    await this.page.mouse.move(300, 300);
    await this.page.mouse.down();
    await this.page.mouse.move(100, 300);
    await this.page.mouse.up();
  }

  async swipeRight(): Promise<void> {
    await this.page.mouse.move(100, 300);
    await this.page.mouse.down();
    await this.page.mouse.move(300, 300);
    await this.page.mouse.up();
  }

  async swipeUp(): Promise<void> {
    await this.page.mouse.move(200, 500);
    await this.page.mouse.down();
    await this.page.mouse.move(200, 100);
    await this.page.mouse.up();
  }

  async swipeDown(): Promise<void> {
    await this.page.mouse.move(200, 100);
    await this.page.mouse.down();
    await this.page.mouse.move(200, 500);
    await this.page.mouse.up();
  }

  async pressBackButton(): Promise<void> {
    await this.page.goBack();
  }

  async waitForPageToLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }
}
