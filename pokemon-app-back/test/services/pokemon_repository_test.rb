require "test_helper"

class PokemonRepositoryTest < ActiveSupport::TestCase
  BASE_URL = "https://pokeapi.co/api/v2"

  test "find_all returns paginated pokemon list" do
    stub_pokemon_list_response

    result = PokemonRepository.find_all(page: 1, per_page: 20)

    assert result.key?(:data)
    assert result.key?(:meta)
    assert_equal 20, result[:data].length
    assert_equal 1302, result[:meta][:total_count]
    assert_equal 66, result[:meta][:total_pages]
    assert_equal 1, result[:meta][:current_page]
  end

  test "find_all handles different page numbers" do
    stub_pokemon_list_response(offset: 20)

    result = PokemonRepository.find_all(page: 2, per_page: 20)

    assert_equal 2, result[:meta][:current_page]
    assert_equal 20, result[:data].length
  end

  test "find_all handles custom per_page limit" do
    stub_pokemon_list_response(limit: 10, offset: 0)

    result = PokemonRepository.find_all(page: 1, per_page: 10)

    assert_equal 10, result[:data].length
  end

  test "find_all returns empty result when API fails" do
    stub_request(:get, "#{BASE_URL}/pokemon?limit=20&offset=0")
      .to_return(status: 500, body: "")

    result = PokemonRepository.find_all(page: 1, per_page: 20)

    assert_equal [], result[:data]
    assert_equal({}, result[:meta])
  end

  test "find_all creates Pokemon objects with correct attributes" do
    stub_pokemon_list_response

    result = PokemonRepository.find_all(page: 1, per_page: 20)
    pokemon = result[:data].first

    assert_instance_of Pokemon, pokemon
    assert_equal 1, pokemon.id
    assert_equal "bulbasaur", pokemon.name
    assert_equal 1, pokemon.number
    assert_includes pokemon.image, "official-artwork/1.png"
  end

  test "search returns pokemon when found" do
    stub_pokemon_detail_response("bulbasaur")
    stub_pokemon_species_response(1)

    result = PokemonRepository.search("bulbasaur")

    assert_equal 1, result[:data].length
    assert_equal 1, result[:meta][:total_count]
    assert_equal "bulbasaur", result[:data].first.name
  end

  test "search returns empty result when pokemon not found" do
    stub_request(:get, "#{BASE_URL}/pokemon/invalid-pokemon")
      .to_return(status: 404, body: "")

    result = PokemonRepository.search("invalid-pokemon")

    assert_equal [], result[:data]
    assert_equal 0, result[:meta][:total_count]
  end

  test "search is case insensitive" do
    stub_pokemon_detail_response("BULBASAUR")
    stub_pokemon_species_response(1)

    result = PokemonRepository.search("BULBASAUR")

    assert_equal 1, result[:data].length
  end

  test "search returns all pokemon when name is blank" do
    stub_pokemon_list_response

    result = PokemonRepository.search("")

    assert result[:data].length > 0
  end

  test "search returns all pokemon when name is nil" do
    stub_pokemon_list_response

    result = PokemonRepository.search(nil)

    assert result[:data].length > 0
  end

  test "find_by_id returns pokemon with all attributes" do
    stub_pokemon_detail_response(1)
    stub_pokemon_species_response(1)

    pokemon = PokemonRepository.find_by_id(1)

    assert_not_nil pokemon
    assert_equal 1, pokemon.id
    assert_equal "bulbasaur", pokemon.name
    assert_equal 1, pokemon.number
    assert pokemon.types.is_a?(Array)
    assert pokemon.abilities.is_a?(Array)
    assert pokemon.stats.is_a?(Hash)
    assert pokemon.weight.is_a?(Numeric)
    assert pokemon.height.is_a?(Numeric)
  end

  test "find_by_id converts weight from hectograms to kilograms" do
    stub_pokemon_detail_response(1, weight: 69)
    stub_pokemon_species_response(1)

    pokemon = PokemonRepository.find_by_id(1)

    assert_equal 6.9, pokemon.weight
  end

  test "find_by_id converts height from decimeters to meters" do
    stub_pokemon_detail_response(1, height: 7)
    stub_pokemon_species_response(1)

    pokemon = PokemonRepository.find_by_id(1)

    assert_equal 0.7, pokemon.height
  end

  test "find_by_id maps stats correctly" do
    stub_pokemon_detail_response(1)
    stub_pokemon_species_response(1)

    pokemon = PokemonRepository.find_by_id(1)

    assert pokemon.stats.key?(:hp)
    assert pokemon.stats.key?(:attack)
    assert pokemon.stats.key?(:defense)
    assert pokemon.stats.key?(:special_attack)
    assert pokemon.stats.key?(:special_defense)
    assert pokemon.stats.key?(:speed)
  end

  test "find_by_id handles missing species data gracefully" do
    stub_pokemon_detail_response(1)
    stub_request(:get, "#{BASE_URL}/pokemon-species/1")
      .to_return(status: 404, body: "")

    pokemon = PokemonRepository.find_by_id(1)

    assert_not_nil pokemon
    assert_equal "", pokemon.description
  end

  test "find_by_id extracts description from flavor text entries" do
    stub_pokemon_detail_response(1)
    stub_pokemon_species_response(1, description: "A strange seed was planted on its back.")

    pokemon = PokemonRepository.find_by_id(1)

    assert_equal "A strange seed was planted on its back.", pokemon.description
  end

  test "find_by_id returns nil when pokemon not found" do
    stub_request(:get, "#{BASE_URL}/pokemon/99999")
      .to_return(status: 404, body: "")

    pokemon = PokemonRepository.find_by_id(99999)

    assert_nil pokemon
  end

  test "find_by_id normalizes stat names with underscores" do
    stub_pokemon_detail_response(1, stats: [
      { stat: { name: "special-attack" }, base_stat: 65 },
      { stat: { name: "special-defense" }, base_stat: 65 }
    ])
    stub_pokemon_species_response(1)

    pokemon = PokemonRepository.find_by_id(1)

    assert pokemon.stats.key?(:special_attack)
    assert pokemon.stats.key?(:special_defense)
  end

  private

  def stub_pokemon_list_response(limit: 20, offset: 0)
    response_body = {
      count: 1302,
      next: "https://pokeapi.co/api/v2/pokemon?offset=#{offset + limit}&limit=#{limit}",
      previous: offset.positive? ? "https://pokeapi.co/api/v2/pokemon?offset=#{offset - limit}&limit=#{limit}" : nil,
      results: (1..limit).map do |i|
        {
          name: "pokemon-#{i}",
          url: "https://pokeapi.co/api/v2/pokemon/#{i}/"
        }
      end
    }

    stub_request(:get, "#{BASE_URL}/pokemon?limit=#{limit}&offset=#{offset}")
      .to_return(
        status: 200,
        body: response_body.to_json,
        headers: { "Content-Type" => "application/json" }
      )
  end

  def stub_pokemon_detail_response(id_or_name, weight: 69, height: 7, stats: default_stats)
    response_body = {
      id: id_or_name.is_a?(Integer) ? id_or_name : 1,
      name: id_or_name.is_a?(Integer) ? "pokemon-#{id_or_name}" : id_or_name.to_s.downcase,
      weight: weight,
      height: height,
      types: [
        { type: { name: "grass" } },
        { type: { name: "poison" } }
      ],
      abilities: [
        { ability: { name: "overgrow" } },
        { ability: { name: "chlorophyll" } }
      ],
      stats: stats,
      sprites: {
        other: {
          "official-artwork": {
            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/#{id_or_name.is_a?(Integer) ? id_or_name : 1}.png"
          }
        }
      }
    }

    stub_request(:get, "#{BASE_URL}/pokemon/#{id_or_name}")
      .to_return(
        status: 200,
        body: response_body.to_json,
        headers: { "Content-Type" => "application/json" }
      )
  end

  def stub_pokemon_species_response(id, description: "A strange seed was planted on its back at birth.")
    response_body = {
      flavor_text_entries: [
        {
          flavor_text: description,
          language: { name: "en" }
        },
        {
          flavor_text: "Una semilla extraña fue plantada en su espalda al nacer.",
          language: { name: "es" }
        }
      ]
    }

    stub_request(:get, "#{BASE_URL}/pokemon-species/#{id}")
      .to_return(
        status: 200,
        body: response_body.to_json,
        headers: { "Content-Type" => "application/json" }
      )
  end

  def default_stats
    [
      { stat: { name: "hp" }, base_stat: 45 },
      { stat: { name: "attack" }, base_stat: 49 },
      { stat: { name: "defense" }, base_stat: 49 },
      { stat: { name: "special-attack" }, base_stat: 65 },
      { stat: { name: "special-defense" }, base_stat: 65 },
      { stat: { name: "speed" }, base_stat: 45 }
    ]
  end
end
