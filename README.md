# JPATS — AI Job Portal & ATS (Hireloop)

A full-stack MERN job portal with AI resume parsing, recruiter ATS workflows, admin analytics, and real-time notifications.

## Architecture

```
┌─────────────┐     REST + Socket.io     ┌─────────────┐
│   React     │ ◄──────────────────────► │   Express   │
│   (Vite)    │                          │   + JWT     │
└─────────────┘                          └──────┬──────┘
                                                │
                    ┌───────────────────────────┼───────────────────────────┐
                    │                           │                           │
              ┌─────▼─────┐              ┌──────▼──────┐            ┌───────▼───────┐
              │  MongoDB  │              │  Cloudinary │            │ Gemini API    │
              │  Atlas    │              │  (resumes)  │            │ (resume AI)   │
              └───────────┘              └─────────────┘            └───────────────┘
```

## Roles

| Role | Dashboard | Key features |
|------|-----------|--------------|
| Candidate | `/candidate` | Browse/apply jobs, AI profile, interviews, saved jobs |
| Recruiter | `/recruiter` | Post jobs, review applicants, schedule interviews |
| Admin | `/admin` | User management, company approval, analytics |

## Quick start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and secrets
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

### Demo accounts (when `SEED_DEMO=true`)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hireloop.app | demo1234 |
| Recruiter | recruiter@hireloop.app | demo1234 |
| Candidate | candidate@hireloop.app | demo1234 |

## Public routes
- `/jobs` — Browse open positions without signing in
- `/jobs/:id` — Public job detail (sign in to apply)

## API overview
- `POST /api/auth/register` — Register (Candidate/Recruiter)
- `POST /api/auth/login` — Login
- `GET /api/public/jobs` — Public job search (no auth)
- `GET /api/candidate/*` — Candidate endpoints
- `GET /api/recruiter/*` — Recruiter endpoints
- `GET /api/admin/*` — Admin endpoints

## Real-time events (Socket.io)
Candidates receive live toasts for:
- `application:status` — Application status changed
- `interview:scheduled` — New interview booked
- `interview:cancelled` — Interview cancelled

## Deployment

### Backend (Render)
Use `backend/render.yaml` or connect repo with start command `npm start`.

### Frontend (Vercel)
Set `VITE_API_URL` to your production API URL (e.g. `https://your-api.onrender.com/api`).

### MongoDB Atlas
1. Create a free cluster at mongodb.com/atlas
2. Add your IP to Network Access (or `0.0.0.0/0` for dev)
3. Create a database user and copy the connection string to `MONGO_URI`

## Tests
```bash
cd backend
npm test
```

## Environment variables
See `backend/.env.example` and `frontend/.env.example`.
