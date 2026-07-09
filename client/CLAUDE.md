# TaskFlow — Mayfair Worktops Assignment

## Stack
- Frontend: React (Vite) + Tailwind + Framer Motion, state via [Context/Zustand — pick one]
- Backend: Node.js + Express + Sequelize (PostgreSQL) — separate /client and /server
- Auth: JWT, bcrypt for password hashing
- Deploy: Frontend on Vercel, backend on Render

## Commands
- Frontend: `npm run dev` (client), `npm run build`
- Backend: `npm run dev` (server, nodemon), `npm run migrate`
- Tests: `npm test` (if implemented)

## Conventions
- RESTful routes only — no RPC-style endpoints
- All routes under /api/v1
- Error responses: { error: string, statusCode: number } shape, consistent across all endpoints
- Every mutating endpoint validates input before touching the DB

## Key rules
- NEVER commit .env — use .env.example only
- All task queries must be scoped to req.user.id — no cross-user data leakage
- Match this against Full_Stack_Developer_Assignment.md section 1.1/1.2 before 
  marking any feature complete
- Frontend must follow a distinct visual identity (see design notes in 
  ARCHITECTURE.md) — not default Tailwind blue/gray