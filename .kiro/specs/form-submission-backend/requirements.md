# Requirements Document

## Introduction

A production-ready backend for a form-submission system that handles three distinct form types: Learner Applications, Instructor Applications, and Waitlist Signups. The backend exposes REST API endpoints for submitting and retrieving form data, persists records to MongoDB, and sends confirmation emails via SMTP after each successful submission. A dedicated admin system allows an authenticated admin user to log in with credentials, receive a JWT, and access protected admin endpoints for viewing submission summaries and records. The system is built with Node.js, TypeScript, Express.js, Mongoose, and Nodemailer, and is designed to be clean, extensible, and secure.

## Glossary

- **System**: The form-submission backend application
- **API**: The Express.js REST API exposed by the System
- **LearnerApplication**: A MongoDB document representing a submitted learner application form
- **InstructorApplication**: A MongoDB document representing a submitted instructor application form
- **WaitlistEntry**: A MongoDB document representing a submitted waitlist signup
- **Admin**: An authenticated user stored in MongoDB with email, hashed password, name, and role, who can access protected admin endpoints
- **AdminUser**: The MongoDB document representing an Admin account
- **JWT**: A JSON Web Token issued to an Admin upon successful login, used to authenticate subsequent admin requests
- **AuthMiddleware**: The Express middleware that validates the Bearer JWT on protected admin routes
- **Seeder**: The startup routine that creates the default AdminUser in MongoDB if no admin exists
- **Mailer**: The Nodemailer-based email service responsible for sending confirmation emails
- **Validator**: The Zod-based request validation middleware
- **ErrorHandler**: The centralized Express error-handling middleware
- **RateLimiter**: The express-rate-limit middleware applied to POST endpoints
- **AppError**: A typed error class used throughout the System to represent operational errors with HTTP status codes

---

## Requirements

### Requirement 1: Learner Application Submission

**User Story:** As a prospective learner, I want to submit my application through a single POST request, so that my information is saved and I receive a confirmation email.

#### Acceptance Criteria

1. WHEN a POST request is made to `/api/learners` with a valid payload, THE System SHALL validate the request body against the learner schema and save a new LearnerApplication document to MongoDB.
2. WHEN a LearnerApplication is successfully saved, THE System SHALL return a JSON response with shape `{ success: true, message: "...", data: <saved document> }` and HTTP status 201.
3. WHEN a LearnerApplication is successfully saved, THE Mailer SHALL send a confirmation email to the submitted email address with subject "We've received your learner application".
4. IF the Mailer fails to send the confirmation email after a successful save, THEN THE System SHALL log the failure and still return the HTTP 201 success response.
5. IF the POST request body fails schema validation, THEN THE Validator SHALL return a JSON response with shape `{ success: false, message: "Validation error", errors: <field errors> }` and HTTP status 400.
6. IF a database error occurs during save, THEN THE ErrorHandler SHALL return a JSON response with shape `{ success: false, message: "..." }` and HTTP status 500.

---

### Requirement 2: Instructor Application Submission

**User Story:** As a prospective instructor, I want to submit my application through a single POST request, so that my information is saved and I receive a confirmation email.

#### Acceptance Criteria

1. WHEN a POST request is made to `/api/instructors` with a valid payload, THE System SHALL validate the request body against the instructor schema and save a new InstructorApplication document to MongoDB.
2. WHEN an InstructorApplication is successfully saved, THE System SHALL return a JSON response with shape `{ success: true, message: "...", data: <saved document> }` and HTTP status 201.
3. WHEN an InstructorApplication is successfully saved, THE Mailer SHALL send a confirmation email to the submitted email address with subject "We've received your instructor application".
4. IF the Mailer fails to send the confirmation email after a successful save, THEN THE System SHALL log the failure and still return the HTTP 201 success response.
5. IF the POST request body fails schema validation, THEN THE Validator SHALL return a JSON response with shape `{ success: false, message: "Validation error", errors: <field errors> }` and HTTP status 400.
6. IF a database error occurs during save, THEN THE ErrorHandler SHALL return a JSON response with shape `{ success: false, message: "..." }` and HTTP status 500.

---

### Requirement 3: Waitlist Signup Submission

**User Story:** As a prospective user, I want to join the waitlist by submitting my email, so that I am notified when the program becomes available.

#### Acceptance Criteria

1. WHEN a POST request is made to `/api/waitlist` with a valid payload containing `email` and optional `source`, THE System SHALL validate the request body against the waitlist schema and save a new WaitlistEntry document to MongoDB.
2. WHEN a WaitlistEntry is successfully saved, THE System SHALL return a JSON response with shape `{ success: true, message: "...", data: <saved document> }` and HTTP status 201.
3. WHEN a WaitlistEntry is successfully saved, THE Mailer SHALL send a confirmation email to the submitted email address with subject "You've been added to the waitlist".
4. IF the Mailer fails to send the confirmation email after a successful save, THEN THE System SHALL log the failure and still return the HTTP 201 success response.
5. IF the POST request body fails schema validation, THEN THE Validator SHALL return a JSON response with shape `{ success: false, message: "Validation error", errors: <field errors> }` and HTTP status 400.
6. IF a database error occurs during save, THEN THE ErrorHandler SHALL return a JSON response with shape `{ success: false, message: "..." }` and HTTP status 500.

---

### Requirement 4: Admin User Model and Seeding

**User Story:** As a system operator, I want a default admin account to be available at startup, so that the admin can log in without manual database setup.

#### Acceptance Criteria

1. THE System SHALL define an AdminUser Mongoose model with the fields: `email` (unique, required), `password` (hashed, required), `name` (required), and `role` (required, default `"admin"`).
2. WHEN the application starts, THE Seeder SHALL check whether any AdminUser document exists in MongoDB.
3. IF no AdminUser document exists, THEN THE Seeder SHALL create one AdminUser using the `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` environment variables, storing the password as a bcrypt hash.
4. THE Seeder SHALL log a message confirming whether the admin was seeded or already existed.
5. IF the `ADMIN_EMAIL`, `ADMIN_NAME`, or `ADMIN_PASSWORD` environment variables are missing at startup, THEN THE System SHALL log a descriptive error and exit the process with a non-zero exit code.

---

### Requirement 5: Admin Login

**User Story:** As an admin, I want to log in with my email and password, so that I receive a JWT to authenticate subsequent requests.

#### Acceptance Criteria

1. WHEN a POST request is made to `/api/admin/login` with a valid JSON body containing `email` and `password`, THE System SHALL look up the AdminUser by email in MongoDB.
2. WHEN the provided password matches the stored bcrypt hash, THE System SHALL return a JSON response with shape `{ success: true, token: "<JWT>", admin: { name, email, role } }` and HTTP status 200.
3. THE System SHALL sign the JWT using the `JWT_SECRET` environment variable with an expiry defined by the `JWT_EXPIRES_IN` environment variable.
4. IF the email does not match any AdminUser, THEN THE System SHALL return HTTP status 401 with `{ success: false, message: "Invalid credentials" }`.
5. IF the password does not match the stored hash, THEN THE System SHALL return HTTP status 401 with `{ success: false, message: "Invalid credentials" }`.
6. IF the request body is missing `email` or `password`, THEN THE Validator SHALL return HTTP status 400 with `{ success: false, message: "Validation error", errors: <field errors> }`.

---

### Requirement 6: JWT Admin Authentication Middleware

**User Story:** As a system operator, I want all admin data endpoints to require a valid JWT, so that only authenticated admins can access submission records.

#### Acceptance Criteria

1. THE AuthMiddleware SHALL extract the Bearer token from the `Authorization` header on all `/api/admin/*` routes except `/api/admin/login`.
2. WHEN a valid, non-expired JWT is present, THE AuthMiddleware SHALL attach the decoded admin identity to the request context and allow the request to proceed.
3. IF the `Authorization` header is absent or does not use the Bearer scheme, THEN THE AuthMiddleware SHALL return HTTP status 401 with `{ success: false, message: "Unauthorized" }`.
4. IF the JWT is invalid or expired, THEN THE AuthMiddleware SHALL return HTTP status 401 with `{ success: false, message: "Unauthorized" }`.

---

### Requirement 7: Admin Dashboard Summary

**User Story:** As an admin, I want to see a summary of all submissions, so that I can quickly understand the current state of applications.

#### Acceptance Criteria

1. WHEN an authenticated GET request is made to `/api/admin/dashboard`, THE System SHALL return a JSON response with shape `{ success: true, data: { totalLearners, totalInstructors, totalWaitlist, recentLearners, recentInstructors, recentWaitlist } }` and HTTP status 200.
2. THE System SHALL compute `totalLearners`, `totalInstructors`, and `totalWaitlist` as the total document counts for each respective collection.
3. THE System SHALL include the 5 most recently created documents from each collection as `recentLearners`, `recentInstructors`, and `recentWaitlist`, sorted by `createdAt` descending.
4. IF the request does not include a valid JWT, THEN THE AuthMiddleware SHALL return HTTP status 401 before the handler is reached.

---

### Requirement 8: Admin Learner Records Endpoint

**User Story:** As an admin, I want to fetch all learner application records with pagination and search, so that I can review submitted applications.

#### Acceptance Criteria

1. WHEN an authenticated GET request is made to `/api/admin/learners`, THE System SHALL return all LearnerApplication documents sorted by `createdAt` descending, along with a total count, in the shape `{ success: true, data: { records, total, page, limit } }`.
2. WHEN the request includes `page` and `limit` query parameters, THE System SHALL return the corresponding paginated subset of LearnerApplication documents.
3. WHEN the request includes an `email` or `name` query parameter, THE System SHALL return only LearnerApplication documents whose email or name fields match the search term (case-insensitive).
4. IF the request does not include a valid JWT, THEN THE AuthMiddleware SHALL return HTTP status 401 before the handler is reached.

---

### Requirement 9: Admin Instructor Records Endpoint

**User Story:** As an admin, I want to fetch all instructor application records with pagination and search, so that I can review submitted applications.

#### Acceptance Criteria

1. WHEN an authenticated GET request is made to `/api/admin/instructors`, THE System SHALL return all InstructorApplication documents sorted by `createdAt` descending, along with a total count, in the shape `{ success: true, data: { records, total, page, limit } }`.
2. WHEN the request includes `page` and `limit` query parameters, THE System SHALL return the corresponding paginated subset of InstructorApplication documents.
3. WHEN the request includes an `email` or `name` query parameter, THE System SHALL return only InstructorApplication documents whose email or name fields match the search term (case-insensitive).
4. IF the request does not include a valid JWT, THEN THE AuthMiddleware SHALL return HTTP status 401 before the handler is reached.

---

### Requirement 10: Admin Waitlist Records Endpoint

**User Story:** As an admin, I want to fetch all waitlist entries with pagination and search, so that I can see who has signed up.

#### Acceptance Criteria

1. WHEN an authenticated GET request is made to `/api/admin/waitlist`, THE System SHALL return all WaitlistEntry documents sorted by `createdAt` descending, along with a total count, in the shape `{ success: true, data: { records, total, page, limit } }`.
2. WHEN the request includes `page` and `limit` query parameters, THE System SHALL return the corresponding paginated subset of WaitlistEntry documents.
3. WHEN the request includes an `email` query parameter, THE System SHALL return only WaitlistEntry documents whose email field matches the search term (case-insensitive).
4. IF the request does not include a valid JWT, THEN THE AuthMiddleware SHALL return HTTP status 401 before the handler is reached.

---

### Requirement 11: Confirmation Email Content

**User Story:** As a form submitter, I want to receive a well-formatted confirmation email, so that I know my submission was received.

#### Acceptance Criteria

1. WHEN THE Mailer sends a confirmation email, THE Mailer SHALL address the recipient by first name if the submitted payload includes a `firstName` field, otherwise THE Mailer SHALL use a generic greeting.
2. THE Mailer SHALL send all confirmation emails using an HTML template that is mobile-friendly and references the form type in the body.
3. THE Mailer SHALL use the `SMTP_FROM_NAME` and `SMTP_FROM_EMAIL` environment variables as the sender name and address.
4. THE Mailer SHALL use the `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` environment variables to configure the SMTP transport.

---

### Requirement 12: Request Validation

**User Story:** As a developer, I want all incoming request bodies to be strictly validated, so that only well-formed data is persisted to the database.

#### Acceptance Criteria

1. THE Validator SHALL validate all POST request bodies using Zod schemas defined per form type before the request reaches the controller.
2. IF a required field is missing from the request body, THEN THE Validator SHALL include that field's name and a descriptive message in the `errors` array of the 400 response.
3. IF an email field contains an invalid email format, THEN THE Validator SHALL reject the request with HTTP status 400.
4. THE Validator SHALL accept the `modules`, `certs`, `teachModules`, and `timeSlots` fields as arrays of strings when present.

---

### Requirement 13: Security Middleware

**User Story:** As a system operator, I want the API to apply standard security hardening, so that it is resistant to common web attacks.

#### Acceptance Criteria

1. THE System SHALL apply the `helmet` middleware to set secure HTTP response headers on all routes.
2. THE System SHALL apply `cors` middleware, configuring allowed origins from environment variables.
3. THE RateLimiter SHALL limit each IP address to a configurable maximum number of POST requests per time window, returning HTTP status 429 when the limit is exceeded.
4. THE System SHALL enforce a request body size limit of 1MB on all routes.
5. IF the `NODE_ENV` environment variable is set to `production`, THEN THE ErrorHandler SHALL omit stack traces from error responses.

---

### Requirement 14: Environment Configuration

**User Story:** As a developer, I want all secrets and configuration values to be loaded from environment variables, so that no sensitive data is hardcoded in source files.

#### Acceptance Criteria

1. THE System SHALL load all configuration from environment variables using `dotenv` at application startup.
2. THE System SHALL require the following environment variables to be present at startup: `PORT`, `MONGODB_URI`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD`.
3. IF any required environment variable is missing at startup, THEN THE System SHALL log a descriptive error message and exit the process with a non-zero exit code.
4. THE System SHALL provide a `.env.example` file listing all required and optional environment variables with placeholder values and inline comments.

---

### Requirement 15: Database Connectivity

**User Story:** As a developer, I want the application to connect to MongoDB reliably, so that form data is persisted correctly.

#### Acceptance Criteria

1. WHEN the application starts, THE System SHALL establish a connection to MongoDB using the `MONGODB_URI` environment variable.
2. IF the MongoDB connection fails at startup, THEN THE System SHALL log the error and exit the process with a non-zero exit code.
3. THE System SHALL define Mongoose models for LearnerApplication, InstructorApplication, WaitlistEntry, and AdminUser, each with `createdAt` and `updatedAt` timestamps enabled and an index on the `email` field.

---

### Requirement 16: Centralized Error Handling and Logging

**User Story:** As a developer, I want all unhandled errors and 404s to be caught and returned in a consistent format, so that clients always receive a predictable response shape.

#### Acceptance Criteria

1. THE ErrorHandler SHALL catch all errors passed via `next(error)` and return a JSON response with shape `{ success: false, message: "..." }` and the appropriate HTTP status code.
2. WHEN a request is made to a route that does not exist, THE System SHALL return HTTP status 404 with `{ success: false, message: "Route not found" }`.
3. THE System SHALL use `morgan` middleware to log HTTP requests in development mode.
4. IF `NODE_ENV` is `production`, THEN THE System SHALL suppress `morgan` request logging or use a minimal log format that excludes sensitive headers.

---

### Requirement 17: Round-Trip Data Integrity

**User Story:** As a developer, I want submitted form data to be stored and retrieved without loss or mutation, so that admins see exactly what was submitted.

#### Acceptance Criteria

1. FOR ALL valid LearnerApplication payloads, THE System SHALL store every submitted field and return the same field values when the record is retrieved via the admin GET endpoint.
2. FOR ALL valid InstructorApplication payloads, THE System SHALL store every submitted field and return the same field values when the record is retrieved via the admin GET endpoint.
3. FOR ALL valid WaitlistEntry payloads, THE System SHALL store every submitted field and return the same field values when the record is retrieved via the admin GET endpoint.
