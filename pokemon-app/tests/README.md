# Testing Configuration Guide

This document explains the testing setup and configuration for the Pokemon App.

## Test Structure

```
tests/
├── integration/          # Integration tests (Vitest + React Testing Library)
│   └── App.integration.test.tsx
└── e2e/                  # End-to-end tests (Playwright)
    └── pokemon-flow.spec.ts
```

## Test Types

### Integration Tests (`tests/integration/`)

**Framework:** Vitest + React Testing Library  
**Environment:** jsdom (simulated browser)  
**Purpose:** Test React components and their interactions in isolation

**Characteristics:**
- Fast execution
- Runs in Node.js with jsdom
- Mocks API calls at the service level
- Tests component behavior and user interactions
- No real browser needed

**Configuration:** `vitest.config.ts`

### E2E Tests (`tests/e2e/`)

**Framework:** Playwright  
**Environment:** Real browser (Chromium, Firefox, WebKit)  
**Purpose:** Test the full application flow in a real browser

**Characteristics:**
- Slower execution (real browser)
- Tests actual browser behavior
- Can intercept network requests
- Can run in headed mode (visible browser)
- Tests the complete user journey

**Configuration:** `playwright.config.ts`

## Configuration Files

### 1. Vitest Configuration (`vitest.config.ts`)

**Location:** Root of the project  
**Purpose:** Configures integration tests

**Key Settings:**
- `test.include`: Only runs tests in `tests/integration/`
- `test.exclude`: Excludes e2e tests and other directories
- `test.environment`: Set to `jsdom` for DOM simulation
- `test.setupFiles`: Points to `src/test/setup.ts` for global test setup
- `test.globals`: Enables global test functions (describe, it, expect)

**Global Setup File:** `src/test/setup.ts`
- Imports `@testing-library/jest-dom` for custom matchers
- Mocks `IntersectionObserver` for infinite scroll components
- Cleans up after each test (localStorage, etc.)

### 2. Playwright Configuration (`playwright.config.ts`)

**Location:** Root of the project  
**Purpose:** Configures E2E tests

**Key Settings:**
- `testDir`: Points to `./tests/e2e`
- `baseURL`: Set to `http://localhost:5173` (dev server)
- `webServer`: Automatically starts dev server if not running
- `use.trace`: Records traces for debugging
- `use.screenshot`: Takes screenshots on failure
- `use.video`: Records video on failure

**Projects:** Configured to run on Chromium by default

### 3. Test Setup File (`src/test/setup.ts`)

**Location:** `src/test/setup.ts`  
**Purpose:** Global configuration for integration tests

**What it does:**
- Imports Jest DOM matchers (`toBeVisible`, `toBeInTheDocument`, etc.)
- Mocks browser APIs (IntersectionObserver)
- Cleans up state after each test

## Running Tests

### Integration Tests

```bash
# Run all integration tests
npm test

# Run in watch mode
npm test -- --watch

# Run with UI
npm run test:ui
```

### E2E Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests (visible browser)
npm run test:e2e:headed

# Run E2E tests with UI
npm run test:e2e:ui
```

## Global Test Configuration

### For Integration Tests (Vitest)

**Global config location:** `vitest.config.ts`

**Global setup:** `src/test/setup.ts`

**What's available globally:**
- `describe`, `it`, `test` - Test structure
- `expect` - Assertions
- `vi` - Vitest mocking utilities
- `beforeEach`, `afterEach`, `beforeAll`, `afterAll` - Hooks

**Custom matchers:** From `@testing-library/jest-dom`
- `toBeVisible()`
- `toBeInTheDocument()`
- `toHaveTextContent()`
- And many more...

### For E2E Tests (Playwright)

**Global config location:** `playwright.config.ts`

**What's available in tests:**
- `test` - Test function
- `expect` - Playwright assertions
- `page` - Browser page object
- `context` - Browser context
- `browser` - Browser instance

**Fixtures:** Automatically injected
- `page` - Isolated page instance
- `context` - Browser context
- `browser` - Browser instance

## Configuration Hierarchy

```
Root Configuration
├── vitest.config.ts          → Integration tests config
│   └── References: src/test/setup.ts (global setup)
│
├── playwright.config.ts      → E2E tests config
│   └── testDir: ./tests/e2e
│
└── src/test/setup.ts         → Global setup for integration tests
    ├── @testing-library/jest-dom (custom matchers)
    ├── IntersectionObserver mock
    └── Cleanup hooks
```

## Key Differences

| Feature | Integration Tests | E2E Tests |
|---------|------------------|----------|
| **Framework** | Vitest | Playwright |
| **Environment** | jsdom (simulated) | Real browser |
| **Speed** | Fast | Slower |
| **API Mocking** | Service level | Network level |
| **Browser** | No | Yes (visible option) |
| **Use Case** | Component behavior | Full user flows |

## Best Practices

1. **Integration Tests:** Use for testing component logic, user interactions, and state management
2. **E2E Tests:** Use for testing critical user journeys and full application flows
3. **Keep them separate:** Integration tests in `tests/integration/`, E2E tests in `tests/e2e/`
4. **Mock appropriately:** Integration tests mock services, E2E tests mock network requests
