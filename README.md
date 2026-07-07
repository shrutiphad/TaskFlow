# TaskFlow — Task Management Application

A full-stack task management app built for the Mayfair Worktops Full Stack Developer take-home assignment. Users register, log in, and manage personal tasks (create/read/update/delete) with filtering, sorting, and a summary dashboard.

**AI tool disclosure:** built with Claude (Anthropic) as a pair-programming assistant, per the assignment's explicit allowance for AI tool use. Every design decision below is one I can walk through line by line in a follow-up interview.

---

## 1. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast dev server, no framework magic hiding the client/server boundary the brief asks for |
| Frontend state | React Context (auth, theme) + Zustand (tasks) | Context for cross-cutting concerns that rarely change; Zustand for the task list, which updates on every filter/sort/CRUD action and would cause noisy re-renders under Context |
| Styling | Tailwind CSS | Utility-first, fast to build a consistent design system with dark mode support |
| Forms/validation | React Hook Form + Zod (task form), React Hook Form (auth forms) | Declarative client-side validation matching the backend rules |
| Backend | Node.js + Express | Explicitly requested in the brief |
| Database | PostgreSQL + Sequelize | Relational integrity for the user→tasks relationship, real indexes, and enum types for priority/status |
| Auth | JWT (stateless) + bcrypt | Required by the brief; see ARCHITECTURE.md for the full flow and trade-offs |

This is a **separate frontend/backend MERN-style app** (`/client` + `/server`), not a Next.js fullstack app — deliberately, because the brief calls out "a clear separation between frontend and backend" and grades API design as its own 15-point category.

---

## 2. Project structure

```
mayfair-task-manager/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── api/             # axios instance + thin API wrapper functions
│       ├── context/         # AuthContext, ThemeContext
│       ├── store/           # Zustand task store
│       ├── components/      # Navbar, TaskCard, TaskFormModal, etc.
│       └── pages/            # Login, Register, Dashboard, Tasks
├── server/                  # Express + PostgreSQL backend
│   ├── src/
│   │   ├── config/           # Sequelize connection
│   │   ├── models/           # User, Task
│   │   ├── middleware/       # auth, validation, error handling
│   │   ├── controllers/      # auth, task, dashboard
│   │   └── routes/
│   ├── seed/                 # demo data seed script
│   └── tests/                # Jest + Supertest integration tests
├── docker-compose.yml        # one-command local startup (db + server + client)
└── ARCHITECTURE.md
```

---

## 3. Local setup

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ running locally (or use Docker — see §6)

### Backend

```bash
cd server
cp .env.example .env      # edit DB_* values if your local Postgres differs
npm install
npm run seed               # optional: creates a demo user + 8 sample tasks
npm run dev                 # http://localhost:5000
```

### Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

### Demo login
```
email:    demo@mayfair.dev
password: Demo1234
```
(created by `npm run seed` above)

---

## 4. Environment variables

**server/.env**
| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on (default 5000) |
| `NODE_ENV` | `development` / `production` / `test` |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Discrete Postgres connection params for local dev |
| `DATABASE_URL` | Optional single connection string; if set, takes priority over the discrete `DB_*` vars (used by most managed Postgres providers) |
| `JWT_SECRET` | Secret used to sign JWTs — must be a long random string in production |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_ORIGIN` | Comma-separated list of origins allowed by CORS |

**client/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

---

## 5. API reference

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth
| Method | Route | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/auth/register` | – | `{ name, email, password }` | password ≥ 8 chars, ≥ 1 digit; returns `{ token, user }` |
| POST | `/auth/login` | – | `{ email, password }` | returns `{ token, user }` |
| GET | `/auth/me` | ✓ | – | returns the current user; used to re-validate a stored token on app load |
| POST | `/auth/logout` | ✓ | – | stateless — client discards the token |

### Tasks
| Method | Route | Auth | Notes |
|---|---|---|---|
| GET | `/tasks?status=&priority=&sortBy=&order=` | ✓ | `status`: `todo\|in_progress\|done`, `priority`: `low\|medium\|high`, `sortBy`: `due_date\|created_at`, `order`: `asc\|desc` |
| GET | `/tasks/:id` | ✓ | 404 if the task doesn't belong to the caller |
| POST | `/tasks` | ✓ | body: `{ title, description?, priority?, status?, due_date? }` |
| PUT | `/tasks/:id` | ✓ | any subset of the same fields |
| DELETE | `/tasks/:id` | ✓ | confirmation prompt is handled client-side |

### Dashboard
| Method | Route | Auth | Returns |
|---|---|---|---|
| GET | `/dashboard/summary` | ✓ | `{ total, byStatus: { todo, in_progress, done }, overdue }` |

All error responses follow `{ message, errors? }`. Standard status codes: `200/201` success, `400` validation, `401` auth, `404` not found, `409` conflict (duplicate email), `500` unexpected.

---

## 6. Running with Docker

```bash
docker compose up --build
```
This starts Postgres, the backend (port 5000), and the frontend (port 5173) together. Update `JWT_SECRET` in `docker-compose.yml` before using this anywhere but your own machine.

---

## 7. Tests

**Backend:**
```bash
cd server
npm test
```
15 Jest/Supertest integration tests covering registration, login, weak-password rejection, task CRUD, filtering, ownership isolation (user A cannot read/edit/delete user B's tasks), and dashboard aggregation — run against a real PostgreSQL instance, not mocks.

**Frontend:**
```bash
# with the backend already running on :5000
cd client
npm test
```
3 Vitest + React Testing Library integration tests that render the actual `<App />` component tree and drive it with real user interactions (typing, clicking, selecting) against the real running backend — register → dashboard, a full task create → edit → filter → delete lifecycle, and a client-side validation rejection path. These are genuine integration tests, not mocked-API unit tests, which is why the backend needs to already be running for `npm test` to pass.

---

## 8. Screenshots / demo

Not included in this generated deliverable — run the app locally (§3) and record your own screenshots/GIF of: login, dashboard, task list with filters, and the create/edit modal, then drop them in a `/docs` folder and link them here before submitting.

---

## 9. Known trade-offs

See `ARCHITECTURE.md` for the full write-up. Short version: JWT is stored in `localStorage` rather than an httpOnly cookie (simpler CORS story for a 72-hour build; documented as a production hardening item), and `sequelize.sync({ alter: true })` is used instead of versioned migrations (fine for a take-home, would be replaced by `sequelize-cli` migrations in a real rollout).
