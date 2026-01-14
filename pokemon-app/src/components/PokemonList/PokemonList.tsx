// src/components/PokemonList.tsx
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import PokemonItem from "./PokemonItem";
import { useSearch } from "../../context/SearchContext";
import useDebounce from "../../hooks/useDebounce";
import { pokemonService } from "../../services/api";
import { type Pokemon } from "../../types";

const PokemonList: React.FC = () => {
  const { searchTerm, sortOrder } = useSearch();
  // Delay of 0.75s to avoid saturating the Rails backend
  const debouncedSearch = useDebounce<string>(searchTerm, 750);

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  // Reference for Intersection Observer
  const observer = useRef<IntersectionObserver | null>(null);

  // Intersection Observer: Detects when we reach the end of the list
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // Only request more if there's more data, we're not loading, and NOT searching
        if (entries[0].isIntersecting && hasMore && !debouncedSearch) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, debouncedSearch]
  );

  // Reset state when search term changes
  const resetPokemonList = useCallback(() => {
    setPokemons([]);
    setPage(1);
    setHasMore(true);
  }, []);

  // Handle search results
  const handleSearchResults = useCallback(
    (searchResults: Pokemon[], abortSignal: AbortSignal) => {
      if (abortSignal.aborted) return;
      setPokemons(searchResults);
      setHasMore(false);
    },
    []
  );

  // Handle pagination results (append to existing list)
  const handlePaginationResults = useCallback(
    (
      paginationResults: Pokemon[],
      totalCount: number,
      abortSignal: AbortSignal
    ) => {
      if (abortSignal.aborted) return;
      setPokemons((prev) => {
        const newPokemons = [...prev, ...paginationResults];
        const totalLoaded = newPokemons.length;
        const hasReachedEnd =
          paginationResults.length === 0 || totalLoaded >= totalCount;
        if (hasReachedEnd) {
          setHasMore(false);
        }
        return newPokemons;
      });
    },
    []
  );

  // Handle errors during data loading
  const handleLoadError = useCallback(
    (error: unknown, abortSignal: AbortSignal) => {
      if (abortSignal.aborted) return;
      console.error("Error loading pokemons", error);
      setPokemons([]);
    },
    []
  );

  // Load pokemon data (either search or pagination)
  const loadPokemonData = useCallback(
    async (abortSignal: AbortSignal) => {
      setLoading(true);
      try {
        if (debouncedSearch) {
          const result = await pokemonService.search(debouncedSearch);
          handleSearchResults(result.data, abortSignal);
        } else {
          const result = await pokemonService.getAll(page, 20);
          handlePaginationResults(
            result.data,
            result.meta.total_count,
            abortSignal
          );
        }
      } catch (error) {
        handleLoadError(error, abortSignal);
      } finally {
        if (!abortSignal.aborted) {
          setLoading(false);
        }
      }
    },
    [debouncedSearch, page, handleSearchResults, handlePaginationResults, handleLoadError]
  );

  // Reset list when search term changes
  useEffect(() => {
    resetPokemonList();
  }, [debouncedSearch, resetPokemonList]);

  // Load data when page or search term changes
  useEffect(() => {
    const abortController = new AbortController();
    loadPokemonData(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [page, debouncedSearch, loadPokemonData]);

  // SORT: Sort pokemons according to selected sortOrder
  const sortedPokemons = useMemo(() => {
    const sorted = [...pokemons];
    if (sortOrder === "number") {
      return sorted.sort((a, b) => a.number - b.number);
    } else {
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [pokemons, sortOrder]);

  if (!loading && pokemons.length === 0 && debouncedSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-gray-light text-6xl mb-4">?</div>
        <p className="text-body-1 font-bold text-gray-medium">
          No Pokémon found
        </p>
        <p className="text-caption text-gray-light">
          Try another name or number
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="container mx-auto max-w-[1280px]">
        {/* Grid of 3 columns according to Figma, 4 in md+ */}
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 md:justify-items-center">
          {sortedPokemons.map((p, index) => (
            <PokemonItem key={`${p.id}-${index}`} pokemon={p} />
          ))}
        </div>
      </div>

      {/* Sentinel: This div triggers loading of the next page */}
      <div
        ref={lastElementRef}
        className="h-20 flex justify-center items-center"
      >
        {loading && (
          <div className="text-body-3 text-gray-medium animate-pulse" role="status" aria-live="polite">
            Loading Pokédex...
          </div>
        )}
        {!hasMore && !debouncedSearch && pokemons.length > 0 && (
          <div className="text-body-3 text-gray-light" role="status">
            You have reached the end of the list
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonList;
