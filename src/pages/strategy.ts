


// async verifyServiceMainCategoriesDisplayed(): Promise<void> {
//   const categoryCount = await this.mainCategories.count();
//     if (categoryCount === 0) {
//       throw new Error('No service categories found');
//     }

//     for (let i = 0; i < categoryCount; i++) {
//       await expect(this.mainCategories.nth(i)).toBeVisible();
//       await this.page.waitForTimeout(2000);
//     }
//     this.logger.info(`All ${categoryCount} service categories are visible`);

//   }

// this.bottomSheetCrossBtn.click();
  // await this.page.waitForTimeout(2000);
  // this.logger.info('Bottom sheet closed after verifying featured services');

  // await this.bottomSheetCrossBtn.nth(2).click();
  // await this.page.waitForTimeout(2000);
  // this.logger.info('✅ Bottom sheet closed after verifying featured services');

  // await this.bottomSheetCrossBtn.filter({ has: this.page.locator(':visible') }).nth(3).click(); // 2nd element
  // await this.page.waitForTimeout(2000);
  // this.logger.info('✅ Bottom sheet closed after verifying featured services'); 

  // const crossBtn = this.page.locator('svg.lucide-x').locator('..');
  // await expect(crossBtn).toBeVisible();
  // await crossBtn.click();
  // this.logger.info('Bottom sheet closed after verifying featured services');

  // const crossBtn = this.page.locator('button.h-5.w-5.bg-white');
  // await expect(crossBtn).toBeVisible();
  // await crossBtn.click();
  // this.logger.info('✅ Bottom sheet closed after verifying featured services');