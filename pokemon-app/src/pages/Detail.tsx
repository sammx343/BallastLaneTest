import React from "react";
import PokemonDetail from "../components/PokemonDetail/PokemonDetail";

const Detail: React.FC = () => {
  return (
    <>
      <title>Detalles del Pokémon | Pokédex</title>
      <meta name="robots" content="noindex, nofollow" />

      <PokemonDetail />
    </>
  );
};

export default Detail;
