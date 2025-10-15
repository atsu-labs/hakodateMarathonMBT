# hakodateMarathonMBT

A Single Page Application (SPA) built with Vite + Vue (frontend) and Hono (backend), deployable to Cloudflare Workers with D1 database.

## Project Structure

```
.
├── frontend/          # Vite + Vue frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   └── vite.config.js
├── backend/           # Hono backend for Cloudflare Workers
│   ├── src/
│   │   └── index.js
│   ├── database/
│   │   └── schema.sql
│   ├── public/        # Built frontend files (generated)
│   └── wrangler.toml
└── package.json       # Root workspace configuration
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a D1 database (requires Cloudflare account):
```bash
cd backend
npx wrangler d1 create hakodate-marathon-db
```

3. Update `backend/wrangler.toml` with your Cloudflare account ID and D1 database ID from the previous step.

4. Initialize the database with schema:
```bash
cd backend
npx wrangler d1 execute hakodate-marathon-db --file=./database/schema.sql
```

## Development

### Run backend development server (includes frontend proxy):
```bash
npm run dev
```

### Run frontend development server separately:
```bash
npm run dev:frontend
```

### Run backend development server separately:
```bash
npm run dev:backend
```

The application will be available at `http://localhost:8787` (backend) or `http://localhost:5173` (frontend dev server).

## Build

Build both frontend and backend:
```bash
npm run build
```

This will:
1. Build the Vue frontend with Vite
2. Output static files to `backend/public/`

## Deploy

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

This will build the frontend and deploy the entire application to Cloudflare Workers.

## Technologies Used

- **Frontend**: Vite, Vue 3
- **Backend**: Hono
- **Database**: Cloudflare D1 (SQLite)
- **Platform**: Cloudflare Workers
- **Package Manager**: npm with workspaces

## API Endpoints

- `GET /api/hello` - Returns a welcome message
- `GET /api/items` - Get all items from D1 database
- `POST /api/items` - Add a new item to D1 database (body: `{ "name": "item name" }`)

## Notes

- The frontend is served as static files from the `backend/public/` directory
- The backend handles both API routes (`/api/*`) and serves the SPA
- D1 database binding is configured in `wrangler.toml`