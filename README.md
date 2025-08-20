# Smart Helpdesk with Agentic Triage (MERN, no Tailwind)

This is a complete, dockerized MERN implementation of the **Smart Helpdesk with Agentic Triage** assignment. 
**No Tailwind CSS** is used; the React app uses **Material UI (MUI)** for styling and accessibility.

## Tech
- Frontend: React + Vite + React Router + Material UI (MUI)
- Backend: Node 20 + Express + Mongoose (MongoDB)
- Auth: JWT (access tokens), bcrypt for hashing
- Agent: Deterministic stub (keyword rules), simple keyword/BM25-like retrieval
- Observability: JSON logs w/ traceId; request logger; `/healthz`, `/readyz`
- DevOps: Docker Compose (client, api, mongo)
- Tests: Jest (backend) + Vitest/RTL (frontend)

> Runs fully offline with `STUB_MODE=true`. Prompts & agent plan are versioned in code.

## Quick start (Docker)
1. Copy `.env.example` to `.env` and adjust as needed.
2. `docker compose up --build`  
3. Visit `http://localhost:5173` (client). API at `http://localhost:8080`.

## Quick start (Local)
- API:
  ```bash
  cd server
  cp .env.example .env
  npm i
  npm run dev
  ```
- Client:
  ```bash
  cd client
  npm i
  npm run dev
  ```

## Seeding
The server seeds sample users (admin/agent/user), KB articles, and tickets on startup if `SEED_ON_START=true`.

### Default users
- admin: `admin@example.com` / `password123`
- agent: `agent@example.com` / `password123`
- user:  `user@example.com`  / `password123`

## Repo layout
```
smart-helpdesk-agentic/
  client/            # React + Vite + MUI
  server/            # Express + Mongoose + agent stub
  docker-compose.yml
  README.md
```

## Agentic workflow
- **Plan** (state machine): classify → retrieve KB → draft → decision → persist + audit
- **Classify stub**: keyword rules (refund/invoice→billing; error/bug/stack→tech; delivery/shipment→shipping; else other)
- **Retrieval**: simple keyword scoring over KB (title/body/tags), top 3 with snippets
- **Draft**: templated text with numbered citations
- **Decision**: auto-close if `autoCloseEnabled` and `confidence ≥ threshold`, else `waiting_human`
- **Logging**: every step appends `AuditLog` with a shared `traceId`

## Testing
- Backend:
  ```bash
  cd server && npm test
  ```
- Frontend:
  ```bash
  cd client && npm test
  ```

## Security/Resilience
- Input validation via Zod
- JWT expiry + refresh-ready structure (access token only by default)
- Rate limit auth endpoints
- Timeouts + retries around triage job
- CORS locked to client origin via env

## Notes
- Styling uses **MUI**; **no Tailwind** is included.
- This repo matches the Assignment requirements, endpoints, and data model.
