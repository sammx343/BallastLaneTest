// src/services/api.ts
import { type Pokemon, type PokemonDetail } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface PaginatedResponse {
  data: Pokemon[];
  meta: {
    total_count: number;
    total_pages: number;
    current_page: number;
  };
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    username: string;
  };
}

interface LoginError {
  error: string;
}

export const pokemonService = {
  // Get paginated list
  async getAll(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse> {
    const response = await fetch(
      `${API_BASE_URL}/pokemons?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Error loading Pokémons");
    return response.json();
  },
  // Search by name
  async search(term: string): Promise<PaginatedResponse> {
    const response = await fetch(`${API_BASE_URL}/pokemons?search=${term}`);
    if (!response.ok) throw new Error("Search error");
    return response.json();
  },
  async getById(id: string | number): Promise<PokemonDetail> {
    const response = await fetch(`${API_BASE_URL}/pokemons/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Pokémon not found");
      }
      throw new Error("Error connecting to server");
    }

    return response.json();
  },
};

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      let errorMessage = "Error signing in";
      try {
        const data = await response.json();
        const error = data as LoginError;
        errorMessage = error.error || errorMessage;
      } catch {
        // If response is not JSON, use default error message
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<LoginResponse>;
  },
};
