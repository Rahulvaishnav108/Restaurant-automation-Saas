# Phase 1: Foundation + Auth + Users

## Component 1: Config Layer
- [x] `config/env.ts` — Zod-validated env
- [x] `config/db.ts` — MongoDB connection
- [x] `config/logger.ts` — Winston logger
- [x] `config/initDB.ts` — Collection initialization

## Component 2: Types & Constants
- [ ] `types/express.d.ts` — Augment Express Request
- [ ] `types/api.types.ts` — API response types
- [ ] `types/auth.types.ts` — Auth-related types
- [ ] `constants/roles.ts` — Role enum
- [ ] `constants/statuses.ts` — Status enums
- [ ] `constants/errors.ts` — Error codes
- [ ] `constants/events.ts` — Socket event names
- [ ] `constants/permissions.ts` — Role permissions

## Component 3: Utils
- [ ] `utils/AppError.ts` — Custom error class
- [ ] `utils/asyncHandler.ts` — Async route wrapper
- [ ] `utils/response.ts` — Standard response helpers
- [ ] `utils/crypto.ts` — Hash, compare, generate tokens
- [ ] `utils/pagination.ts` — Pagination helpers
- [ ] `utils/slugify.ts` — URL slug generator
- [ ] `utils/permissions.ts` — Ownership check
- [ ] `utils/date.ts` — Date utilities
- [ ] `utils/constants.ts` — Shared constants

## Component 4: Middleware
- [ ] `middleware/errorHandler.ts` — Central error handler
- [ ] `middleware/requireAuth.ts` — JWT auth middleware
- [ ] `middleware/roleGuard.ts` — Role-based access
- [ ] `middleware/validate.ts` — Zod validation middleware
- [ ] `middleware/rateLimiters.ts` — Rate limit configs
- [ ] `middleware/requestId.ts` — Request ID generator

## Component 5: Shared Services
- [ ] `services/jwt.service.ts` — Token sign/verify
- [ ] `services/mail.service.ts` — Email sending
- [ ] `services/otp.service.ts` — OTP generation

## Component 6: Users Module
- [ ] `modules/users/users.model.ts` — Mongoose schema + model
- [ ] `modules/users/users.schema.ts` — Zod validation schemas
- [ ] `modules/users/users.service.ts` — Business logic
- [ ] `modules/users/users.controller.ts` — Route handlers
- [ ] `modules/users/users.routes.ts` — Route definitions

## Component 7: Auth Module
- [ ] `modules/auth/auth.schema.ts` — Zod validation
- [ ] `modules/auth/auth.service.ts` — Auth business logic
- [ ] `modules/auth/auth.controller.ts` — Route handlers
- [ ] `modules/auth/auth.routes.ts` — Route definitions

## Component 8: App & Server Wiring
- [ ] `app.ts` — Full middleware stack + route mounts
- [ ] `server.ts` — Final bootstrap
- [ ] Install `cookie-parser` dependency

## Verification
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Server starts cleanly
- [ ] Register → Login → Me → Refresh → Logout flow works
