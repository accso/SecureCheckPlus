# API Testing Guide

How to test the SecureCheckPlus API correctly.

## Common confusion: why `/api/` returns 404

```bash
curl http://localhost:8005/api/
# Returns: 404 Not Found
```

This is correct behavior. `/api/` is only a URL prefix, not an endpoint. The actual endpoints are:

- `/api/login` (POST)
- `/api/me` (GET)
- `/api/projects` (GET)
- `/api/projectsFlat` (GET)
- `/api/cveObject/<id>/update` (PUT)
- etc.

## Testing real endpoints

### Health check (no auth required)

```bash
curl http://localhost:8005/check_health
# Expected: HTTP/1.1 200 OK, "I'm fine!"
```

### Login (POST)

```bash
curl -X POST http://localhost:8005/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"secure-user@acme.de","password":"secure"}'
```

### Authenticated requests

Authenticated requests use Django sessions. After login, the session cookie is set and subsequent requests with `-b cookies.txt -c cookies.txt` will be authenticated.

```bash
# Login and save cookie
curl -c cookies.txt -X POST http://localhost:8005/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"secure-user@acme.de","password":"secure"}'

# Use the saved cookie
curl -b cookies.txt http://localhost:8005/api/me
curl -b cookies.txt http://localhost:8005/api/projects
```

### Analyzer API

The analyzer endpoint requires an API key in the `API-KEY` header (not the URL body):

```bash
curl -X POST "http://localhost:8005/analyzer/api?projectId=my-project&fileType=json&toolName=owasp" \
  -H "API-KEY: your-api-key-here" \
  -H "Content-Type: application/json" \
  --data-binary @report.json
```

## Expected responses

### Good: JSON for API requests

```json
{"detail":"Authentication credentials were not provided."}
```

```json
{"username":"secure-user@acme.de","email":"..."}
```

### Bad: HTML for API requests

If you see HTML responses (e.g., Django's default 404 page), the URL routing is misconfigured. Check that:

- The request path includes the correct prefix (`/api/`, `/analyzer/api/`)
- The endpoint exists in `webserver/urls.py` or `securecheckplus/urls.py`
- The `BASE_URL` setting matches your deployment path

## URL structure

```
/                          → static frontend (Nginx in 3-tier mode)
/static/                   → static files (proxied to backend)
/analyzer/api             → analyzer endpoints
/api/                      → webserver API prefix
  /api/login               → authentication
  /api/me                  → current user
  /api/projects            → project list
  /api/projectsFlat        → flat project list
  /api/projects/<id>       → project detail
  /api/projects/<id>/apiKey → API key management
  /api/cveObject/<id>/update → CVE update
  /api/myFavorites         → user's favorite projects
  /api/deleteProjects      → bulk delete
  /api/error404            → 404 handler
/check_health             → health check (no prefix)
```

## Using scripts/run-adapter-image.bash

A helper script exists for testing with the bundled OWASP report:

```bash
# Set required environment variables
export API_KEY=your-api-key
export PROJECT_ID=your-project-id
export SERVER_URL=http://localhost:8005
export REPORT_FILE_NAME=dependency-check-report.json

# Run the script
scripts/run-adapter-image.bash
```

The script sends the report to `/analyzer/api` and prints the response.
