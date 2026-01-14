class PokemonRepository
  BASE_URL = 'https://pokeapi.co/api/v2'

  def self.find_all(page: 1, per_page: 20)
    # Calculamos el offset para la PokeAPI
    offset = (page.to_i - 1) * per_page.to_i
    
    response = Faraday.get("#{BASE_URL}/pokemon?limit=#{per_page}&offset=#{offset}")
    return { data: [], meta: {} } unless response.success?

    json_data = JSON.parse(response.body, symbolize_names: true)
    
    # La PokeAPI en la lista solo da nombre y URL. 
    # Para cumplir con el diseño (foto y número), mapeamos los resultados.
    pokemons = json_data[:results].map do |poke|
      id = poke[:url].split('/').last.to_i
      Pokemon.new(
        id: id,
        name: poke[:name],
        number: id,
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/#{id}.png"
      )
    end

    {
      data: pokemons,
      meta: {
        total_count: json_data[:count],
        total_pages: (json_data[:count] / per_page.to_f).ceil,
        current_page: page.to_i
      }
    }
  end

  def self.search(name)
    return find_all if name.blank?
    
    response = Faraday.get("#{BASE_URL}/pokemon/#{name.downcase}")
    if response.success?
      pokemon = find_by_id(name.downcase)
      { data: [pokemon], meta: { total_count: 1, total_pages: 1, current_page: 1 } }
    else
      # Si la PokeAPI devuelve 404, mandamos la lista vacía
      { data: [], meta: { total_count: 0, total_pages: 0, current_page: 1 } }
    end
  end

  def self.find_by_id(id)
    # 1. Petición de datos básicos y stats
    poke_res = Faraday.get("#{BASE_URL}/pokemon/#{id}")
    return nil unless poke_res.success?
    data = JSON.parse(poke_res.body, symbolize_names: true)

    # 2. Petición de la especie para obtener la descripción (flavor text)
    species_res = Faraday.get("#{BASE_URL}/pokemon-species/#{id}")
    description = ""
    if species_res.success?
      species_data = JSON.parse(species_res.body, symbolize_names: true)
      # Buscamos la primera descripción en español o inglés
      entry = species_data[:flavor_text_entries].find { |f| f[:language][:name] == 'en' }
      description = entry[:flavor_text].gsub("\n", " ").gsub("\f", " ") if entry
    end

    # 3. Mapeo de estadísticas
    # Transformamos el array de stats en un Hash fácil de usar: { hp: 45, atk: 49... }
    stats_map = {}
    data[:stats].each do |s|
      name = s[:stat][:name].gsub('-', '_')
      stats_map[name] = s[:base_stat]
    end

    Pokemon.new(
      id: data[:id],
      name: data[:name],
      number: data[:id],
      image: data[:sprites][:other][:"official-artwork"][:front_default],
      types: data[:types].map { |t| t[:type][:name] },
      weight: data[:weight] / 10.0, # Convertir a kg
      height: data[:height] / 10.0, # Convertir a metros
      abilities: data[:abilities].map { |a| a[:ability][:name] },
      stats: stats_map,
      description: description
    )
  end
end