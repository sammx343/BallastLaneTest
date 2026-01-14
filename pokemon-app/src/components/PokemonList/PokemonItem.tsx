// src/components/PokemonItem.tsx
import React from "react";
import { Link } from "react-router-dom";
import { type Pokemon } from "../../types";

interface PokemonItemProps {
  pokemon: Pokemon;
}

const PokemonItem: React.FC<PokemonItemProps> = ({ pokemon }) => {
  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="relative bg-gray-white rounded-lg shadow-drop-2dp hover:shadow-drop-6dp transition-shadow flex flex-col md:w-[200px]"
    >
      <span className="absolute top-1 right-2 text-caption text-gray-medium">
        #{String(pokemon.number).padStart(3, "0")}
      </span>

      <div className="p-4 flex justify-center items-center">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="h-[4.5rem] w-[4.5rem] object-contain z-10"
        />
      </div>

      <div className="bg-gray-background rounded-lg pt-6 pb-1 px-2 text-center -mt-8">
        <h3 className="text-body-3 text-gray-dark capitalize truncate">
          {pokemon.name}
        </h3>
      </div>
    </Link>
  );
};

export default PokemonItem;
