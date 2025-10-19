import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Login Page Object Model
 * Handles all login-related functionality
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly signupLink: Locator;
  private readonly socialLoginButtons: Locator;
  private readonly googleLoginButton: Locator;
  private readonly facebookLoginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly showPasswordToggle: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly accountBtn: Locator;

  constructor(page: Page) {
    super(page);

    
    this.accountBtn = page.locator('div.font-medium.text-stone-500', { hasText: 'Account' }).nth(1);
    this.emailInput = page.locator('[data-testid="email-input"], input[type="email"], input[name="email"]');
    this.passwordInput = page.locator('[data-testid="password-input"], input[type="password"], input[name="password"]');
    this.loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), button[type="submit"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password"], a:has-text("Forgot Password")');
    this.signupLink = page.locator('[data-testid="signup-link"], a:has-text("Sign Up")');
    this.socialLoginButtons = page.locator('[data-testid="social-login"], .social-login');
    this.googleLoginButton = page.locator('[data-testid="google-login"], button:has-text("Google")');
    this.facebookLoginButton = page.locator('[data-testid="facebook-login"], button:has-text("Facebook")');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-error');
    this.successMessage = page.locator('[data-testid="success-message"], .success-message, .alert-success');
    this.showPasswordToggle = page.locator('[data-testid="show-password"], .show-password-toggle');
    this.rememberMeCheckbox = page.locator('[data-testid="remember-me"], input[name="remember"]');
  }

  // Page actions
  async navigateToLoginPage(): Promise<void> {
    await this.navigateToRelative('/');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    this.logger.info(`Logging in with email: ${email}`);
    
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    
    if (rememberMe && await this.isElementVisible(this.rememberMeCheckbox)) {
      await this.click(this.rememberMeCheckbox);
    }
    
    await this.click(this.loginButton);
    await this.waitForPageLoad();
  }

  async loginWithGoogle(): Promise<void> {
    this.logger.info('Logging in with Google');
    await this.click(this.googleLoginButton);
    // Handle Google OAuth flow
    await this.waitForPageLoad();
  }

  async loginWithFacebook(): Promise<void> {
    this.logger.info('Logging in with Facebook');
    await this.click(this.facebookLoginButton);
    // Handle Facebook OAuth flow
    await this.waitForPageLoad();
  }

  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
    await this.waitForPageLoad();
  }

  async navigateToSignup(): Promise<void> {
    await this.click(this.signupLink);
    await this.waitForPageLoad();
  }

  async togglePasswordVisibility(): Promise<void> {
    if (await this.isElementVisible(this.showPasswordToggle)) {
      await this.click(this.showPasswordToggle);
    }
  }

  // Verification methods
  async verifyLoginPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.emailInput);
    await this.verifyElementVisible(this.passwordInput);
    await this.verifyElementVisible(this.loginButton);
    this.logger.info('✅ Login page loaded successfully');
  }

  async verifySuccessfulLogin(): Promise<void> {
    // Wait for redirect to dashboard or home page
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
    this.logger.info('✅ Login successful');
  }

  async verifyLoginError(expectedErrorMessage?: string): Promise<void> {
    await this.verifyElementVisible(this.errorMessage);
    
    if (expectedErrorMessage) {
      await this.verifyElementContainsText(this.errorMessage, expectedErrorMessage);
    }
    
    this.logger.info('✅ Login error message displayed');
  }

  async verifyEmailValidation(): Promise<void> {
    // Submit form with invalid email
    await this.fill(this.emailInput, 'invalid-email');
    await this.click(this.loginButton);
    
    // Check for validation message
    const emailValidation = this.page.locator('[data-testid="email-validation"], .email-error');
    await this.verifyElementVisible(emailValidation);
  }

  async verifyPasswordValidation(): Promise<void> {
    // Submit form without password
    await this.fill(this.emailInput, 'test@example.com');
    await this.click(this.loginButton);
    
    // Check for validation message
    const passwordValidation = this.page.locator('[data-testid="password-validation"], .password-error');
    await this.verifyElementVisible(passwordValidation);
  }

  async verifySocialLoginOptions(): Promise<void> {
    if (await this.isElementVisible(this.socialLoginButtons)) {
      await this.verifyElementVisible(this.googleLoginButton);
      await this.verifyElementVisible(this.facebookLoginButton);
      this.logger.info('✅ Social login options are available');
    }
  }

  // Utility methods
  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  async clearLoginForm(): Promise<void> {
    await this.fill(this.emailInput, '');
    await this.fill(this.passwordInput, '');
    
    if (await this.isElementVisible(this.rememberMeCheckbox)) {
      const isChecked = await this.rememberMeCheckbox.isChecked();
      if (isChecked) {
        await this.click(this.rememberMeCheckbox);
      }
    }
  }

  async isRememberMeChecked(): Promise<boolean> {
    if (await this.isElementVisible(this.rememberMeCheckbox)) {
      return await this.rememberMeCheckbox.isChecked();
    }
    return false;
  }
}

