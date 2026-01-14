# Pokemon App

A modern React application for browsing and exploring Pokémon data with authentication, search, and detailed views.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router v7** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Vitest** - Unit/Integration testing
- **Playwright** - E2E testing

## Features

- 🔐 User authentication with protected routes
- 🔍 Real-time search with debouncing
- 📄 Infinite scroll pagination
- 🎨 Responsive design (mobile-first)
- 📊 Detailed Pokémon information view
- 🔄 Navigation between Pokémon (previous/next)
- 🎯 Sorting options (by number or name)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── assets/          # Images and styles
├── components/      # React components
│   ├── Login/       # Login form
│   ├── Navbar/      # Navigation and search
│   ├── PokemonDetail/  # Pokémon detail view
│   └── PokemonList/    # Pokémon list with pagination
├── context/         # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API service layer
├── shared/          # Shared components
├── test/            # Test setup
└── types/           # TypeScript type definitions

tests/
├── integration/     # Integration tests (Vitest)
└── e2e/            # E2E tests (Playwright)
```

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Testing
- `npm test` - Run integration tests
- `npm run test:ui` - Open Vitest UI
- `npm run test:e2e` - Run E2E tests (headless)
- `npm run test:e2e:headed` - Run E2E tests (visible browser)
- `npm run test:e2e:ui` - Open Playwright UI

## Testing

The project includes comprehensive testing:

- **Integration Tests** (`tests/integration/`) - Component and user interaction tests using Vitest and React Testing Library
- **E2E Tests** (`tests/e2e/`) - Full user flow tests using Playwright

See `tests/README.md` for detailed testing documentation.

## Build

```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment.

## Key Implementation Details

- **Authentication**: Token-based auth stored in localStorage
- **Search**: 750ms debounce to reduce API calls
- **Pagination**: Infinite scroll using Intersection Observer
- **Routing**: Protected routes for authenticated users
- **State Management**: React Context for auth and search state

## License

Private project
