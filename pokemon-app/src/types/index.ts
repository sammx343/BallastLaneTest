export interface Pokemon {
  id: number;
  name: string;
  number: number;
  image: string;
}

export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export type SortOrder = "number" | "name";

export interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

export interface PokemonDetail extends Pokemon {
  types: string[];
  weight: number;
  height: number;
  abilities: string[];
  stats: PokemonStats;
  description: string;
}
