UH:
As a Pokémon Trainer, I want to access a Pokémon Trainer Portal, to search, list, and analyze detailed Pokémon characteristics, So that I can access accurate information from the official database through a controlled environment.

Epic I: Authentication & Route Guarding
Focus: Security, session persistence, and access control.

User Stories:

As a user, I want a secure login form to validate my credentials (admin/admin) before accessing the data.
As a user, I want my session to persist across page refreshes using local storage or cookies.
As a system, I want to protect private routes and redirect unauthenticated users to the login page.

Epic II: Backend Services & API Integration
Focus: The middleware architecture and PokéAPI proxy.

User Stories:

As a developer, I want a lightweight backend to handle authentication logic and proxy requests to the PokéAPI.
As a system, I want a /pokemons endpoint that serves paginated data to optimize frontend performance.
As a system, I want a /pokemons/{id} endpoint that aggregates abilities, moves, and forms for a specific entry.

Epic III: Pokémon Discovery (Main Feed)
Focus: List management, sorting, and UI responsiveness.

User Stories:

As a user, I want to see a paginated list of Pokémon displaying their photo, name, and ID number.
As a user, I want to sort the list by name and ID to easily find specific entries.
As a user, I want a search bar to filter the Pokémon list in real-time.

Epic IV: Technical Specifications (Detail View)
Focus: Data visualization and SEO.

User Stories:

As a user, I want to click on a Pokémon to view its full technical profile (Abilities, moves, and forms).
As a developer, I want the detail pages to be SEO-friendly and fully responsive across mobile and desktop devices.
