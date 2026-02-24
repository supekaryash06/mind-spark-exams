# Online Examination System (Browser/Server Architecture)

This project now includes:
- **React frontend** (existing UI kept intact)
- **Node.js + Express backend API**
- **MySQL database** for users, exams, questions, and submissions

It supports registration/login, fetching exams, randomized question sets, and secure submission scoring.

## Architecture

- Browser (React app) calls `/api/*`
- Vite dev proxy forwards `/api` to the backend (`http://localhost:4000`)
- Backend persists data in MySQL

## Backend features aligned to your abstract

- Effective and quick online exam flow (auto score computation)
- Resource-saving browser/server model
- Question-paper auto generation (randomized question selection via SQL `ORDER BY RAND()` within each exam)
- Basic security controls:
  - password hashing (`bcryptjs`)
  - token-based authentication (`JWT`)

## Database setup (MySQL)

1. Create a `.env` file in project root:

```env
API_PORT=4000
JWT_SECRET=replace_this_secret
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=online_exam
```

2. Initialize schema and seed data:

```bash
mysql -h 127.0.0.1 -P 3306 -u root -p < server/sql/schema.sql
```

## Run locally

```bash
npm install
npm run dev:api      # backend on :4000
npm run dev          # frontend on :8080
```

Or run both:

```bash
npm run dev:full
```

## API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/exams` (auth required)
- `GET /api/exams/:id/questions` (auth required)
- `POST /api/exams/:id/submissions` (auth required)
- `GET /api/health`

## Notes

- Frontend styling/components were not redesigned; only data wiring was added.
- You can extend this backend with role-based admin features, audit logging, proctoring hooks, and encryption-at-rest for higher security.
