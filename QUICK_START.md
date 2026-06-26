# Quick Start: 3-Tier Testing

Validate the 3-tier deployment (frontend + backend + db) in about 15 minutes.

## Prerequisites

- Docker with `docker compose` (v2, bundled with Docker Engine 20.10+)
- About 2 GB free disk space for images and volumes

## Step 1: Build the frontend

```bash
cd frontend
npm install
npm run build
ls -la dist/  # Verify: index.html, app.js, login.js exist
```

Expected: `frontend/dist/` exists with content.

## Step 2: Start the Docker stack

```bash
docker compose -f docker-compose.yml -f docker-compose-preview.yml up --build -d
docker compose -f docker-compose.yml -f docker-compose-preview.yml logs -f
```

Expected: All containers start without errors.

A helper script is also available: `scripts/dev-up.sh` (does the same thing).

## Step 3: Quick verification

### Frontend reachable

```bash
curl -I http://localhost:3000/
# Expected: HTTP/1.1 200 OK
```

### Backend API reachable

```bash
curl -I http://localhost:8005/check_health
# Expected: HTTP/1.1 200 OK

curl -i http://localhost:8005/api/projects
# Expected: HTTP/1.1 401/403 without login (auth is enforced)

curl -i http://localhost:8005/api/
# Expected: HTTP/1.1 404 (only an API prefix, no endpoint)
```

### Static assets via frontend proxy

```bash
curl -I http://localhost:3000/static/rest_framework/css/default.css
# Expected: HTTP/1.1 200 OK
```

### Frontend assets

```bash
curl -I http://localhost:3000/app.js
# Expected: HTTP/1.1 200 OK
```

### Migrations applied

```bash
docker logs securecheckplus_server | grep -i migration
# Expected: "Migrations were applied" or "No migrations to apply"
```

## Step 4: Browser test

1. Open http://localhost:3000 in a browser
2. Log in with:
   - Username: `secure-user@acme.de`
   - Password: `secure`
3. The dashboard should load
4. Open DevTools (F12) → Network tab and verify:
   - HTML/JS/CSS served from `localhost:3000`
   - API calls go to `localhost:8005/api/`

## Checklist

- [ ] `frontend/dist/` exists
- [ ] Frontend container is running
- [ ] Backend container is running
- [ ] No STATICFILES_DIRS warnings
- [ ] Frontend reachable on port 3000
- [ ] Backend health endpoint reachable on port 8005
- [ ] API returns 401/403 without authentication
- [ ] `/api/` prefix returns 404 (no endpoint)
- [ ] Static assets reachable via frontend proxy
- [ ] Migrations applied
- [ ] Browser test successful
- [ ] Logs clean (no errors)

## Troubleshooting

### Frontend not reachable (port 3000)

```bash
docker logs securecheckplus_frontend
docker exec securecheckplus_frontend ls -la /usr/share/nginx/html/
```

Check for Nginx errors, verify the Dockerfile, confirm `dist/` was copied.

### Backend returns 404 for API

```bash
docker logs securecheckplus_server | tail -50
docker exec securecheckplus_server python manage.py check
```

Check for Django errors, verify URL configuration.

### STATICFILES warning appears

This should not happen (it was removed). If it does, check `settings.py`:

```bash
docker exec securecheckplus_server grep STATICFILES_DIRS /backend/securecheckplus/settings.py
```

### Migrations failed

```bash
docker exec securecheckplus_server python manage.py showmigrations
docker exec securecheckplus_server python manage.py migrate
```

### Restart everything

```bash
docker compose -f docker-compose.yml -f docker-compose-preview.yml down
docker system prune -f
docker compose -f docker-compose.yml -f docker-compose-preview.yml up --build -d
```

## Expected log output

Good output (server started):

```
securecheckplus_server | Waiting for postgres...
securecheckplus_server | PostgreSQL started
securecheckplus_server | System check identified no issues.
securecheckplus_server | No migrations to apply.
securecheckplus_server | 0 static files copied
securecheckplus_server | Django version 5.1.2, running development server...
securecheckplus_frontend | nginx: master process started
```

Good output (migrations ran):

```
securecheckplus_server | Running migrations...
securecheckplus_server | Applying ... OK
```

Bad output (old errors that should not appear):

```
staticfiles.W004: The directory '/backend/assets' does not exist
Your models in app(s): 'analyzer' have changes
STATICFILES_DIRS = [...]
```

## Support commands

```bash
# Check status
docker compose -f docker-compose.yml -f docker-compose-preview.yml ps

# View specific container logs
docker logs securecheckplus_server -n 100

# Enter a container
docker exec -it securecheckplus_server sh

# Run Django checks
docker exec securecheckplus_server python manage.py check

# Test Nginx config
docker exec securecheckplus_frontend nginx -t

# Test database connection
docker exec securecheckplus_db psql -U securecheckplus -d some-db-name -c "SELECT version();"

# Tail all logs
docker compose -f docker-compose.yml -f docker-compose-preview.yml logs --tail=200
```

## Success criteria

**Green (all OK):**
- Frontend port 3000 returns 200
- Backend health endpoint returns 200
- API endpoints return 401/403 without login
- `/api/` prefix returns 404 (no endpoint)
- Static assets reachable via frontend proxy
- Migrations applied
- No STATICFILES_DIRS warnings
- Browser test successful

**Red (something is broken):**
- Frontend not reachable
- Backend errors in logs
- STATICFILES_DIRS warning present
- Browser shows 404s
- Migrations failed
