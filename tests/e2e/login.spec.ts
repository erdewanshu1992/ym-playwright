// import { test, expect } from '@playwright/test';
// import { LoginPage } from '../../src/pages/login-page';
// import { HomePage } from '../../src/pages/home-page';
// import { TestDataGenerator } from '../../src/utils/test-data-generator';

// /**
//  * Login Functionality Tests
//  * Covers authentication scenarios including positive and negative test cases
//  */
// test.describe('Login Tests', () => {
//   let loginPage: LoginPage;
//   let homePage: HomePage;

//   test.beforeEach(async ({ page }) => {
//     homePage = new HomePage(page);
//     loginPage = new LoginPage(page);
//     await loginPage.navigateToLoginPage();
//   });

//   test('should load login page successfully @smoke', async () => {
//     await loginPage.verifyLoginPageLoaded();
//   });

//   test('should login with valid credentials @smoke @regression', async () => {
//     const validEmail = process.env.TEST_USER_EMAIL || 'test@yesmadam.com';
//     const validPassword = process.env.TEST_USER_PASSWORD || 'Test@123456';
    
//     await loginPage.login(validEmail, validPassword);
//     await loginPage.verifySuccessfulLogin();
//   });

//   test('should show error for invalid credentials @regression', async () => {
//     const invalidEmail = 'invalid@example.com';
//     const invalidPassword = 'wrongpassword';
    
//     await loginPage.login(invalidEmail, invalidPassword);
//     await loginPage.verifyLoginError('Invalid email or password');
//   });

//   test('should validate email format @validation', async () => {
//     await loginPage.verifyEmailValidation();
//   });

//   test('should validate password requirement @validation', async () => {
//     await loginPage.verifyPasswordValidation();
//   });

//   test('should navigate to forgot password page @functional', async () => {
//     await loginPage.clickForgotPassword();
//     await loginPage.verifyPageURL(/.*forgot.*password.*/);
//   });

//   test('should navigate to signup page @functional', async () => {
//     await loginPage.navigateToSignup();
//     await loginPage.verifyPageURL(/.*signup.*|.*register.*/);
//   });

//   test('should remember login credentials @functional', async () => {
//     const userData = TestDataGenerator.generateUserData();
    
//     await loginPage.login(userData.email, userData.password, true);
    
//     const isRemembered = await loginPage.isRememberMeChecked();
//     expect(isRemembered).toBe(true);
//   });

//   test('should toggle password visibility @ui', async () => {
//     const password = 'testpassword123';
//     await loginPage.fill(loginPage['passwordInput'], password);
    
//     await loginPage.togglePasswordVisibility();
//     // Verify password is visible (implementation would depend on actual behavior)
//     await loginPage.takeScreenshot('password-visible');
//   });

//   test.describe('Social Login Tests', () => {
//     test('should display social login options @smoke', async () => {
//       await loginPage.verifySocialLoginOptions();
//     });

//     test('should initiate Google login @social', async () => {
//       // This test would need to handle OAuth flow
//       await loginPage.loginWithGoogle();
//       // Verify Google OAuth popup or redirect
//     });

//     test('should initiate Facebook login @social', async () => {
//       // This test would need to handle OAuth flow
//       await loginPage.loginWithFacebook();
//       // Verify Facebook OAuth popup or redirect
//     });
//   });

//   test.describe('Security Tests', () => {
//     test('should handle multiple failed login attempts @security', async () => {
//       const invalidCredentials = {
//         email: 'test@example.com',
//         password: 'wrongpassword'
//       };
      
//       // Attempt multiple failed logins
//       for (let i = 0; i < 5; i++) {
//         await loginPage.clearLoginForm();
//         await loginPage.login(invalidCredentials.email, invalidCredentials.password);
        
//         if (i >= 2) { // After 3 attempts, should show rate limiting
//           const errorMessage = await loginPage.getErrorMessage();
//           if (errorMessage.includes('too many attempts') || errorMessage.includes('blocked')) {
//             break;
//           }
//         }
//       }
//     });

//     test('should not expose sensitive information in errors @security', async () => {
//       await loginPage.login('nonexistent@example.com', 'password123');
//       const errorMessage = await loginPage.getErrorMessage();
      
//       // Error should not reveal if email exists
//       expect(errorMessage).not.toContain('email not found');
//       expect(errorMessage).not.toContain('user does not exist');
//     });
//   });

//   test.describe('Cross-Browser Compatibility', () => {
//     test('should work in Chrome @chrome', async ({ browserName }) => {
//       test.skip(browserName !== 'chromium');
//       await loginPage.verifyLoginPageLoaded();
//     });

//     test('should work in Firefox @firefox', async ({ browserName }) => {
//       test.skip(browserName !== 'firefox');
//       await loginPage.verifyLoginPageLoaded();
//     });

//     test('should work in Safari @safari', async ({ browserName }) => {
//       test.skip(browserName !== 'webkit');
//       await loginPage.verifyLoginPageLoaded();
//     });
//   });

//   test.describe('Mobile Login Tests', () => {
//     test('should work on mobile devices @mobile', async ({ page }) => {
//       await page.setViewportSize({ width: 375, height: 667 });
//       await loginPage.navigateToLoginPage();
//       await loginPage.verifyLoginPageLoaded();
      
//       const userData = TestDataGenerator.generateUserData();
//       await loginPage.login(userData.email, userData.password);
//     });

//     // test('should navigate to login page @smoke', async () => {
//     //   await homePage.navigateToLogin();
//     //   await homePage.verifyPageURL(/.*login.*/);
//     // });

//     // test('should navigate to signup page @smoke', async () => {
//     //   await homePage.navigateToSignup();
//     //   await homePage.verifyPageURL(/.*signup.*|.*register.*/);
//     // });

//     test('should handle location selection @regression', async () => {
//       await homePage.selectLocation('Delhi');
//       await homePage.takeScreenshot('location-selected');
//     });

    

//       test('should work on tablet viewport @tablet', async ({ page }) => {
//         await page.setViewportSize({ width: 768, height: 1024 });
//         await homePage.verifyHomePageLoaded();
//       });
//     });


// });