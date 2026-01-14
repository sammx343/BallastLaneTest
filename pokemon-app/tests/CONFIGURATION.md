# Test Configuration Reference

## Quick Reference: Where is Everything?

### Integration Tests (Vitest)

**Test Files Location:** `tests/integration/`  
**Config File:** `vitest.config.ts` (root)  
**Global Setup:** `src/test/setup.ts`  
**Command:** `npm test`

### E2E Tests (Playwright)

**Test Files Location:** `tests/e2e/`  
**Config File:** `playwright.config.ts` (root)  
**Global Setup:** None (Playwright handles it)  
**Command:** `npm run test:e2e`

---

## Detailed Configuration Breakdown

### 1. Vitest Configuration (`vitest.config.ts`)

```typescript
export default defineConfig({
  plugins: [react(), svgrPlugin()],
  test: {
    globals: true,                    // Enables global test functions
    environment: 'jsdom',             // Simulates browser DOM
    setupFiles: './src/test/setup.ts', // Global setup file
    include: ['tests/integration/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'tests/e2e'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**What this config does:**
- **`globals: true`** - Makes `describe`, `it`, `expect`, `vi` available globally
- **`environment: 'jsdom'`** - Provides a simulated browser environment
- **`setupFiles`** - Runs `src/test/setup.ts` before all tests
- **`include`** - Only runs tests matching this pattern (integration folder)
- **`exclude`** - Excludes e2e tests and other directories

### 2. Playwright Configuration (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './tests/e2e',            // Where to find E2E tests
  fullyParallel: true,               // Run tests in parallel
  retries: process.env.CI ? 2 : 0,   // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',                  // Generate HTML reports
  use: {
    baseURL: 'http://localhost:5173', // Base URL for navigation
    trace: 'on-first-retry',         // Record traces for debugging
    screenshot: 'only-on-failure',    // Take screenshots on failure
    video: 'retain-on-failure',       // Record video on failure
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',           // Start dev server automatically
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

**What this config does:**
- **`testDir`** - Points to `tests/e2e` folder
- **`baseURL`** - All `page.goto()` calls are relative to this
- **`webServer`** - Automatically starts dev server if not running
- **`use`** - Default settings for all tests (screenshots, videos, traces)
- **`projects`** - Browser configurations (Chromium, Firefox, WebKit)

### 3. Global Setup (`src/test/setup.ts`)

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() { return []; }
    unobserve() {}
  } as any;
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
});
```

**What this does:**
- **`@testing-library/jest-dom`** - Adds custom matchers like `toBeVisible()`
- **`IntersectionObserver` mock** - Needed for infinite scroll components
- **`cleanup()`** - Cleans up React components after each test
- **`localStorage.clear()`** - Ensures clean state between tests

---

## Configuration Flow

### Integration Test Execution Flow

```
1. npm test
   ↓
2. Vitest reads vitest.config.ts
   ↓
3. Runs src/test/setup.ts (global setup)
   ↓
4. Finds tests in tests/integration/
   ↓
5. Executes tests in jsdom environment
```

### E2E Test Execution Flow

```
1. npm run test:e2e
   ↓
2. Playwright reads playwright.config.ts
   ↓
3. Starts webServer (dev server) if needed
   ↓
4. Finds tests in tests/e2e/
   ↓
5. Launches browser (Chromium)
   ↓
6. Executes tests in real browser
```

---

## Environment Variables

### Vitest
- No special environment variables needed
- Uses Node.js environment

### Playwright
- `CI=true` - Enables retries and single worker mode
- Automatically detects if dev server is running

---

## File Structure Summary

```
pokemon-app/
├── vitest.config.ts          ← Integration tests config
├── playwright.config.ts      ← E2E tests config
├── src/
│   └── test/
│       └── setup.ts          ← Global setup for integration tests
└── tests/
    ├── integration/          ← Integration test files
    │   └── App.integration.test.tsx
    └── e2e/                  ← E2E test files
        └── pokemon-flow.spec.ts
```

---

## Commands Reference

| Command | What it does | Config Used |
|---------|--------------|-------------|
| `npm test` | Run integration tests | `vitest.config.ts` |
| `npm test -- --watch` | Run integration tests in watch mode | `vitest.config.ts` |
| `npm run test:ui` | Open Vitest UI | `vitest.config.ts` |
| `npm run test:e2e` | Run E2E tests (headless) | `playwright.config.ts` |
| `npm run test:e2e:headed` | Run E2E tests (visible browser) | `playwright.config.ts` |
| `npm run test:e2e:ui` | Open Playwright UI | `playwright.config.ts` |

---

## Global Test Configuration Summary

### What's "Global"?

**For Integration Tests:**
- Test functions (`describe`, `it`, `expect`) - Available globally via `globals: true`
- Custom matchers (`toBeVisible`, etc.) - From `@testing-library/jest-dom`
- Mock utilities (`vi`) - From Vitest
- Setup/teardown - Runs before/after all tests

**For E2E Tests:**
- Test function (`test`) - Available in test files
- Assertions (`expect`) - From Playwright
- Fixtures (`page`, `context`) - Injected automatically
- Browser settings - From `playwright.config.ts`

### Where to Change Global Settings

1. **Integration test behavior:** Edit `vitest.config.ts`
2. **E2E test behavior:** Edit `playwright.config.ts`
3. **Global setup for integration:** Edit `src/test/setup.ts`
4. **Browser settings for E2E:** Edit `playwright.config.ts` → `projects`
