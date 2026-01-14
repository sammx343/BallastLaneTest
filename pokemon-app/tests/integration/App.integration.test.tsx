import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

// Mock the API services
vi.mock('../../src/services/api', () => ({
  authService: {
    login: vi.fn(),
  },
  pokemonService: {
    search: vi.fn(),
    getById: vi.fn(),
    getAll: vi.fn(),
  },
}));

import { authService, pokemonService } from '../../src/services/api';

describe('Pokemon App Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should complete full user flow: login -> search pokemon 1 -> view details -> navigate to next pokemon', async () => {
    const user = userEvent.setup();

    // Mock login response
    const mockToken = 'test-token-123';
    const mockLoginResponse = {
      message: 'Login successful',
      token: mockToken,
      user: {
        username: 'testuser',
      },
    };
    vi.mocked(authService.login).mockResolvedValue(mockLoginResponse);

    // Mock search response for pokemon number 1
    const mockPokemon1 = {
      id: 1,
      name: 'bulbasaur',
      number: 1,
      image: 'https://example.com/bulbasaur.png',
    };
    const mockSearchResponse = {
      data: [mockPokemon1],
      meta: {
        total_count: 1,
        total_pages: 1,
        current_page: 1,
      },
    };
    vi.mocked(pokemonService.search).mockResolvedValue(mockSearchResponse);

    // Mock getAll for initial page load (empty or some pokemons)
    vi.mocked(pokemonService.getAll).mockResolvedValue({
      data: [],
      meta: {
        total_count: 100,
        total_pages: 5,
        current_page: 1,
      },
    });

    // Mock pokemon detail for pokemon 1
    const mockPokemon1Detail = {
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
    };
    vi.mocked(pokemonService.getById).mockImplementation((id: string | number) => {
      if (id === '1' || id === 1) {
        return Promise.resolve(mockPokemon1Detail);
      }
      // Mock pokemon 2 detail for when clicking next
      return Promise.resolve({
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
      });
    });

    // Render the app
    render(<App />);

    // Step 1: Login
    // Should be on login page initially
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

    // Fill in login form
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(signInButton);

    // Wait for login to complete and navigation to home
    await waitFor(() => {
      expect(screen.getByText(/pokédex/i)).toBeInTheDocument();
    });

    // Step 2: Search for pokemon number 1
    // Find the search input (there are two - desktop and mobile, we'll use the first one)
    const searchInputs = screen.getAllByLabelText(/search pokemon by name or pokedex number/i);
    const searchInput = searchInputs[0]; // Use the first one (desktop version)
    
    // Type "1" in the search input
    await user.type(searchInput, '1');

    // Wait for debounced search (750ms) and API call
    await waitFor(
      () => {
        expect(pokemonService.search).toHaveBeenCalledWith('1');
      },
      { timeout: 2000 }
    );

    // Wait for search results to appear
    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    });

    // Step 3: Click the first pokemon (bulbasaur)
    const pokemonLink = screen.getByText(/bulbasaur/i).closest('a');
    expect(pokemonLink).toBeInTheDocument();
    
    if (pokemonLink) {
      await user.click(pokemonLink);
    }

    // Wait for navigation to detail page and pokemon detail to load
    await waitFor(() => {
      expect(pokemonService.getById).toHaveBeenCalledWith('1');
    });

    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/#001/i)).toBeInTheDocument();
    });

    // Step 4: Wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 5: Click the Chevron right (next pokemon) button
    const nextButton = screen.getByLabelText(/next pokemon/i);
    expect(nextButton).toBeInTheDocument();
    
    await user.click(nextButton);

    // Wait for navigation to pokemon 2 and detail to load
    await waitFor(() => {
      expect(pokemonService.getById).toHaveBeenCalledWith('2');
    });

    await waitFor(() => {
      expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
      expect(screen.getByText(/#002/i)).toBeInTheDocument();
    });

    // Verify all API calls were made correctly
    expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
    expect(pokemonService.search).toHaveBeenCalledWith('1');
    expect(pokemonService.getById).toHaveBeenCalledWith('1');
    expect(pokemonService.getById).toHaveBeenCalledWith('2');
  });
});
