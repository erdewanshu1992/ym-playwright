// import { chromium, FullConfig } from '@playwright/test';
// import { Environment } from './environment';
// import { Logger } from '../utils/logger';

// /**
//  * Global Setup - Runs once before all tests
//  * Used for authentication, data seeding, and environment preparation
//  */
// async function globalSetup(config: FullConfig) {
//   const logger = Logger.getInstance();
//   logger.info('🚀 Starting global setup...');

//   // Initialize environment
//   Environment.initialize();
//   const env = Environment.get();

//   // Create browser context for setup
//   const browser = await chromium.launch({ headless: env.headless });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   try {
//     // Perform authentication and save state
//     await authenticateUser(page);
    
//     // Save authentication state
//     await context.storageState({ path: 'auth-state.json' });
    
//     logger.info('✅ Global setup completed successfully');
//   } catch (error) {
//     logger.error('❌ Global setup failed:', error);
//     throw error;
//   } finally {
//     await browser.close();
//   }
// }

// async function authenticateUser(page: any) {
//   const logger = Logger.getInstance();
//   const env = Environment.get();
  
//   try {
//     logger.info('Performing user authentication...');
    
//     // Navigate to login page
//     await page.goto(`${env.baseUrl}/login`);
    
//     // Fill login credentials (should be in environment variables)
//     const email = process.env.TEST_USER_EMAIL || 'test@example.com';
//     const password = process.env.TEST_USER_PASSWORD || 'password123';
    
//     await page.fill('[data-testid="email-input"]', email);
//     await page.fill('[data-testid="password-input"]', password);
//     await page.click('[data-testid="login-button"]');
    
//     // Wait for successful login
//     await page.waitForURL('**/dashboard', { timeout: 15000 });
    
//     logger.info('✅ User authentication successful');
//   } catch (error) {
//     logger.error('❌ User authentication failed:', error);
//     throw error;
//   }
// }

// export default globalSetup;





// working code
// import { chromium, FullConfig } from '@playwright/test';
// import { Environment } from './environment';
// import { Logger } from '../utils/logger';

// export default async function globalSetup(config: FullConfig) {
//   Logger.info('🚀 Starting global setup...');
//   const env = Environment.get();

//   const browser = await chromium.launch({ headless: env.headless });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   if (process.env.NODE_ENV === 'production') {
//     Logger.info('🌐 Skipping login in production...');
//     await page.goto(`${env.baseUrl}/delhi-at-home-services`);
//   } else {
//     Logger.info('🔐 Performing user authentication...');
//     try {
//       await page.goto(`${env.baseUrl}/login`);
//       const email = process.env.TEST_USER_EMAIL || 'test@example.com';
//       const password = process.env.TEST_USER_PASSWORD || 'Password123';

//       await page.fill('input[name="email"]', email);
//       await page.fill('input[name="password"]', password);
//       await page.click('button[type="submit"]');

//       await page.waitForLoadState('networkidle');
//       Logger.info('✅ Login successful!');
//     } catch (error) {
//       Logger.error('❌ User authentication failed:', error);
//       throw error;
//     }
//   }

//   await context.storageState({ path: 'auth/storageState.json' });
//   await browser.close();
//   Logger.info('✅ Global setup completed');
// }









import { chromium, FullConfig } from '@playwright/test';
import { Environment } from './environment';
import { Logger } from '../utils/logger';


export default async function globalSetup(config: FullConfig) {
  Logger.info('🚀 Starting global setup...');

  if (process.env.SKIP_GLOBAL_SETUP === 'true') {
    Logger.info('⏭️ SKIP_GLOBAL_SETUP flag is set. Skipping login setup...');
    return;
  }

  const env = Environment.get();
  const browser = await chromium.launch({ headless: env.headless });
  const context = await browser.newContext();
  const page = await context.newPage();

  if (process.env.NODE_ENV === 'production') {
    Logger.info('🌐 Skipping login in production...');
    await page.goto(`${env.baseUrl}/delhi-at-home-services`);
  } else {
    Logger.info('🔐 Performing user authentication...');
    try {
      await page.goto(`${env.baseUrl}/login`);
      const email = process.env.TEST_USER_EMAIL || 'test@yesmadam.com';
      const password = process.env.TEST_USER_PASSWORD || 'Password123';

      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', password);
      await page.click('button[type="submit"]');

      await page.waitForLoadState('networkidle');
      Logger.info('✅ Login successful!');
    } catch (error) {
      Logger.error('❌ User authentication failed:', error);
      throw error;
    }
  }

  await context.storageState({ path: 'auth/storageState.json' });
  await browser.close();
  Logger.info('✅ Global setup completed');
}
