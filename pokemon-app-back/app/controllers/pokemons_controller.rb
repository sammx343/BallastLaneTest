class PokemonsController < ApplicationController
  def index
    # Rails recibe params[:search] desde la URL
    if params[:search].present?
      # Si hay búsqueda, llamamos al método search
      result = PokemonRepository.search(params[:search])
    else
      # Si no hay búsqueda, manejamos la paginación normal
      page = params[:page] || 1
      limit = params[:limit] || 20
      result = PokemonRepository.find_all(page: page, per_page: limit)
    end

    render json: result
  end

  def show
    pokemon = PokemonRepository.find_by_id(params[:id])
    
    if pokemon
      render json: pokemon
    else
      render json: { error: 'Pokémon no encontrado' }, status: :not_found
    end
  end
end