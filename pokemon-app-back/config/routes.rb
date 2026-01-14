Rails.application.routes.draw do
  post '/login', to: 'auth#login'
  
  # Rutas RESTful para pokemons
  resources :pokemons, only: [:index, :show]
end
