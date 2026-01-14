import React from "react";
import Navbar from "../components/Navbar/Navbar";
import PokemonList from "../components/PokemonList/PokemonList";
import { SearchProvider } from "../context/SearchContext";

const Home: React.FC = () => {
  return (
    <SearchProvider>
      <title>Pokédex | Inicio</title>
      <meta name="robots" content="noindex, nofollow" />

      <div className="min-h-screen bg-identity flex flex-col">
        <Navbar />
        <main className="flex-1 mx-1 mb-1 bg-gray-white rounded-lg shadow-inner-2dp overflow-hidden">
          <div className="h-full overflow-y-auto p-3">
            <PokemonList />
          </div>
        </main>
      </div>
    </SearchProvider>
  );
};

export default Home;
