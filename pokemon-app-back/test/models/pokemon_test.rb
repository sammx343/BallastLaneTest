require "test_helper"

class PokemonTest < ActiveSupport::TestCase
  test "initializes with all attributes" do
    pokemon = Pokemon.new(
      id: 1,
      name: "bulbasaur",
      number: 1,
      image: "https://example.com/bulbasaur.png",
      types: ["grass", "poison"],
      weight: 6.9,
      height: 0.7,
      abilities: ["overgrow", "chlorophyll"],
      stats: { hp: 45, attack: 49 },
      description: "A strange seed was planted on its back."
    )

    assert_equal 1, pokemon.id
    assert_equal "bulbasaur", pokemon.name
    assert_equal 1, pokemon.number
    assert_equal "https://example.com/bulbasaur.png", pokemon.image
    assert_equal ["grass", "poison"], pokemon.types
    assert_equal 6.9, pokemon.weight
    assert_equal 0.7, pokemon.height
    assert_equal ["overgrow", "chlorophyll"], pokemon.abilities
    assert_equal({ hp: 45, attack: 49 }, pokemon.stats)
    assert_equal "A strange seed was planted on its back.", pokemon.description
  end

  test "initializes with empty hash when no attributes provided" do
    pokemon = Pokemon.new

    assert_nil pokemon.id
    assert_nil pokemon.name
    assert_nil pokemon.number
    assert_nil pokemon.image
    assert_equal [], pokemon.types
    assert_nil pokemon.weight
    assert_nil pokemon.height
    assert_equal [], pokemon.abilities
    assert_equal({}, pokemon.stats)
    assert_nil pokemon.description
  end

  test "initializes with partial attributes" do
    pokemon = Pokemon.new(id: 1, name: "pikachu")

    assert_equal 1, pokemon.id
    assert_equal "pikachu", pokemon.name
    assert_nil pokemon.number
    assert_equal [], pokemon.types
    assert_equal [], pokemon.abilities
    assert_equal({}, pokemon.stats)
  end

  test "types defaults to empty array when not provided" do
    pokemon = Pokemon.new(id: 1, name: "pikachu")

    assert_equal [], pokemon.types
    assert pokemon.types.is_a?(Array)
  end

  test "abilities defaults to empty array when not provided" do
    pokemon = Pokemon.new(id: 1, name: "pikachu")

    assert_equal [], pokemon.abilities
    assert pokemon.abilities.is_a?(Array)
  end

  test "stats defaults to empty hash when not provided" do
    pokemon = Pokemon.new(id: 1, name: "pikachu")

    assert_equal({}, pokemon.stats)
    assert pokemon.stats.is_a?(Hash)
  end

  test "allows setting attributes after initialization" do
    pokemon = Pokemon.new
    pokemon.id = 25
    pokemon.name = "pikachu"
    pokemon.types = ["electric"]

    assert_equal 25, pokemon.id
    assert_equal "pikachu", pokemon.name
    assert_equal ["electric"], pokemon.types
  end

  test "handles numeric string ids" do
    pokemon = Pokemon.new(id: "1", name: "bulbasaur")

    assert_equal "1", pokemon.id
    assert_equal "bulbasaur", pokemon.name
  end

  test "handles complex stats hash" do
    stats = {
      hp: 45,
      attack: 49,
      defense: 49,
      special_attack: 65,
      special_defense: 65,
      speed: 45
    }

    pokemon = Pokemon.new(id: 1, stats: stats)

    assert_equal stats, pokemon.stats
    assert_equal 45, pokemon.stats[:hp]
    assert_equal 65, pokemon.stats[:special_attack]
  end

  test "handles multiple types" do
    pokemon = Pokemon.new(
      id: 1,
      types: ["grass", "poison", "flying"]
    )

    assert_equal 3, pokemon.types.length
    assert_includes pokemon.types, "grass"
    assert_includes pokemon.types, "poison"
    assert_includes pokemon.types, "flying"
  end

  test "handles multiple abilities" do
    pokemon = Pokemon.new(
      id: 1,
      abilities: ["overgrow", "chlorophyll", "thick-fat"]
    )

    assert_equal 3, pokemon.abilities.length
    assert_includes pokemon.abilities, "overgrow"
  end

  test "handles nil values for optional attributes" do
    pokemon = Pokemon.new(
      id: 1,
      name: "bulbasaur",
      types: nil,
      abilities: nil,
      stats: nil
    )

    assert_equal 1, pokemon.id
    assert_equal "bulbasaur", pokemon.name
    assert_nil pokemon.types
    assert_nil pokemon.abilities
    assert_nil pokemon.stats
  end

  test "handles empty string description" do
    pokemon = Pokemon.new(id: 1, description: "")

    assert_equal "", pokemon.description
  end

  test "handles long description text" do
    long_description = "A" * 500
    pokemon = Pokemon.new(id: 1, description: long_description)

    assert_equal long_description, pokemon.description
    assert_equal 500, pokemon.description.length
  end

  test "handles float values for weight and height" do
    pokemon = Pokemon.new(
      id: 1,
      weight: 6.9,
      height: 0.7
    )

    assert_equal 6.9, pokemon.weight
    assert_equal 0.7, pokemon.height
    assert pokemon.weight.is_a?(Float)
    assert pokemon.height.is_a?(Float)
  end

  test "handles integer values for weight and height" do
    pokemon = Pokemon.new(
      id: 1,
      weight: 10,
      height: 1
    )

    assert_equal 10, pokemon.weight
    assert_equal 1, pokemon.height
  end
end
