# Restaurant Automation SaaS

Restaurant Automation SaaS is a multi-tenant platform for running modern restaurant operations across customer ordering, kitchen execution, floor service, restaurant administration, and SaaS-level platform management.

## What Changed

This repo now has a stronger production-style baseline:

- npm workspaces for backend and frontend
- typed environment parsing with `zod`
- structured backend logging with request IDs
- centralized Express error handling and rate limiting
- JWT auth middleware and role guards
- health and readiness endpoints
- protected React routing with role-based app shells
- React Query and Socket.IO app bootstrapping
- CI, ESLint, Prettier, and TypeScript build validation

## Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- TanStack Query
- React Router
- Socket.IO client

### Backend

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT
- Zod
- Winston

## Monorepo Layout

```text
.
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- middleware/
|   |   `-- server.ts
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |-- auth/
|   |   |-- layouts/
|   |   |-- lib/
|   |   `-- routes/
|-- .github/workflows/ci.yml
`-- package.json
```

## Getting Started

### Install

```bash
npm install
```

### Run both apps

```bash
npm run dev
```

### Run one workspace

```bash
npm run dev --workspace backend
npm run dev --workspace frontend
```

### Backend local setup

The backend now expects a real MongoDB connection by default and fails fast when the database is unavailable.

Recommended local flow:

```bash
npm install
npm run seed --workspace backend
npm run dev --workspace backend
```

Backend verification flow:

```bash
npm run verify:phase1 --workspace backend
```

Important backend notes:

- MongoDB should be available at `mongodb://[REDACTED]` unless you override `MONGODB_URI`
- local seed data is applied on boot when `SEED_ON_STARTUP=true`
- use `ALLOW_NO_DB=true` only for intentional no-database debugging, not normal Phase 1 development
- `npm run verify:phase1 --workspace backend` spins up an in-memory MongoDB, runs the Postman collection, and executes a deeper seeded smoke suite

## Quality Scripts

```bash
npm run lint
npm run typecheck
npm run build
npm run format
```

## Environment Variables

### Backend

See [backend/.env.example](/c:/Users/rahul/OneDrive/Desktop/Restaurant%20Management%20SaaS/backend/.env.example).

Important keys:

- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN` or `CORS_ORIGINS`
- `MONGODB_URI`
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`

### Frontend

See [frontend/.env.example](/c:/Users/rahul/OneDrive/Desktop/Restaurant%20Management%20SaaS/frontend/.env.example).

Important keys:

- `VITE_APP_NAME`
- `VITE_ENV`
- `VITE_API_URL`
- `VITE_SOCKET_URL`

## API Baseline

The backend currently exposes a seeded Mongo-backed Phase 1 baseline for:

- `GET /health`
- `GET /ready`
- `GET /api/v1`
- `POST /api/v1/auth/login`
- `GET /api/v1/public/restaurants/:slug`
- `POST /api/v1/public/table-session/create`
- `GET /api/v1/customer/menu/items`
- `POST /api/v1/customer/orders`
- `GET /api/v1/kitchen/orders`
- `GET /api/v1/admin/restaurant/overview`
- `GET /api/v1/super-admin/platform/overview`

## Next Recommended Milestones

To move from strong scaffold to full product, the next high-value steps are:

1. Add integration tests for middleware and route contracts.
2. Expand Phase 1 persistence across the remaining admin, billing, and inventory domains.
3. Tighten response contracts and frontend integration around session-based customer flows.
4. Add observability tooling such as metrics and error reporting.
5. Add CI-backed seeded API smoke verification.
