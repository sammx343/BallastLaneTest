import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pokemonService } from "../../services/api";
import { type PokemonDetail as IPokemonDetail } from "../../types";
import weightIcon from "../../assets/images/weight.svg";
import heightIcon from "../../assets/images/straighten.svg";
import ChevronLeft from "../../assets/images/chevron_left.svg?react";
import ChevronRight from "../../assets/images/chevron_right.svg?react";
import Pokeball from "../../assets/images/pokeball.svg?react";
import ArrowBack from "../../assets/images/arrow_back.svg?react";

import Loading from "../../shared/components/Loading";

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<IPokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Pokémon ID is required");
      return;
    }

    let cancelled = false;

    setError(null);
    pokemonService
      .getById(id)
      .then((data) => {
        if (!cancelled) {
          setPokemon(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error loading Pokémon");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const changeRoute = (value: number) => {
    if (!id) return;
    const newId = parseInt(id) + value;
    navigate(`/pokemon/${newId}`);
  };

  if (loading) return <Loading />;

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-identity flex flex-col items-center justify-center p-4">
        <div className="bg-gray-white rounded-lg shadow-drop-6dp p-8 max-w-md text-center">
          <div className="text-gray-light text-6xl mb-4">?</div>
          <h2 className="text-headline font-bold text-gray-dark mb-2">
            Pokémon not found
          </h2>
          <p className="text-body-1 text-gray-medium mb-6">{error || "Unable to load Pokémon details"}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-type-grass hover:bg-type-grass/90 text-gray-white font-bold py-3 px-6 rounded-lg transition-colors shadow-drop-2dp"
          >
            Go back to Pokédex
          </button>
        </div>
      </div>
    );
  }

  const mainType = pokemon.types[0];
  const themeColor = `bg-type-${mainType}`;
  const textColor = `text-type-${mainType}`;

  return (
    <div className={`min-h-screen ${themeColor} flex flex-col relative`}>
      <div className="container mx-auto max-w-[760px]">
        <header className="p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
              aria-label="Go back to pokemon list"
            >
              <ArrowBack
                className="w-8 h-8 fill-white"
                aria-hidden="true"
              />
            </button>
            <h1 className="text-gray-white text-headline font-bold capitalize">
              {pokemon.name}
            </h1>
          </div>
          <span className="text-gray-white font-bold">
            #{String(pokemon.number).padStart(3, "0")}
          </span>
        </header>

        <div className="absolute top-2 right-2 opacity-10" aria-hidden="true">
          <Pokeball className="w-40 h-40 fill-white" />
        </div>

        <div className="relative h-40 z-20 flex justify-center">
          {parseInt(id || "1") > 1 && (
            <button
              onClick={() => changeRoute(-1)}
              className="absolute left-8 bottom-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
              aria-label="Previous pokemon"
            >
              <ChevronLeft
                className="w-8 h-8 fill-white drop-shadow-[_1px_1px_rgba(0,0,0,0.5)]"
                aria-hidden="true"
              />
            </button>
          )}
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="w-52 h-52 object-contain absolute top-4 drop-shadow-[6px_9px_2px_rgba(0,0,0,0.5)]"
          />
          <button
            onClick={() => changeRoute(1)}
            className="absolute right-8 bottom-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
            aria-label="Next pokemon"
          >
            <ChevronRight
              className="w-8 h-8 fill-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]"
              aria-hidden="true"
            />
          </button>
        </div>

        <main className="flex-1 mx-1 mb-1 mt-4 bg-gray-white rounded-lg shadow-inner-2dp p-6 pt-16 flex flex-col gap-6">
          <div className="flex justify-center gap-4">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`px-3 py-1 rounded-full text-gray-white text-caption font-bold capitalize bg-type-${type}`}
              >
                {type}
              </span>
            ))}
          </div>

          {/* About Section */}
          <section className="flex flex-col gap-4 text-center">
            <h2 className={`font-bold text-body-1 ${textColor}`}>About</h2>

            <div className="flex justify-around items-center divide-x divide-gray-light">
              <div className="flex-1 flex flex-col gap-2 items-center">
                <div className="flex items-center gap-2">
                  <img src={weightIcon} alt="Weight icon" className="w-4 h-4" />
                  <span className="text-body-3 text-gray-dark">
                    {pokemon.weight} kg
                  </span>
                </div>
                <span className="text-caption text-gray-medium">Weight</span>
              </div>

              <div className="flex-1 flex flex-col gap-2 items-center">
                <div className="flex items-center gap-2">
                  <img src={heightIcon} alt="Height icon" className="w-4 h-4" />
                  <span className="text-body-3 text-gray-dark">
                    {pokemon.height} m
                  </span>
                </div>
                <span className="text-caption text-gray-medium">Height</span>
              </div>

              <div className="flex-1 flex flex-col gap-1 items-center">
                {pokemon.abilities.map((ab) => (
                  <span
                    key={ab}
                    className="text-body-3 text-gray-dark capitalize"
                  >
                    {ab}
                  </span>
                ))}
                <span className="text-caption text-gray-medium">Abilities</span>
              </div>
            </div>

            <p className="text-body-3 text-gray-dark px-4 text-left leading-relaxed">
              {pokemon.description}
            </p>
          </section>

          {/* Base Stats Section */}
          <section className="flex flex-col gap-4">
            <h2 className={`font-bold text-body-1 text-center ${textColor}`}>
              Base Stats
            </h2>
            <div className="flex flex-col gap-2">
              <StatRow
                label="HP"
                value={pokemon.stats.hp}
                colorClass={themeColor}
              />
              <StatRow
                label="ATK"
                value={pokemon.stats.attack}
                colorClass={themeColor}
              />
              <StatRow
                label="DEF"
                value={pokemon.stats.defense}
                colorClass={themeColor}
              />
              <StatRow
                label="SATK"
                value={pokemon.stats.special_attack}
                colorClass={themeColor}
              />
              <StatRow
                label="SDEF"
                value={pokemon.stats.special_defense}
                colorClass={themeColor}
              />
              <StatRow
                label="SPD"
                value={pokemon.stats.speed}
                colorClass={themeColor}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

const StatRow = ({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) => {
  const maxValue = 255;
  const percentage = (value / maxValue) * 100;

  return (
    <div className="flex items-center gap-4">
      <span className="w-10 text-caption font-bold text-gray-medium border-r border-gray-light pr-2">
        {label}
      </span>
      <span className="w-8 text-body-3 text-gray-dark">
        {String(value).padStart(3, "0")}
      </span>
      <div className="flex-1 h-2 bg-gray-light rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass.replace("bg-", "bg-")}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PokemonDetail;
