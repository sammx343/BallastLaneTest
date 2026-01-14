import { test, expect } from '@playwright/test';

test.describe('Pokemon App E2E Flow', () => {
  test('should complete full user flow: login -> search pokemon 1 -> view details -> navigate to next pokemon', async ({ page, context }) => {
    // Clear localStorage to ensure we start fresh
    await context.clearCookies();
    await page.addInitScript(() => {
      localStorage.clear();
    });

    // Mock API responses - only intercept API calls, not page routes
    await page.route('**/login', async (route) => {
      // Only mock POST requests to /login (API calls), not GET requests (page navigation)
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Login successful',
            token: 'test-token-123',
            user: {
              username: 'testuser',
            },
          }),
        });
      } else {
        // Let GET requests (page navigation) pass through
        await route.continue();
      }
    });

    await page.route('**/pokemons**', async (route) => {
      const url = new URL(route.request().url());
      const searchParams = url.searchParams;
      
      // Mock search request
      if (searchParams.get('search') === '1') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [
              {
                id: 1,
                name: 'bulbasaur',
                number: 1,
                image: 'https://example.com/bulbasaur.png',
              },
            ],
            meta: {
              total_count: 1,
              total_pages: 1,
              current_page: 1,
            },
          }),
        });
        return;
      }
      
      // Mock pagination request (page parameter)
      if (searchParams.get('page')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [],
            meta: {
              total_count: 100,
              total_pages: 5,
              current_page: 1,
            },
          }),
        });
        return;
      }
      
      // Mock pokemon detail by ID (path like /pokemons/1)
      const pathMatch = url.pathname.match(/\/pokemons\/(\d+)$/);
      if (pathMatch) {
        const pokemonId = pathMatch[1];
        if (pokemonId === '1') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 1,
              name: 'bulbasaur',
              number: 1,
              image: 'https://example.com/bulbasaur.png',
              types: ['grass', 'poison'],
              weight: 6.9,
              height: 0.7,
              abilities: ['overgrow', 'chlorophyll'],
              stats: {
                hp: 45,
                attack: 49,
                defense: 49,
                special_attack: 65,
                special_defense: 65,
                speed: 45,
              },
              description: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
            }),
          });
          return;
        } else if (pokemonId === '2') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 2,
              name: 'ivysaur',
              number: 2,
              image: 'https://example.com/ivysaur.png',
              types: ['grass', 'poison'],
              weight: 13.0,
              height: 1.0,
              abilities: ['overgrow', 'chlorophyll'],
              stats: {
                hp: 60,
                attack: 62,
                defense: 63,
                special_attack: 80,
                special_defense: 80,
                speed: 60,
              },
              description: 'When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.',
            }),
          });
          return;
        }
      }
      
      // Let other requests pass through
      await route.continue();
    });

    // Step 1: Navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Wait for the form to be present
    const form = page.locator('form');
    await expect(form).toBeVisible({ timeout: 15000 });
    
    // Find inputs by their ID (most reliable)
    const usernameInput = page.locator('#username');
    await expect(usernameInput).toBeVisible({ timeout: 15000 });

    // Fill in login form
    await usernameInput.fill('testuser');
    const passwordInput = page.locator('#password');
    await passwordInput.fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for navigation to home page
    await expect(page.getByText(/pokédex/i)).toBeVisible();

    // Step 2: Search for pokemon number 1
    const searchInput = page.locator('input[aria-label*="search pokemon" i]').first();
    await searchInput.fill('1');

    // Wait for debounced search (750ms) and results to appear
    await expect(page.getByText(/bulbasaur/i)).toBeVisible({ timeout: 5000 });

    // Step 3: Click the first pokemon (bulbasaur) - find the link containing bulbasaur
    const pokemonLink = page.locator('a').filter({ hasText: /bulbasaur/i }).first();
    await pokemonLink.click();

    // Wait for navigation to detail page
    await expect(page.getByText(/bulbasaur/i)).toBeVisible();
    await expect(page.getByText(/#001/i)).toBeVisible();

    // Step 4: Wait 2 seconds
    await page.waitForTimeout(2000);

    // Step 5: Click the Chevron right (next pokemon) button
    const nextButton = page.locator('button[aria-label*="next pokemon" i]');
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Wait for navigation to pokemon 2 and detail to load
    await expect(page.getByText(/ivysaur/i)).toBeVisible();
    await expect(page.getByText(/#002/i)).toBeVisible();
  });
});
