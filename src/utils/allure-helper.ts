import { allure } from 'allure-playwright';
import { Page } from '@playwright/test';
import fs from 'fs';

// Attach a screenshot with label
export async function attachScreenshot(page: Page, label: string = 'Screenshot') {
  const buffer = await page.screenshot();
  allure.attachment(label, buffer, 'image/png');
}

// Add custom Allure metadata
export function addMeta(feature?: string, severity?: string, epic?: string, owner?: string) {
  if (feature) allure.label('feature', feature);
  if (severity) allure.label('severity', severity);
  if (epic) allure.label('epic', epic);
  if (owner) allure.owner(owner);
}

// Write environment.properties for Allure
export function generateEnvironment() {
  const content = `
Environment=Staging
Browser=Chrome
Platform=macOS
Tester=QA Dev
Build=2025.06.21
`.trim();

  if (!fs.existsSync('allure-results')) {
    fs.mkdirSync('allure-results');
  }
  fs.writeFileSync('allure-results/environment.properties', content);
}
