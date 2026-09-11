# Vignak Solutions — Start Guide

One backend terminal. One frontend terminal. That is the recommended local workflow.

## Prerequisites

- Node.js **18+** and npm **9+**
- A MongoDB Atlas database (or local MongoDB)
- Dependencies installed once from the repo root:

```bash
npm install
```

## Environment setup (first time only)

1. Copy the example env file into the server folder:

```powershell
Copy-Item .env.example server\.env
```

2. Edit `server/.env` and set at least:

| Variable | Example / notes |
|----------|-----------------|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | Long random string (32+ chars recommended) |
| `CLIENT_URL` | `http://127.0.0.1:5173` |
| `PORT` | `5000` (default) |

Optional later: `SMTP_*` for password-reset email, `ADMIN_*` for seeding.

3. Create an admin user (optional):

```powershell
$env:ADMIN_EMAIL="you@example.com"
$env:ADMIN_PASSWORD="YourPassword12+"
$env:ADMIN_NAME="Your Name"
npm run seed:admin
```

Optional sample content:

```bash
npm run seed:content
```

## Start the app (two terminals)

Open the project root: `c:\Users\balaj\OneDrive\Desktop\vignak`

### Terminal 1 — Backend

```bash
npm run server
```

Wait until you see logs like `db_connected` and `server_listening` on port **5000**.

Check: [http://127.0.0.1:5000/api/health](http://127.0.0.1:5000/api/health)  
Ready (includes DB): [http://127.0.0.1:5000/api/ready](http://127.0.0.1:5000/api/ready)

### Terminal 2 — Frontend

```bash
npm run client
```

Open: [http://127.0.0.1:5173](http://127.0.0.1:5173)

The Vite dev server proxies `/api` → `http://127.0.0.1:5000`, so the browser only talks to port 5173.

### Admin

- Login: [http://127.0.0.1:5173/admin/login](http://127.0.0.1:5173/admin/login)

## Alternate commands

| Command | What it does |
|---------|----------------|
| `npm run server` / `npm run dev:server` | Backend only |
| `npm run client` / `npm run dev:client` | Frontend only |
| `npm run dev` | Both together in one terminal (via concurrently) |

## If something fails

| Symptom | Fix |
|---------|-----|
| Vite `http proxy error` / `ECONNREFUSED` | Backend is not running — start Terminal 1 first |
| `server_start_failed` / Mongo errors | Check `MONGODB_URI`, Atlas IP allowlist, and network |
| `/api/ready` returns 503 | Database disconnected — fix Mongo, then restart `npm run server` |
| CORS / cookie issues | Use `http://127.0.0.1:5173` and match `CLIENT_URL` in `server/.env` |
| Login fails for new admin | Password must be **12+** characters; re-run `seed:admin` |

## Useful scripts

```bash
npm run build      # Production client build
npm test           # Server + client tests
npm run lint       # Lint both workspaces
npm run test:e2e   # Playwright smoke (starts Vite; API should be up for full flows)
```

## Stack reminder

- Frontend: React + Vite → port **5173**
- Backend: Express → port **5000**
- Database: MongoDB Atlas via `MONGODB_URI`
