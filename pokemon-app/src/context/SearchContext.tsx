// src/context/SearchContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { SearchContextType, SortOrder } from "../types";

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("number");

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, sortOrder, setSortOrder }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error("useSearch must be used within a SearchProvider");
  return context;
};
