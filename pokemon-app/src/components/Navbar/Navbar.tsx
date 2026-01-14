// src/components/Navbar.tsx
import React from "react";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Pokeball from "../../assets/images/pokeball.svg?react";
import SearchIcon from "../../assets/images/search.svg?react";
import Logout from "../../assets/images/logout.svg?react";

import Filter from "./Filter";

const Navbar: React.FC = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="p-4 pt-6 flex flex-col gap-4 relative">
      <div className="flex items-center gap-4">
        <Pokeball className="w-6 h-6 fill-white" aria-hidden="true" />
        <h1 className="text-gray-white text-headline font-bold">Pokédex</h1>

        <button
          onClick={handleLogout}
          className="absolute right-4 bg-gray-white p-2 rounded-full shadow-drop-2dp hover:shadow-drop-6dp transition-shadow"
          aria-label="Logout"
        >
          <Logout className="w-6 h-6 fill-white" aria-hidden="true" />
        </button>
        {/* Search and Filter - beside title on md+ */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative w-[200px]">
            <label htmlFor="search-desktop" className="sr-only">Search pokemon by name or pokedex number</label>
            <span className="absolute inset-y-0 left-3 flex items-center text-identity pointer-events-none">
              <SearchIcon
                className="w-6 h-6 fill-identity"
                aria-hidden="true"
              />
            </span>
            <input
              id="search-desktop"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search pokemon by name or pokedex number"
              className="w-full bg-gray-white rounded-full py-2 pl-10 pr-4 text-body-1 shadow-inner-2dp focus:outline-none"
            />
          </div>
          <Filter />

        </div>
      </div>

      {/* Search and Filter - below title on mobile */}
      <div className="flex items-center gap-2 md:hidden w-full">
        <div className="relative flex-1 min-w-0">
          <label htmlFor="search-mobile" className="sr-only">Search pokemon by name or pokedex number</label>
          <span className="absolute inset-y-0 left-3 flex items-center text-identity pointer-events-none">
            <SearchIcon
              className="w-6 h-6 fill-identity"
              aria-hidden="true"
            />
          </span>
          <input
            id="search-mobile"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search pokemon by name or pokedex number"
            className="w-full bg-gray-white rounded-full py-2 pl-10 pr-4 text-body-1 shadow-inner-2dp focus:outline-none"
          />
        </div>
        <Filter />
      </div>
    </header>
  );
};

export default Navbar;
