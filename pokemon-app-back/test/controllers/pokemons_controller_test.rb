require "test_helper"

class PokemonsControllerTest < ActionDispatch::IntegrationTest
  test "index returns paginated pokemon list when no search param" do
    stub_pokemon_list_response

    get pokemons_path, params: { page: 1, limit: 20 }

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    assert json_response.key?(:data)
    assert json_response.key?(:meta)
    assert_equal 20, json_response[:data].length
    assert_equal 1, json_response[:meta][:current_page]
  end

  test "index uses default page and limit when not provided" do
    stub_pokemon_list_response

    get pokemons_path

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    assert json_response.key?(:data)
    assert json_response.key?(:meta)
  end

  test "index handles custom page parameter" do
    stub_pokemon_list_response(offset: 20)

    get pokemons_path, params: { page: 2, limit: 20 }

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    assert_equal 2, json_response[:meta][:current_page]
  end

  test "index handles custom limit parameter" do
    stub_pokemon_list_response(limit: 10)

    get pokemons_path, params: { page: 1, limit: 10 }

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    assert_equal 10, json_response[:data].length
  end

  test "index calls search when search param is present" do
    stub_pokemon_detail_response("bulbasaur")
    stub_pokemon_species_response(1)

    get pokemons_path, params: { search: "bulbasaur" }

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    assert_equal 1, json_response[:data].length
    assert_equal "bulbasaur", json_response[:data].first[:name]
  end

  test "index search is case insensitive" do
    stub_pokemon_detail_response("BULBASAUR")
    stub_pokemon_species_response(1)

    get pokemons_path, params: { search: "BULBASAUR" }

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    assert_equal 1, json_response[:data].length
  end

  test "index returns empty result when search not found" do
    stub_request(:get, "https://pokeapi.co/api/v2/pokemon/invalid-pokemon")
      .to_return(status: 404, body: "")

    get pokemons_path, params: { search: "invalid-pokemon" }

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    assert_equal [], json_response[:data]
    assert_equal 0, json_response[:meta][:total_count]
  end

  test "index prioritizes search over pagination params" do
    stub_pokemon_detail_response("pikachu")
    stub_pokemon_species_response(25)

    get pokemons_path, params: { search: "pikachu", page: 2, limit: 10 }

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    # Should return search result, not paginated list
    assert_equal 1, json_response[:data].length
    assert_equal "pikachu", json_response[:data].first[:name]
  end

  test "show returns pokemon details when found" do
    stub_pokemon_detail_response(1)
    stub_pokemon_species_response(1)

    get pokemon_path(1)

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    assert_equal 1, json_response[:id]
    assert_equal "bulbasaur", json_response[:name]
    assert json_response.key?(:types)
    assert json_response.key?(:stats)
    assert json_response.key?(:abilities)
  end

  test "show returns 404 when pokemon not found" do
    stub_request(:get, "https://pokeapi.co/api/v2/pokemon/99999")
      .to_return(status: 404, body: "")

    get pokemon_path(99999)

    assert_response :not_found
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    assert_equal "Pokémon no encontrado", json_response[:error]
  end

  test "show handles string id parameter" do
    stub_pokemon_detail_response("bulbasaur")
    stub_pokemon_species_response(1)

    get pokemon_path("bulbasaur")

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    assert_equal "bulbasaur", json_response[:name]
  end

  test "show returns pokemon with all required attributes" do
    stub_pokemon_detail_response(1)
    stub_pokemon_species_response(1)

    get pokemon_path(1)

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    required_keys = [:id, :name, :number, :image, :types, :weight, :height, :abilities, :stats, :description]
    required_keys.each do |key|
      assert json_response.key?(key), "Missing key: #{key}"
    end
  end

  test "show handles pokemon with missing species data" do
    stub_pokemon_detail_response(1)
    stub_request(:get, "https://pokeapi.co/api/v2/pokemon-species/1")
      .to_return(status: 404, body: "")

    get pokemon_path(1)

    assert_response :success
    json_response = JSON.parse(response.body, symbolize_names: true)
    
    assert_equal "", json_response[:description]
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

    stub_request(:get, "https://pokeapi.co/api/v2/pokemon?limit=#{limit}&offset=#{offset}")
      .to_return(
        status: 200,
        body: response_body.to_json,
        headers: { "Content-Type" => "application/json" }
      )
  end

  def stub_pokemon_detail_response(id_or_name, weight: 69, height: 7, stats: default_stats)
    pokemon_id = id_or_name.is_a?(Integer) ? id_or_name : (id_or_name.to_s.downcase == "bulbasaur" ? 1 : 25)
    pokemon_name = id_or_name.is_a?(Integer) ? "pokemon-#{id_or_name}" : id_or_name.to_s.downcase

    response_body = {
      id: pokemon_id,
      name: pokemon_name,
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
            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/#{pokemon_id}.png"
          }
        }
      }
    }

    stub_request(:get, "https://pokeapi.co/api/v2/pokemon/#{id_or_name}")
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
        }
      ]
    }

    stub_request(:get, "https://pokeapi.co/api/v2/pokemon-species/#{id}")
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
