# form-submission-backend

A production-ready REST API for handling three types of form submissions — learner applications, instructor applications, and waitlist sign-ups. Sends confirmation emails via SMTP and exposes a JWT-protected admin dashboard.

---

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

---

## Setup

```bash
# 1. Navigate to the project
cd form-submission-backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in all required values
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm test` | Run test suite |

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/learners` | None | Submit a learner application |
| POST | `/api/instructors` | None | Submit an instructor application |
| POST | `/api/waitlist` | None | Join the waitlist |
| POST | `/api/admin/login` | None | Admin login, returns JWT |
| GET | `/api/admin/dashboard` | Bearer JWT | Submission counts summary |
| GET | `/api/admin/learners` | Bearer JWT | Paginated learner applications |
| GET | `/api/admin/instructors` | Bearer JWT | Paginated instructor applications |
| GET | `/api/admin/waitlist` | Bearer JWT | Paginated waitlist entries |

---

## Sample Requests

### POST /api/learners
```bash
curl -X POST http://localhost:3000/api/learners \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com"
  }'
```

### POST /api/instructors
```bash
curl -X POST http://localhost:3000/api/instructors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com"
  }'
```

### POST /api/waitlist
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

### POST /api/admin/login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourapp.com",
    "password": "changeme123"
  }'
```

### GET /api/admin/dashboard
```bash
curl http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer <your_jwt_token>"
```

### GET /api/admin/learners
```bash
curl "http://localhost:3000/api/admin/learners?page=1&limit=10&email=search" \
  -H "Authorization: Bearer <your_jwt_token>"
```

### GET /api/admin/instructors
```bash
curl http://localhost:3000/api/admin/instructors \
  -H "Authorization: Bearer <your_jwt_token>"
```

### GET /api/admin/waitlist
```bash
curl http://localhost:3000/api/admin/waitlist \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | HTTP server port (default: `3000`) |
| `NODE_ENV` | No | `development` or `production` |
| `APP_NAME` | No | Application display name |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `SMTP_HOST` | Yes | SMTP server hostname |
| `SMTP_PORT` | Yes | SMTP port (`587` for TLS, `465` for SSL) |
| `SMTP_USER` | Yes | SMTP login username |
| `SMTP_PASS` | Yes | SMTP password or app-specific password |
| `SMTP_FROM_NAME` | Yes | Sender display name |
| `SMTP_FROM_EMAIL` | Yes | Sender email address |
| `JWT_SECRET` | Yes | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | No | JWT expiry duration (default: `7d`) |
| `ADMIN_EMAIL` | Yes | Default admin account email |
| `ADMIN_NAME` | Yes | Default admin display name |
| `ADMIN_PASSWORD` | Yes | Default admin password |
| `CORS_ORIGIN` | No | Allowed CORS origin(s), comma-separated |
| `RATE_LIMIT_MAX` | No | Max requests per window per IP (default: `100`) |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window in ms (default: `900000`) |

---

## Admin Seeding

On first startup, the server automatically creates an admin account using the `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` values from your `.env`. If an admin with that email already exists, seeding is skipped. Change the default password immediately after first login.
