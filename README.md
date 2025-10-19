# YesMadam Automation Framework

A comprehensive, enterprise-level Playwright TypeScript automation framework designed for testing the YesMadam platform. This framework follows industry best practices and is suitable for top-tier organizations.

## 🏗️ Framework Architecture

```
yesmadam-automation-framework/
├── src/
│   ├── config/          # Configuration files
│   ├── pages/           # Page Object Models
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── tests/
│   ├── e2e/            # End-to-end tests
│   ├── api/            # API tests
│   └── fixtures/       # Custom fixtures
├── reports/            # Test reports
├── screenshots/        # Test screenshots
├── logs/              # Application logs
└── allure-results/    # Allure test results
```

## 🚀 Key Features

### ✅ Enterprise-Grade Architecture
- **Page Object Model (POM)** - Maintainable and scalable test structure
- **Modular Design** - Separated concerns with clear boundaries
- **TypeScript Support** - Full type safety and IntelliSense
- **Multi-Environment** - Support for Dev, Staging, and Production
- **Multi-Browser** - Chrome, Firefox, Safari, Edge support

### ✅ Advanced Testing Capabilities
- **E2E Testing** - Complete user journey testing
- **API Testing** - RESTful API validation and testing
- **Cross-Browser Testing** - Automated browser compatibility
- **Mobile Testing** - Responsive design validation
- **Performance Testing** - Response time and load testing
- **Security Testing** - Authentication and authorization
- **Accessibility Testing** - WCAG compliance validation

### ✅ Robust Reporting & Monitoring
- **Multiple Report Formats** - HTML, JSON, JUnit, Allure
- **Screenshots & Videos** - Automatic capture on failures
- **Detailed Logging** - Winston-based structured logging
- **Performance Metrics** - Response times and resource usage
- **CI/CD Integration** - GitHub Actions, Jenkins ready

### ✅ Data Management
- **Test Data Generation** - Faker.js for realistic data
- **Database Integration** - MySQL and MongoDB support
- **Environment Variables** - Secure configuration management
- **Data Cleanup** - Automated test data removal

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yesmadam-automation-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env file with your environment-specific values
   ```

5. **Verify installation**
   ```bash
   npm run test -- --reporter=line tests/e2e/home-page.spec.ts
   ```

## 🎯 Running Tests

### Basic Test Execution
```bash
# Run all tests
npm run test

# Run with UI mode
npm run test:ui

# Run in headed mode
npm run test:headed

# Debug mode
npm run test:debug
```

### Browser-Specific Tests
```bash
# Chrome only
npm run test:chrome

# Firefox only
npm run test:firefox

# Safari only
npm run test:safari

# Mobile devices
npm run test:mobile
```

### Test Categories
```bash
# Smoke tests
npm run test:smoke

# Regression tests
npm run test:regression

# API tests only
npm run test:api

# E2E tests only
npm run test:e2e
```

### Filtered Test Execution
```bash
# Run specific test file
npm run test tests/e2e/login.spec.ts

# Run tests matching pattern
npm run test --grep "@smoke"

# Run tests by project
npm run test --project=chrome
```

## 📊 Reporting

### Generate Reports
```bash
# HTML Report
npm run report

# Allure Report
npm run allure:generate
npm run allure:open
```

### Report Locations
- **HTML Reports**: `reports/html-report/index.html`
- **Allure Reports**: `allure-report/index.html`
- **Screenshots**: `screenshots/`
- **Videos**: `test-results/`
- **Logs**: `logs/`

## 🔧 Configuration

### Environment Settings
Configure different environments in `src/config/environment.ts`:
- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

### Browser Configuration
Modify `playwright.config.ts` for:
- Browser selection
- Viewport sizes
- Timeout settings
- Parallel execution
- Retry strategies

### Test Data
- **Static Data**: `src/data/`
- **Generated Data**: Using `TestDataGenerator` utility
- **Environment Variables**: `.env` file

## 🧪 Writing Tests

### Page Object Example
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class ExamplePage extends BasePage {
  private readonly elementLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.elementLocator = page.locator('[data-testid="example"]');
  }

  async performAction(): Promise<void> {
    await this.click(this.elementLocator);
  }
}
```

### Test Example
```typescript
import { test, expect } from '@playwright/test';
import { ExamplePage } from '../src/pages/example-page';

test.describe('Example Tests', () => {
  test('should perform action @smoke', async ({ page }) => {
    const examplePage = new ExamplePage(page);
    await examplePage.navigateToHomePage();
    await examplePage.performAction();
    await examplePage.verifyElementVisible(examplePage['elementLocator']);
  });
});
```

## 🚀 CI/CD Integration

### GitHub Actions
The framework includes GitHub Actions workflow for:
- Automated test execution
- Multi-browser testing
- Report generation
- Slack notifications

### Jenkins Pipeline
Example Jenkinsfile provided for:
- Parallel execution
- Environment-specific testing
- Artifact storage
- Email notifications

## 🔒 Security & Best Practices

### Security Features
- ✅ Secure credential management
- ✅ Environment-based configuration
- ✅ Authentication state management
- ✅ API token handling
- ✅ Database connection security

### Code Quality
- ✅ ESLint configuration
- ✅ Prettier formatting
- ✅ TypeScript strict mode
- ✅ Pre-commit hooks
- ✅ Code coverage reporting

## 📚 Framework Components

### Core Utilities
- **Logger**: Structured logging with Winston
- **Database Manager**: MySQL and MongoDB connections
- **Test Data Generator**: Realistic test data creation
- **Environment Manager**: Multi-environment configuration

### Page Objects
- **Base Page**: Common functionality for all pages
- **Home Page**: YesMadam homepage interactions
- **Login Page**: Authentication and login flows
- **Service Pages**: Service booking and management

### Test Suites
- **E2E Tests**: Complete user journeys
- **API Tests**: Backend service validation
- **Security Tests**: Authentication and authorization
- **Performance Tests**: Response time validation

## 🐛 Troubleshooting

### Common Issues

1. **Browser Installation Issues**
   ```bash
   npx playwright install --force
   ```

2. **Permission Errors**
   ```bash
   chmod +x node_modules/.bin/playwright
   ```

3. **Environment Variables**
   - Ensure `.env` file exists and is properly configured
   - Check environment variable syntax

4. **Test Failures**
   - Check screenshots in `test-results/`
   - Review logs in `logs/` directory
   - Verify element selectors are correct

## 📈 Performance Optimization

### Parallel Execution
- Configure worker count in `playwright.config.ts`
- Use `test.describe.configure({ mode: 'parallel' })`
- Optimize test data setup/teardown

### Resource Management
- Implement proper cleanup in `afterEach`/`afterAll`
- Use database transactions for test isolation
- Cache authentication states

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Write tests following existing patterns
3. Run full test suite
4. Update documentation
5. Submit pull request

### Code Standards
- Follow existing naming conventions
- Add appropriate test tags (`@smoke`, `@regression`)
- Include proper error handling
- Write descriptive test names

## 📞 Support

For framework support and questions:
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues with detailed descriptions
- **Best Practices**: Follow the established patterns in existing tests

## 🏆 Framework Benefits

### For QA Teams
- ✅ Reduced test maintenance effort
- ✅ Faster test execution
- ✅ Better test coverage
- ✅ Comprehensive reporting

### For Development Teams
- ✅ Early bug detection
- ✅ API contract validation
- ✅ Regression prevention
- ✅ Performance monitoring

### For Organizations
- ✅ Improved software quality
- ✅ Faster release cycles
- ✅ Reduced manual testing effort
- ✅ Better stakeholder confidence

---

## 📄 License

This framework is proprietary and confidential. All rights reserved.

---

**Framework Version**: 1.0.0  
**Last Updated**: December 2024  
**Playwright Version**: ^1.40.0