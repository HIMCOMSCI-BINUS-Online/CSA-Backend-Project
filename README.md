# CSA Todo Backend

Backend project Express.js dengan arsitektur **Controller-Service-Repository** untuk kebutuhan bootcamp.

## Fitur
- Sign up: email, username, password
- Login: email, password
- JWT auth
- Todo CRUD
- Soft delete + restore
- Filter by status, title, due date range, MTD, today, overdue
- Sort by title, due date, priority, status, createdAt, updatedAt
- Dashboard summary

## Stack
- Express.js
- MySQL (raw SQL with mysql2)
- JWT
- bcryptjs
- Zod

## Struktur Folder
```bash
src/
├── config/
├── controllers/
├── db/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── utils/
└── app.js
```

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Base URL
```bash
http://localhost:3000/api/v1
```

## Auth Endpoints
### Sign Up
```http
POST /auth/signup
```
```json
{
  "email": "user@gmail.com",
  "username": "user_1",
  "password": "Password123"
}
```

### Login
```http
POST /auth/login
```
```json
{
  "email": "user@gmail.com",
  "password": "Password123"
}
```

### Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

## Todo Endpoints
### Create Todo
```http
POST /todos
Authorization: Bearer <token>
```
```json
{
  "title": "Belajar Express",
  "description": "Bikin CSR architecture",
  "dueDate": "2026-06-12",
  "priority": "high",
  "status": "pending"
}
```

### List Todo
```http
GET /todos?status=pending&q=express&dueDateFrom=2026-06-01&dueDateTo=2026-06-30&sortBy=dueDate&order=asc
Authorization: Bearer <token>
```

### Detail Todo
```http
GET /todos/:id
```

### Update Todo
```http
PUT /todos/:id
```

### Change Status
```http
PATCH /todos/:id/status
```
```json
{
  "status": "completed"
}
```

### Delete Todo
```http
DELETE /todos/:id
```

### Restore Todo
```http
PATCH /todos/:id/restore
```

### Navbar-style Task Pages
```http
GET /todos/today
GET /todos/overdue
GET /todos/completed
GET /todos/deleted
GET /todos/dashboard/summary
```

## Mapping ke PRD
- Login page `POST /auth/login`
- Sign up page `POST /auth/signup`
- Dashboard utama `GET /todos/dashboard/summary`
- All task `GET /todos`
- Today task `GET /todos/today`
- Overdue task `GET /todos/overdue`
- Complete task `GET /todos/completed`
- Deleted task `GET /todos/deleted`
- Detail page `GET /todos/:id`
- Create page `POST /todos`
- Update page `PUT /todos/:id`
- Delete action `DELETE /todos/:id`
- Change status `PATCH /todos/:id/status`

## Catatan
- Logout cukup hapus token di frontend.
- Database default pakai MySQL supaya setup ringan untuk bootcamp.
- Email bebas domain apa saja selama format email valid.
