# Restaurant Automation SaaS — Backend Implementation Plan

## Current State

Your project scaffolding is **well-organized** — the 25 module folders, middleware, config, utils, services, jobs, types, and constants directories all exist and match the PRD's architecture. However, virtually **all files are empty** (0 bytes) except:
- `users.schema.ts` — has a Mongoose schema + model (126 lines)
- `server.ts` — basic server startup (11 lines)
- `app.ts` — minimal Express app with health check (18 lines)
- `package.json` — dependencies defined
- `.env` / `.env.example` — comprehensive env vars
- `Dockerfile` + `docker-compose.yml` — Docker setup ready

> [!IMPORTANT]
> This is a **massive** project (~200+ API endpoints across 25 modules). Building it all at once would cause architecture chaos. Following the PRD's recommended order, this plan breaks work into **phases** that can each be independently tested.

## User Review Required

> [!IMPORTANT]
> **Naming Convention Mismatch**: Your `users.schema.ts` currently contains both the Mongoose schema AND the model definition. Per `instruction.md`, Zod validation schemas should be in `*.schema.ts` and Mongoose models in `*.model.ts`. This plan separates them — the Mongoose schema goes in `users.model.ts` and Zod request validation goes in `users.schema.ts`. **Is this acceptable?**

> [!WARNING]
> **Security**: Your `.env` has `JWT_SECRET` and `JWT_REFRESH_SECRET` set to the **same value**. The `instruction.md` explicitly requires them to be **different** (each ≥64 chars). This will be enforced in the Zod env validation.

> [!IMPORTANT]
> **Express Version**: Your `package.json` uses Express 4 (`^4.19.2`). The `instruction.md` references Express 5 in prompts but Express 4 is the stable production choice. **Should we stay on Express 4 (recommended) or upgrade to Express 5?**

> [!IMPORTANT]
> **Refresh Token Strategy**: `instruction.md` says store refresh token as bcrypt hash in DB. Your current `users.schema.ts` has `refreshToken` as a plain string field. This plan will refactor to hash the refresh token before storage.

## Open Questions

> [!IMPORTANT]
> 1. **Phase Scope**: Should I implement **Phase 1 only** (Foundation + Auth + Users) first, then return for your review before proceeding? This is recommended to avoid wasted work.
> 2. **OTP Provider**: The PRD mentions OTP auth. What OTP delivery mechanism do you want? (SMS via Twilio/MSG91? Email-only for now? Mock for development?)
> 3. **Sentry**: Your `SENTRY_DSN` is empty. Should we skip Sentry integration for now and add it later, or set it up with a placeholder?
> 4. **MongoDB `database` folder**: You have `src/database/` in addition to `src/config/db.ts`. Should `database/` hold seed scripts, or should we ignore it and use `config/db.ts` only?

---

## Proposed Changes

The implementation follows the PRD's recommended build order:

| Phase | Scope | Estimated Files |
|-------|-------|-----------------|
| **Phase 1** | Foundation + Auth + Users | ~30 files |
| **Phase 2** | Restaurants + Tables + QR Sessions | ~15 files |
| **Phase 3** | Menu + Cart + Orders | ~15 files |
| **Phase 4** | Kitchen + Staff flows | ~10 files |
| **Phase 5** | Billing + Payments + Cleaning | ~10 files |
| **Phase 6** | Offers + Loyalty + Feedback | ~10 files |
| **Phase 7** | Analytics + Notifications + Inventory | ~10 files |
| **Phase 8** | Super Admin + Subscriptions + Audit Logs | ~10 files |

---

## Phase 1: Foundation + Auth + Users (First Deliverable)

This phase establishes every shared layer the entire backend depends on.

---

### Component 1: Config Layer

#### [MODIFY] [env.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/config/env.ts)
- Zod schema validating ALL `.env` variables with `process.exit(1)` on failure
- Covers: PORT, NODE_ENV, MONGODB_URI, JWT secrets, cookie settings, CORS, rate limits, SMTP, QR session, uploads, logging, feature flags, super admin credentials
- Exports typed `env` object used throughout the app

#### [MODIFY] [db.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/config/db.ts)
- `connectDB()` function using `mongoose.connect(env.MONGODB_URI)`
- Connection event listeners (connected, error, disconnected) with Winston logging
- Graceful shutdown handler (`SIGINT`/`SIGTERM`)

#### [MODIFY] [logger.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/config/logger.ts)
- Winston logger with console transport (dev) + file transport (prod)
- Log level from env
- Redaction filter: never log passwords, tokens, API keys
- Request context (requestId) in log metadata

---

### Component 2: Types & Constants

#### [MODIFY] [express.d.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/types/express.d.ts)
- Augment `Express.Request` with `user` (IUser payload) and `requestId`

#### [MODIFY] [api.types.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/types/api.types.ts)
- `ApiSuccessResponse<T>`, `ApiErrorResponse`, `PaginatedResponse<T>` interfaces
- Standard pagination query type

#### [MODIFY] [auth.types.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/types/auth.types.ts)
- `JwtPayload` interface, `TokenPair` type, `LoginRequest`, `RegisterRequest`

#### [MODIFY] [roles.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/constants/roles.ts)
- `UserRole` enum (CUSTOMER, SERVICE_STAFF, KITCHEN_STAFF, CLEANING_STAFF, RESTAURANT_ADMIN, SUPER_ADMIN)

#### [MODIFY] [statuses.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/constants/statuses.ts)
- `UserStatus`, `OrderStatus`, `TableStatus`, `SessionStatus`, `CleaningStatus` enums

#### [MODIFY] [errors.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/constants/errors.ts)
- All error codes from PRD: `VALIDATION_ERROR`, `UNAUTHORIZED`, `TOKEN_EXPIRED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `TABLE_SESSION_EXPIRED`, etc.

#### [MODIFY] [events.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/constants/events.ts)
- Socket.io event name constants from PRD Section 19

#### [MODIFY] [permissions.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/constants/permissions.ts)
- Role-to-permission mapping matrix

---

### Component 3: Utils

#### [MODIFY] [AppError.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/utils/AppError.ts)
- Custom `AppError` class extending `Error` with `statusCode`, `code`, `isOperational`, optional `fields`

#### [MODIFY] [asyncHandler.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/utils/asyncHandler.ts)
- Wraps async route handlers to catch errors and forward to `next()`

#### [MODIFY] [response.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/utils/response.ts)
- `sendSuccess(res, data, statusCode)` and `sendPaginated(res, data, pagination)` helpers
- Enforces consistent `{ success: true, data }` shape

#### [MODIFY] [crypto.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/utils/crypto.ts)
- `hashToken()` — bcrypt hash for refresh tokens
- `safeCompare()` — `crypto.timingSafeEqual()` wrapper
- `generateSecureToken(length)` — `crypto.randomBytes` wrapper

#### [MODIFY] [pagination.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/utils/pagination.ts)
- `parsePagination(query)` — extracts `page`, `limit`, calculates `skip`
- `buildPaginationMeta(total, page, limit)` — returns `{ total, page, limit, totalPages }`

#### [MODIFY] [slugify.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/utils/slugify.ts)
- URL-safe slug generator for restaurant names

#### [MODIFY] [permissions.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/utils/permissions.ts)
- `assertOwnership()` helper — always returns 404 (never 403) for wrong user/restaurant

#### [MODIFY] [date.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/utils/date.ts)
- Date utility helpers (session expiry calculations, etc.)

#### [MODIFY] [constants.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/utils/constants.ts)
- Shared magic numbers/strings (cookie names, header names, etc.)

---

### Component 4: Middleware

#### [MODIFY] [errorHandler.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/middleware/errorHandler.ts)
- Central error handler → `{ success: false, error: { code, message, fields? } }`
- Handles `AppError`, Mongoose `ValidationError`, Zod errors, `CastError`, duplicate key (11000)
- Never leaks stack traces in production

#### [MODIFY] [requireAuth.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/middleware/requireAuth.ts)
- Extract JWT from `Authorization: Bearer` header
- Verify with `jsonwebtoken`
- Attach decoded user to `req.user`
- Return appropriate error codes: `UNAUTHORIZED`, `TOKEN_EXPIRED`, `TOKEN_INVALID`

#### [MODIFY] [roleGuard.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/middleware/roleGuard.ts)
- Factory function `roleGuard(...allowedRoles: UserRole[])`
- Returns `FORBIDDEN` if `req.user.role` not in allowed list

#### [MODIFY] [validate.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/middleware/validate.ts)
- Factory accepting Zod schema for `body`, `query`, `params`
- Returns 400 `VALIDATION_ERROR` with `fields` on failure

#### [MODIFY] [rateLimiters.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/middleware/rateLimiters.ts)
- `globalLimiter` — from env (default 100/15min)
- `authLimiter` — strict (default 10/15min), skip successful requests
- `publicLimiter` — for public endpoints

#### [MODIFY] [requestId.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/middleware/requestId.ts)
- Generate UUID per request, attach to `req.requestId` and response header `X-Request-Id`

---

### Component 5: Services (shared)

#### [MODIFY] [jwt.service.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/services/jwt.service.ts)
- `signAccessToken(payload)` — 15min
- `signRefreshToken(payload)` — 7d
- `verifyAccessToken(token)`, `verifyRefreshToken(token)`

#### [MODIFY] [mail.service.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/services/mail.service.ts)
- Nodemailer transporter from env SMTP config
- `sendEmail(to, subject, html)` wrapper
- Template-based emails (welcome, OTP, password reset)

#### [MODIFY] [otp.service.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/services/otp.service.ts)
- Generate 6-digit OTP, store hashed with TTL in DB
- Verify OTP with rate limit tracking

---

### Component 6: Users Module (Refactored)

#### [MODIFY] [users.schema.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/modules/users/users.schema.ts)
- **Refactored**: Move Mongoose schema to `users.model.ts`
- This file becomes **Zod validation schemas** only: `registerSchema`, `loginSchema`, `updateProfileSchema`, etc.

#### [MODIFY] [users.model.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/modules/users/users.model.ts)
- Mongoose schema + model (moved from current `users.schema.ts`)
- Add `pre('save')` hook for password hashing with bcryptjs
- Add `comparePassword()` instance method
- Add `failedLoginAttempts` + `lockUntil` fields for account lockout
- Hash refresh token before storage
- Add `isDeleted` + `deletedAt` fields (soft delete)

#### [MODIFY] [users.service.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/modules/users/users.service.ts)
- `createUser()`, `findByEmail()`, `findByMobile()`, `findById()`, `updateProfile()`, `softDelete()`
- All queries filter `isDeleted: false`

#### [MODIFY] [users.controller.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/modules/users/users.controller.ts)
- `getMe` — GET /auth/me
- `updateProfile` — PATCH /users/me
- `deleteAccount` — DELETE /users/me (with confirmation text)

#### [MODIFY] [users.routes.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/modules/users/users.routes.ts)
- Protected routes using `requireAuth` + `validate`

---

### Component 7: Auth Module

#### [NEW] [auth.schema.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/modules/auth/auth.schema.ts)
- Zod schemas: `registerSchema`, `loginSchema`, `refreshSchema`, `forgotPasswordSchema`, `resetPasswordSchema`, `requestOtpSchema`, `verifyOtpSchema`

#### [NEW] [auth.service.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/modules/auth/auth.service.ts)
- `register()` — create user, hash password, generate tokens
- `login()` — verify credentials, check lockout, generate tokens, set refresh cookie
- `refresh()` — rotate refresh token (issue new pair, revoke old, detect reuse)
- `logout()` — clear refresh token from DB + cookie
- `forgotPassword()` — generate reset token, send email
- `resetPassword()` — verify reset token, update password
- `requestOtp()` — generate + send OTP
- `verifyOtp()` — validate OTP
- Account lockout logic: 5 failed attempts → 15 min lock

#### [NEW] [auth.controller.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/modules/auth/auth.controller.ts)
- Route handlers wrapping auth.service methods
- Set HttpOnly cookie for refresh token
- Return access token in JSON response body

#### [NEW] [auth.routes.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/modules/auth/auth.routes.ts)
- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- `GET /auth/me`, `POST /auth/forgot-password`, `POST /auth/reset-password`
- `POST /auth/request-otp`, `POST /auth/verify-otp`
- `GET /auth/sessions`, `DELETE /auth/sessions/:sessionId`
- Apply `authLimiter` to all auth routes

---

### Component 8: App & Server Overhaul

#### [MODIFY] [app.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/app.ts)
- Full middleware stack in correct order per `instruction.md`:
  1. Request ID
  2. Security headers (helmet)
  3. CORS (explicit origins from env)
  4. Body parsing (`express.json({ limit: '10kb' })`)
  5. Cookie parser
  6. MongoDB sanitize
  7. Morgan (dev only)
  8. Global rate limiter on `/api`
  9. Auth rate limiter on `/api/v1/auth`
  10. Route mounts (`/api/v1`)
  11. Health + readiness endpoints (outside rate limits)
  12. Central error handler (last)

#### [MODIFY] [server.ts](file:///d:/Codes/project-restaurant-automation-saas/backend/src/server.ts)
- Load env validation first (crash on bad config)
- Connect to MongoDB
- Start cron jobs
- Initialize Socket.io
- Listen on PORT

---

### Dependencies to Add

We need `cookie-parser` for HttpOnly cookie handling (not currently in `package.json`). The `instruction.md` mandates this for refresh tokens.

---

## Verification Plan

### Automated Tests
1. `npx tsc --noEmit` — TypeScript compilation with zero errors
2. Start server: `npm run dev` — verify clean startup with env validation + DB connection
3. Test via Postman/curl:
   - `GET /health` → `200`
   - `GET /ready` → `200` (DB connected)
   - `POST /api/v1/auth/register` → `201` with access token
   - `POST /api/v1/auth/login` → `200` with access token + refresh cookie
   - `GET /api/v1/auth/me` → `200` with user profile
   - `POST /api/v1/auth/refresh` → `200` with new access token
   - `POST /api/v1/auth/logout` → `200` with cookie cleared
   - Test 400/401/429 error paths

### Manual Verification
- Verify refresh token is HttpOnly cookie (check browser DevTools)
- Verify rate limiting triggers after threshold
- Verify account lockout after 5 failed login attempts
