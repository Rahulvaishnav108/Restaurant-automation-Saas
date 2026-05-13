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

The backend currently exposes foundational endpoints for platform readiness and application wiring:

- `GET /health`
- `GET /ready`
- `GET /api/v1`
- `POST /api/v1/auth/login`
- `GET /api/v1/me`
- `GET /api/v1/admin/overview`

## Next Recommended Milestones

To move from strong scaffold to full product, the next high-value steps are:

1. Implement real auth flows with refresh tokens and secure cookies.
2. Add domain modules for orders, tables, reservations, billing, and inventory.
3. Add integration tests for middleware and route contracts.
4. Add database models, service layers, and tenant isolation rules.
5. Add observability tooling such as metrics and error reporting.
