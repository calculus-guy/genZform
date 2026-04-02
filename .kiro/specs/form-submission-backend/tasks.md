# Implementation Plan: form-submission-backend

## Overview

Incremental implementation of a production-ready TypeScript/Express REST API with MongoDB persistence, Nodemailer email delivery, JWT-protected admin endpoints, and comprehensive property-based + unit/integration tests using fast-check, Jest/Vitest, and mongodb-memory-server.

## Tasks

- [x] 1. Project scaffolding
  - Create `package.json` with all required dependencies: express, mongoose, nodemailer, zod, jsonwebtoken, bcryptjs, helmet, cors, morgan, express-rate-limit, dotenv; devDependencies: typescript, ts-node, @types/*, jest/vitest, supertest, mongodb-memory-server, fast-check
  - Create `tsconfig.json` targeting ES2020, strict mode, outDir `dist/`, rootDir `src/`
  - Create the full `src/` folder structure as defined in the design (config, controllers, routes, models, services, validations, middleware, templates, utils)
  - Create `.env.example` listing all required and optional env vars with placeholder values and inline comments
  - _Requirements: 14.4_

- [ ] 2. Environment configuration module
  - [x] 2.1 Implement `src/config/env.ts`
    - Load `.env` via dotenv
    - Validate all 13 required env vars are present; if any are missing, log a descriptive error and call `process.exit(1)`
    - Export a typed `env` config object
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ]* 2.2 Write unit tests for env validation
    - Test that each missing required env var causes process exit with non-zero code
    - _Requirements: 14.3_

- [ ] 3. MongoDB connection
  - [x] 3.1 Implement `src/config/db.ts`
    - Export `connectDB()` that connects via `MONGODB_URI`; on failure logs error and calls `process.exit(1)`
    - _Requirements: 15.1, 15.2_

- [ ] 4. Utility classes
  - [x] 4.1 Implement `src/utils/AppError.ts`
    - `AppError extends Error` with `statusCode`, `isOperational`, correct prototype chain
    - _Requirements: 16.1_

  - [x] 4.2 Implement `src/utils/asyncHandler.ts`
    - Wraps async route handlers, forwards rejected promises to `next(err)`
    - _Requirements: 16.1_

  - [x] 4.3 Implement `src/utils/apiResponse.ts`
    - Helper functions `successResponse` and `errorResponse` returning the standard `{ success, message, data }` / `{ success, message, errors }` shapes
    - _Requirements: 1.2, 2.2, 3.2, 16.1_

- [ ] 5. Mongoose models
  - [x] 5.1 Implement `src/models/LearnerApplication.model.ts`
    - Fields: firstName, lastName, email (unique index), phone?, country?, modules?, certs?, message?; timestamps: true
    - _Requirements: 15.3, 1.1_

  - [x] 5.2 Implement `src/models/InstructorApplication.model.ts`
    - Fields: firstName, lastName, email (unique index), phone?, country?, teachModules?, timeSlots?, experience?, message?; timestamps: true
    - _Requirements: 15.3, 2.1_

  - [x] 5.3 Implement `src/models/WaitlistEntry.model.ts`
    - Fields: email (unique index), source?; timestamps: true
    - _Requirements: 15.3, 3.1_

  - [x] 5.4 Implement `src/models/AdminUser.model.ts`
    - Fields: email (unique index), password (required), name (required), role (required, default "admin"); timestamps: true; never return password in responses (use `select: false` or transform)
    - _Requirements: 15.3, 4.1_

  - [ ]* 5.5 Write unit tests for model structure
    - Verify each model document has `createdAt`, `updatedAt`, and email index
    - _Requirements: 15.3_

- [ ] 6. Admin seeder
  - [x] 6.1 Implement `src/utils/seeder.ts`
    - Check if any AdminUser exists; if not, create one from `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` env vars with bcrypt-hashed password; log outcome either way
    - _Requirements: 4.2, 4.3, 4.4_

  - [ ]* 6.2 Write unit tests for seeder
    - Empty DB → admin created with bcrypt hash
    - Existing admin → no duplicate created
    - _Requirements: 4.2, 4.3_

- [ ] 7. Zod validation schemas
  - [x] 7.1 Implement `src/validations/learner.schema.ts`
    - Required: firstName, lastName, email (valid format); optional: phone, country, modules (string[]), certs (string[]), message
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x] 7.2 Implement `src/validations/instructor.schema.ts`
    - Required: firstName, lastName, email (valid format); optional: phone, country, teachModules (string[]), timeSlots (string[]), experience, message
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x] 7.3 Implement `src/validations/waitlist.schema.ts`
    - Required: email (valid format); optional: source
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 7.4 Implement `src/validations/admin.schema.ts`
    - Required: email (valid format), password (non-empty string)
    - _Requirements: 5.6_

- [ ] 8. Validation middleware factory
  - [x] 8.1 Implement `src/validations/validate.middleware.ts`
    - Generic `validate(schema: ZodSchema): RequestHandler`
    - On ZodError: call `next(new AppError(..., 400))` with structured `errors` array `[{ field, message }]`
    - _Requirements: 12.1, 12.2, 1.5, 2.5, 3.5_

- [ ] 9. Email template
  - [x] 9.1 Implement `src/templates/confirmation.html.ts`
    - Export a function `confirmationTemplate({ firstName?, formType })` returning an HTML string
    - Use firstName in greeting when present; fall back to generic greeting (no "undefined" placeholder)
    - Reference the formType in the body ("learner application", "instructor application", "waitlist")
    - Mobile-friendly inline styles
    - _Requirements: 11.1, 11.2_

  - [ ]* 9.2 Write property test for email template greeting (Property 12)
    - **Property 12: Email template greeting uses firstName when present**
    - **Validates: Requirements 11.1**

  - [ ]* 9.3 Write property test for email template form type reference (Property 13)
    - **Property 13: Email template references the form type**
    - **Validates: Requirements 11.2**

- [ ] 10. Email service
  - [x] 10.1 Implement `src/services/email.service.ts`
    - Configure Nodemailer SMTP transport from `SMTP_*` env vars
    - Export `sendConfirmation(options: SendConfirmationOptions): Promise<void>`
    - Render `confirmationTemplate`, send HTML email; errors are caught and logged, never re-thrown
    - _Requirements: 11.3, 11.4, 1.4, 2.4, 3.4_

- [ ] 11. Learner feature
  - [x] 11.1 Implement `src/services/learner.service.ts`
    - `createLearner(data)`: save LearnerApplication, call `sendConfirmation` in try/catch (log on failure), return saved doc
    - _Requirements: 1.1, 1.3, 1.4_

  - [x] 11.2 Implement `src/controllers/learner.controller.ts`
    - `submitLearner`: call service, return 201 success response
    - _Requirements: 1.2_

  - [x] 11.3 Implement `src/routes/learner.routes.ts`
    - `POST /` → `validate(learnerSchema)` → `submitLearner`
    - _Requirements: 1.1, 1.5_

  - [ ]* 11.4 Write property test for valid learner submission saves document (Property 1 — learner)
    - **Property 1: Valid form submission saves a document (round-trip) — learner**
    - **Validates: Requirements 1.1, 17.1**

  - [ ]* 11.5 Write property test for learner submission returns 201 with correct shape (Property 2 — learner)
    - **Property 2: Successful form submission returns 201 with correct response shape — learner**
    - **Validates: Requirements 1.2**

  - [ ]* 11.6 Write property test for learner submission triggers confirmation email (Property 3 — learner)
    - **Property 3: Successful form submission triggers confirmation email — learner**
    - **Validates: Requirements 1.3**

  - [ ]* 11.7 Write property test for mailer failure does not affect 201 response (Property 4 — learner)
    - **Property 4: Mailer failure does not affect HTTP 201 response — learner**
    - **Validates: Requirements 1.4**

  - [ ]* 11.8 Write property test for invalid learner payload returns 400 (Property 5 — learner)
    - **Property 5: Invalid form payload returns 400 with structured errors — learner**
    - **Validates: Requirements 1.5, 12.1, 12.2, 12.3**

  - [ ]* 11.9 Write property test for DB error returns 500 (Property 6 — learner)
    - **Property 6: Database error returns 500 with error response shape — learner**
    - **Validates: Requirements 1.6**

- [ ] 12. Instructor feature
  - [x] 12.1 Implement `src/services/instructor.service.ts`
    - `createInstructor(data)`: save InstructorApplication, call `sendConfirmation` in try/catch, return saved doc
    - _Requirements: 2.1, 2.3, 2.4_

  - [x] 12.2 Implement `src/controllers/instructor.controller.ts`
    - `submitInstructor`: call service, return 201 success response
    - _Requirements: 2.2_

  - [x] 12.3 Implement `src/routes/instructor.routes.ts`
    - `POST /` → `validate(instructorSchema)` → `submitInstructor`
    - _Requirements: 2.1, 2.5_

  - [ ]* 12.4 Write property tests for instructor submission (Properties 1–6 — instructor)
    - **Property 1 (instructor): round-trip save — Validates: Requirements 2.1, 17.2**
    - **Property 2 (instructor): 201 + shape — Validates: Requirements 2.2**
    - **Property 3 (instructor): email triggered — Validates: Requirements 2.3**
    - **Property 4 (instructor): mailer failure safe — Validates: Requirements 2.4**
    - **Property 5 (instructor): invalid payload 400 — Validates: Requirements 2.5, 12.1, 12.2, 12.3, 12.4**
    - **Property 6 (instructor): DB error 500 — Validates: Requirements 2.6**

- [ ] 13. Waitlist feature
  - [x] 13.1 Implement `src/services/waitlist.service.ts`
    - `createWaitlistEntry(data)`: save WaitlistEntry, call `sendConfirmation` in try/catch, return saved doc
    - _Requirements: 3.1, 3.3, 3.4_

  - [x] 13.2 Implement `src/controllers/waitlist.controller.ts`
    - `submitWaitlist`: call service, return 201 success response
    - _Requirements: 3.2_

  - [x] 13.3 Implement `src/routes/waitlist.routes.ts`
    - `POST /` → `validate(waitlistSchema)` → `submitWaitlist`
    - _Requirements: 3.1, 3.5_

  - [ ]* 13.4 Write property tests for waitlist submission (Properties 1–6 — waitlist)
    - **Property 1 (waitlist): round-trip save — Validates: Requirements 3.1, 17.3**
    - **Property 2 (waitlist): 201 + shape — Validates: Requirements 3.2**
    - **Property 3 (waitlist): email triggered — Validates: Requirements 3.3**
    - **Property 4 (waitlist): mailer failure safe — Validates: Requirements 3.4**
    - **Property 5 (waitlist): invalid payload 400 — Validates: Requirements 3.5, 12.1, 12.2, 12.3**
    - **Property 6 (waitlist): DB error 500 — Validates: Requirements 3.6**

- [ ] 14. Checkpoint — core form submission complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. JWT auth middleware
  - [x] 15.1 Implement `src/middleware/auth.middleware.ts`
    - Extract Bearer token from `Authorization` header
    - Verify with `JWT_SECRET`; attach decoded payload to `req.admin`
    - On missing/malformed header or invalid/expired token: `next(new AppError("Unauthorized", 401))`
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 15.2 Write property test for protected routes reject invalid JWT (Property 7)
    - **Property 7: Protected routes reject absent or invalid JWT**
    - **Validates: Requirements 6.1, 6.3, 6.4**

  - [ ]* 15.3 Write property test for valid JWT allows request to proceed (Property 8)
    - **Property 8: Valid JWT allows request to proceed**
    - **Validates: Requirements 6.2**

  - [ ]* 15.4 Write unit tests for JWT auth middleware
    - Valid JWT → decoded identity on req.admin
    - Expired JWT → 401
    - Missing header → 401
    - Wrong scheme → 401
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 16. Admin service
  - [x] 16.1 Implement `src/services/admin.service.ts`
    - `login(email, password)`: find AdminUser by email (select password), compare bcrypt hash, sign JWT with `JWT_SECRET`/`JWT_EXPIRES_IN`, return `{ token, admin: { name, email, role } }`; throw `AppError(401)` on mismatch
    - `getDashboard()`: parallel count queries + top-5 recent queries for all three collections
    - `getRecords(model, query: PaginatedQuery)`: build case-insensitive regex filter, skip/limit pagination, sort by createdAt desc, return `PaginatedResult`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 10.1, 10.2, 10.3_

  - [ ]* 16.2 Write unit tests for admin login
    - Correct credentials → JWT returned
    - Wrong password → 401
    - Unknown email → 401
    - Missing fields → 400 (via validator)
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 5.6_

  - [ ]* 16.3 Write unit tests for JWT content
    - Decoded token contains correct name, email, role fields
    - _Requirements: 5.3_

  - [ ]* 16.4 Write property test for dashboard total counts match collection sizes (Property 9)
    - **Property 9: Dashboard total counts match actual collection sizes**
    - **Validates: Requirements 7.2**

  - [ ]* 16.5 Write property test for dashboard recent records are top-5 descending (Property 10)
    - **Property 10: Dashboard recent records are the 5 most recent, sorted descending**
    - **Validates: Requirements 7.3**

  - [ ]* 16.6 Write property test for admin list endpoints pagination and search (Property 11)
    - **Property 11: Admin list endpoints return paginated, sorted, searchable results**
    - **Validates: Requirements 8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 10.1, 10.2, 10.3**

- [ ] 17. Admin controller and routes
  - [x] 17.1 Implement `src/controllers/admin.controller.ts`
    - `adminLogin`: call `admin.service.login`, return 200 with `{ success, token, admin }`
    - `getDashboard`: call `admin.service.getDashboard`, return 200 success response
    - `getLearners`, `getInstructors`, `getWaitlist`: call `admin.service.getRecords` with respective model and parsed query params, return 200 success response
    - _Requirements: 5.2, 7.1, 8.1, 9.1, 10.1_

  - [x] 17.2 Implement `src/routes/admin.routes.ts`
    - `POST /login` → `validate(adminSchema)` → `adminLogin`
    - `GET /dashboard` → `authMiddleware` → `getDashboard`
    - `GET /learners` → `authMiddleware` → `getLearners`
    - `GET /instructors` → `authMiddleware` → `getInstructors`
    - `GET /waitlist` → `authMiddleware` → `getWaitlist`
    - _Requirements: 5.1, 6.1, 7.4, 8.4, 9.4, 10.4_

- [ ] 18. Error handler and 404 middleware
  - [x] 18.1 Implement `src/middleware/errorHandler.ts`
    - Handle AppError, Mongoose ValidationError, CastError, duplicate key (11000), JWT errors, and generic 500
    - In `NODE_ENV=production` omit stack traces
    - Return `{ success: false, message }` with correct status code
    - _Requirements: 16.1, 13.5_

  - [x] 18.2 Implement `src/middleware/notFound.ts`
    - Catch-all route returning 404 `{ success: false, message: "Route not found" }`
    - _Requirements: 16.2_

  - [ ]* 18.3 Write property test for error handler returns consistent error shape (Property 16)
    - **Property 16: Error handler returns consistent error shape**
    - **Validates: Requirements 16.1, 13.5**

  - [ ]* 18.4 Write unit tests for error handler and 404
    - Unknown route → 404 with correct shape
    - Production mode → no stack trace in response
    - _Requirements: 16.1, 16.2, 13.5_

- [ ] 19. Route index
  - [x] 19.1 Implement `src/routes/index.ts`
    - Mount `/api/learners`, `/api/instructors`, `/api/waitlist`, `/api/admin` routers
    - _Requirements: 1.1, 2.1, 3.1, 5.1_

- [ ] 20. Express app setup
  - [x] 20.1 Implement `src/app.ts`
    - Apply in order: morgan (dev only), helmet, cors (from `CORS_ORIGIN` env), body-limit (1MB), rate-limiter on POST routes (from `RATE_LIMIT_MAX`/`RATE_LIMIT_WINDOW_MS` env vars with defaults 100/900000)
    - Mount route index
    - Register notFound handler, then errorHandler (last)
    - Export `app` without calling `listen`
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 16.3, 16.4_

  - [ ]* 20.2 Write unit tests for security middleware
    - Response includes helmet headers (e.g., `X-Content-Type-Options`)
    - Response includes correct CORS headers
    - _Requirements: 13.1, 13.2_

  - [ ]* 20.3 Write property test for rate limiter returns 429 after limit exceeded (Property 14)
    - **Property 14: Rate limiter returns 429 after limit is exceeded**
    - **Validates: Requirements 13.3**

  - [ ]* 20.4 Write property test for request body over 1MB is rejected (Property 15)
    - **Property 15: Request body over 1MB is rejected**
    - **Validates: Requirements 13.4**

- [ ] 21. Server entry point
  - [x] 21.1 Implement `src/server.ts`
    - Call `validateEnv()`, `connectDB()`, `seedAdmin()` in sequence; on any failure log and `process.exit(1)`; then call `app.listen(env.PORT)`
    - _Requirements: 14.1, 14.3, 15.1, 4.2, 4.5_

- [ ] 22. Checkpoint — full integration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 23. README
  - Write `README.md` with: prerequisites, environment setup (copy `.env.example`), install + build + start commands, sample curl requests for all 8 endpoints, sample Postman collection JSON snippet
  - _Requirements: 14.4_

- [ ] 24. Final checkpoint — all tests green
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use fast-check with a minimum of 100 iterations per property; tag each test with `// Feature: form-submission-backend, Property N: <property_text>`
- Use `mongodb-memory-server` for all tests; mock Nodemailer transport to avoid real SMTP calls
- Use `supertest` for HTTP-level integration tests
- All 16 design properties are covered by property-based test sub-tasks (11.4–11.9, 12.4, 13.4, 15.2–15.3, 16.4–16.6, 18.3, 20.3–20.4, 9.2–9.3)
