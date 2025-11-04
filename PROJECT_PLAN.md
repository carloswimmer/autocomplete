# Autocomplete Component - Project Plan

## Project Overview
Build a reusable autocomplete component with backend API and infrastructure, based on the GreatFrontend system design requirements. The component will support customizable UI, caching, debouncing, and accessibility features.

## Architecture Components

### Frontend
- **Input Field UI**: Handles user input
- **Results UI (Popup)**: Displays search results
- **Controller**: Core logic (MVC pattern)
- **Cache**: Client-side result caching

### Backend
- **REST API**: Search endpoint with query processing
- **Database**: PostgreSQL for storing and querying searchable data

## Tech Stack

### Frontend
- **Framework**: Vanilla TypeScript (no framework)
- **Language**: TypeScript
- **Styling**: Vanilla CSS
- **Build Tool**: Vite (for TypeScript compilation and bundling)

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Search**: PostgreSQL full-text search (tsvector/tsquery) or ILIKE queries
- **Type Safety**: TypeScript interfaces and types

### Infrastructure
- **Docker**: Multi-container setup
- **Docker Compose**: Orchestrate frontend, backend, and database

## Project Structure

```
autocomplete/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Autocomplete.ts
│   │   │   ├── InputField.ts
│   │   │   └── ResultsList.ts
│   │   ├── utils/
│   │   │   ├── cache.ts
│   │   │   ├── api.ts
│   │   │   └── debounce.ts
│   │   ├── styles/
│   │   │   ├── autocomplete.css
│   │   │   └── index.css
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── main.ts
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── search.ts
│   │   ├── controllers/
│   │   │   └── searchController.ts
│   │   ├── services/
│   │   │   └── searchService.ts
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   ├── schema.ts
│   │   │   └── connection.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Implementation Phases

### Phase 1: Database & Backend Setup (Day 1)
- [x] Set up docker-compose.yml with PostgreSQL service
- [x] Configure networking between containers
- [ ] Add environment variables for database connection
- [ ] Create PostgreSQL database schema
- [ ] Create database migrations
- [ ] Set up database initialization scripts
- [ ] Set up database connection (pg or Prisma)
- [ ] Create Dockerfile for backend (with TypeScript compilation)
- [ ] Set up Express server with TypeScript
- [ ] Create search endpoint: `GET /api/search?query=xxx&limit=10`
- [ ] Implement PostgreSQL search queries (ILIKE or full-text search)
- [ ] Add CORS support
- [ ] Add TypeScript types and interfaces
- [ ] Add error handling

### Phase 2: Frontend Core (Day 1-2)
- [ ] Set up Vite project with TypeScript
- [ ] Create Dockerfile for frontend (with TypeScript support)
- [ ] Create HTML structure (index.html)
- [ ] Create CSS files for styling
- [ ] Create TypeScript interfaces and types
- [ ] Create Autocomplete class (DOM manipulation)
- [ ] Implement InputField component class
- [ ] Implement ResultsList component class
- [ ] Create Controller class for business logic
- [ ] Connect to backend API with typed requests

### Phase 3: Caching & Optimization (Day 2)
- [ ] Implement client-side cache (Map/Object)
- [ ] Add debounce utility function (300ms default)
- [ ] Handle race conditions (track latest query)
- [ ] Add minimum query length (3 chars)

### Phase 4: UX Enhancements (Day 3)
- [ ] Loading states (spinner)
- [ ] Error handling (retry button)
- [ ] Empty states
- [ ] Keyboard navigation (arrow keys, Enter, Escape)
- [ ] Mobile-friendly touch targets

### Phase 5: Accessibility (Day 3)
- [ ] ARIA attributes (combobox, listbox, option)
- [ ] Screen reader support
- [ ] Keyboard navigation
- [ ] Focus management

## API Specification

### Backend Endpoint
```
GET /api/search
Query Parameters:
  - query: string (required) - Search term
  - limit: number (optional, default: 10) - Max results
  - page: number (optional, default: 1) - Pagination

Response:
{
  "results": [
    {
      "id": "1",
      "title": "Result title",
      "description": "Result description",
      "image": "url" (optional)
    }
  ],
  "total": 100,
  "page": 1
}
```

### Component API (Frontend)
```typescript
interface AutocompleteOptions {
  apiUrl: string;
  container: HTMLElement;
  minQueryLength?: number;
  debounceMs?: number;
  maxResults?: number;
  onSelect: (result: SearchResult) => void;
  renderResult?: (result: SearchResult) => HTMLElement;
  className?: string;
}

// Usage
const autocomplete = new Autocomplete({
  apiUrl: '/api/search',
  container: document.getElementById('autocomplete-container')!,
  minQueryLength: 3,
  debounceMs: 300,
  maxResults: 10,
  onSelect: (result) => {
    console.log('Selected:', result);
  },
  renderResult: (result) => {
    // Optional custom rendering
    const div = document.createElement('div');
    div.textContent = result.title;
    return div;
  },
  className: 'custom-class'
});
```

## Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=autocomplete_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - autocomplete-network

  backend:
    build: ./backend
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/autocomplete_db
    volumes:
      - ./backend:/app
    depends_on:
      - postgres
    networks:
      - autocomplete-network

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:3001
    volumes:
      - ./frontend:/app
    depends_on:
      - backend
    networks:
      - autocomplete-network

volumes:
  postgres_data:

networks:
  autocomplete-network:
    driver: bridge
```

## Key Features to Implement

### Core Features
1. Real-time search as user types
2. Result caching (Map-based, keyed by query)
3. Debouncing (300ms default)
4. Race condition handling (only show latest query results)
5. Minimum query length (3 characters)

### Advanced Features (if time permits)
1. Virtualized list for large result sets
2. Fuzzy search support
3. Cache expiration/TTL
4. Offline mode (cache-only)
5. Result positioning (above/below input based on viewport)
6. Retry logic with exponential backoff

## Testing Strategy

### Backend
- Unit tests for search service
- Integration tests for API endpoints
- Test edge cases (empty query, special characters)

### Frontend
- Unit tests for Autocomplete class
- Integration tests for DOM interactions
- Accessibility tests (a11y)

## Data Model

### Database Schema
```sql
CREATE TABLE search_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  search_vector tsvector,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_title ON search_items USING gin(to_tsvector('english', title));
CREATE INDEX idx_search_description ON search_items USING gin(to_tsvector('english', description));
```

### TypeScript Types
```typescript
// Shared types
interface SearchResult {
  id: string;
  title: string;
  description?: string;
  image?: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
}

// Frontend types
interface CacheEntry {
  results: SearchResult[];
  timestamp: Date;
  query: string;
}

interface AutocompleteState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  selectedIndex: number;
}
```

## Development Commands

```bash
# Start all services
docker-compose up

# Start in development mode with hot reload
docker-compose up --build

# Run backend only
cd backend && npm start

# Run frontend only
cd frontend && npm start

# Run tests
npm test
```

## Next Steps
1. Initialize Node.js projects with TypeScript (frontend & backend)
2. Set up PostgreSQL database and migrations
3. Set up Docker configuration with PostgreSQL service
4. Implement backend API with database queries
5. Build frontend component with TypeScript
6. Integrate and test
7. Add optimizations and polish

## TypeScript Configuration

### Backend tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Frontend tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## CSS Styling Guide

### src/styles/autocomplete.css
```css
/* Autocomplete Container */
.autocomplete-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

/* Input Field */
.autocomplete-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.autocomplete-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Results Popup */
.autocomplete-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

/* Result Item */
.autocomplete-result-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.autocomplete-result-item:last-child {
  border-bottom: none;
}

.autocomplete-result-item:hover,
.autocomplete-result-item.selected {
  background-color: #f3f4f6;
}

.autocomplete-result-item:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

/* Result Content */
.autocomplete-result-title {
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
}

.autocomplete-result-description {
  font-size: 14px;
  color: #6b7280;
}

/* Loading State */
.autocomplete-loading {
  padding: 16px;
  text-align: center;
  color: #6b7280;
}

/* Error State */
.autocomplete-error {
  padding: 16px;
  color: #dc2626;
  text-align: center;
}

/* Empty State */
.autocomplete-empty {
  padding: 16px;
  text-align: center;
  color: #6b7280;
}
```

### src/styles/index.css
```css
/* Base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Import autocomplete styles */
@import './autocomplete.css';
```

