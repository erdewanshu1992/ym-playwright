# GitHub Actions Workflow Documentation

## 🎯 Overview

This document explains the GitHub Actions workflow configuration for the YesMadam Playwright automation framework. The workflow automates test execution in a CI/CD environment, ensuring consistent and reliable testing across different environments.

## 📋 Workflow Configuration

### File Location
```
.github/workflows/playwright.yml
```

### Workflow Structure
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-node@v5
      with:
        node-version: 24.x
        cache: 'npm'
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30

    # ---------- SAVE HISTORY (IMPORTANT FOR GRAPH) ----------
    - name: Download Allure History
      uses: actions/checkout@v3
      with:
        ref: gh-pages
        path: gh-pages
      continue-on-error: true

    - name: Copy Allure History
      run: |
        mkdir -p allure-history
        if [ -d "gh-pages" ]; then
          cp -r gh-pages/allure-history/* allure-history/ || true
        fi

    # ---------- GENERATE ALLURE HTML REPORT ----------
    - name: Generate Allure Report
      run: |
        npm install -g allure-commandline --save-dev
        allure generate allure-results --clean -o allure-report
        cp -r allure-report/history allure-history || true
        cp -r allure-history allure-report

    # ---------- DEPLOY REPORT TO GITHUB PAGES ----------
    - name: Deploy Allure Report to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./allure-report
```

## 🔧 How It Works

### 1. Trigger Events
The workflow is triggered by:
- **Push Events**: When code is pushed to `main` or `master` branches
- **Pull Requests**: When PRs are created targeting `main` or `master` branches

### 2. Execution Environment
- **Runner OS**: Ubuntu Latest (Ubuntu 22.04)
- **Node.js Version**: 24.x (latest stable)
- **Timeout**: 60 minutes maximum execution time
- **Resources**: 2 CPU cores, 7GB RAM, 14GB SSD

### 3. Step-by-Step Process

#### Step 1: Repository Checkout
```yaml
- uses: actions/checkout@v5
```
**What happens:**
- GitHub downloads your repository code to the runner
- Checks out the specific commit that triggered the workflow
- Creates a working directory with your project files

#### Step 2: Node.js Setup
```yaml
- uses: actions/setup-node@v5
  with:
    node-version: 24.x
    cache: 'npm'
```
**What happens:**
- Downloads and installs Node.js 24.x
- Sets up NPM package manager
- **Caching**: Creates cache key based on `package-lock.json`
- Speeds up subsequent runs by reusing cached dependencies

#### Step 3: Dependency Installation
```yaml
- name: Install dependencies
  run: npm ci
```
**What happens:**
- Runs `npm ci` (clean install) for faster, reliable installs
- Reads `package-lock.json` for exact package versions
- Downloads all dependencies from NPM registry
- Installs packages to `node_modules/` directory

#### Step 4: Playwright Browser Installation
```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps
```
**What happens:**
- Downloads Chromium, Firefox, and WebKit browsers
- Installs system dependencies for browser automation
- Browsers cached for subsequent runs
- Enables headless browser testing

#### Step 5: Test Execution
```yaml
- name: Run Playwright tests
  run: npx playwright test
```
**What happens:**
- Executes your test suite using Playwright
- Launches configured browsers in headless mode
- Runs tests in parallel when possible
- Captures screenshots and videos on failures
- Generates HTML report in `playwright-report/`

#### Step 6: Artifact Upload
```yaml
- uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }}
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```
**What happens:**
- Uploads test reports to GitHub's artifact storage
- Artifacts available for 30 days
- Accessible via GitHub UI or API
- Runs even if tests fail (hence `!cancelled()` condition)

#### Step 7: Download Allure History
```yaml
- name: Download Allure History
  uses: actions/checkout@v3
  with:
    ref: gh-pages
    path: gh-pages
  continue-on-error: true
```
**What happens:**
- Downloads existing Allure history from gh-pages branch
- Preserves test execution trends and graphs
- Continues even if no previous history exists
- Creates `gh-pages` directory with historical data

#### Step 8: Copy Allure History
```yaml
- name: Copy Allure History
  run: |
    mkdir -p allure-history
    if [ -d "gh-pages" ]; then
      cp -r gh-pages/allure-history/* allure-history/ || true
    fi
```
**What happens:**
- Creates `allure-history` directory for trend data
- Copies historical Allure data from gh-pages branch
- Preserves test execution history for graphs
- Handles cases where no previous history exists

#### Step 9: Generate Allure Report
```yaml
- name: Generate Allure Report
  run: |
    npm install -g allure-commandline --save-dev
    allure generate allure-results --clean -o allure-report
    cp -r allure-report/history allure-history || true
    cp -r allure-history allure-report
```
**What happens:**
- Installs Allure command line tools globally
- Generates HTML report from test results
- Creates comprehensive test report with graphs and trends
- Preserves history for trend analysis
- Outputs report to `allure-report/` directory

#### Step 10: Deploy to GitHub Pages
```yaml
- name: Deploy Allure Report to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./allure-report
```
**What happens:**
- Deploys generated Allure report to GitHub Pages
- Creates/updates gh-pages branch with report
- Makes test reports publicly accessible
- Updates historical data for future trend analysis

## 📊 Performance & Optimization

### Caching Strategy
- **NPM Dependencies**: Cached based on `package-lock.json` hash
- **Playwright Browsers**: Cached across workflow runs
- **Typical Speedup**: 2-4 minutes faster on subsequent runs

### Parallel Execution
- Tests run in parallel by default
- Playwright automatically distributes tests across workers
- Configurable via `playwright.config.ts`

## 🔍 Monitoring & Troubleshooting

### Viewing Workflow Results
1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Click on the workflow run you want to inspect
4. View logs, artifacts, and results

### Common Issues & Solutions

#### 1. NPM Installation Errors
**Error:** `npm ci` fails due to lock file mismatch
**Solution:** Run `npm install` locally to sync lock file

#### 2. Browser Installation Issues
**Error:** Playwright browser installation fails
**Solution:** Check network connectivity or clear Playwright cache

#### 3. Test Timeouts
**Error:** Tests timeout after 60 minutes
**Solution:** Optimize test performance or increase timeout

#### 4. Memory Issues
**Error:** Out of memory during test execution
**Solution:** Reduce parallel workers or optimize test data

### Accessing Test Reports

#### Method 1: GitHub Actions Artifacts (Quick Access)
1. In workflow run, click on "Artifacts" section
2. Download `playwright-report` artifact
3. Open `index.html` in browser to view detailed results
4. **Note**: Artifacts are available for 30 days

#### Method 2: GitHub Pages (Always Available)
1. Go to repository Settings → Pages
2. Find the deployed Allure report URL
3. Access comprehensive test reports with historical trends
4. **Note**: Reports are updated with each workflow run

## 🛠️ Customization Options

### Changing Node.js Version
```yaml
node-version: 24.x  # Can change to 20.x, 22.x, etc.
```

### Modifying Trigger Branches
```yaml
branches: [ main, master, develop ]  # Add more branches
```

### Adjusting Timeout
```yaml
timeout-minutes: 45  # Reduce or increase as needed
```

### Adding Environment Variables
```yaml
env:
  BASE_URL: https://staging.yesmadam.com
  CI: true
```

## 📈 Best Practices

### 1. Branch Protection
- Enable branch protection rules for `main`/`master`
- Require status checks to pass before merging

### 2. Artifact Management
- Regularly download and archive important test reports
- Use shorter retention periods for large artifacts

### 3. Performance Optimization
- Use matrix strategies for multi-browser testing
- Implement test parallelization
- Cache dependencies and browsers

### 4. Security Considerations
- Store sensitive data in GitHub Secrets
- Regularly update action versions
- Monitor for deprecated warnings

## 🚀 Advanced Features

### Matrix Testing (for future enhancement)
```yaml
strategy:
  matrix:
    node-version: ['18', '20', '22']
    os: [ubuntu-latest, windows-latest]
```

### Manual Dispatch (for future enhancement)
```yaml
workflow_dispatch:
  inputs:
    environment:
      description: 'Test environment'
      required: true
      default: 'staging'
```

## 📞 Support

For issues with this workflow:
1. Check GitHub Actions logs for detailed error messages
2. Verify local test execution works correctly
3. Ensure all dependencies are properly defined
4. Check GitHub Secrets for any required credentials

---

*This workflow ensures reliable, automated testing of your Playwright automation framework with optimal performance and comprehensive reporting.*