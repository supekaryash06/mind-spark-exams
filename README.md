# Online Examination System (Browser/Server Architecture)

This project now uses:
- **React frontend** (UI unchanged)
- **Java Spring Boot backend API**
- **MySQL database** for users, exams, questions, and submissions

## Architecture
- Browser (React) calls `/api/*`
- Vite dev proxy forwards `/api` to Java backend (`http://localhost:8081`)
- Spring Boot backend stores data in MySQL

## Features
- Registration/Login with BCrypt password hashing
- JWT-based authentication for protected APIs
- Exam listing per user
- Randomized question paper generation
- Automatic scoring and submission persistence

## Environment setup
Create `.env` in project root:

```env
API_PORT=8081
JWT_SECRET=replace_this_secret_with_long_random_string
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=online_exam
```

## Initialize database
```bash
mysql -h 127.0.0.1 -P 3306 -u root -p < backend-java/sql/schema.sql
```

## Run locally
```bash
npm install
npm run dev:api   # Spring Boot backend on :8081
npm run dev       # Frontend on :8080
```

Or both:
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
