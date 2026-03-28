# 🔧 Test-Anleitung: Richtiges API-Endpoint testen

## Das Problem

```bash
curl http://localhost:8005/api/
# 404 Not Found HTML
```

Das ist **eigentlich OK** - `/api/` ist nur ein Prefix, kein echtes Endpoint!

## Die Lösung

Testen Sie mit einem echten API-Endpoint:

```bash
# ✅ RICHTIG - Login Endpoint
curl -X POST http://localhost:8005/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# ✅ RICHTIG - User Data Endpoint  
curl http://localhost:8005/api/me

# ✅ RICHTIG - Projects Endpoint
curl http://localhost:8005/api/projects

# ✅ RICHTIG - Health Check
curl http://localhost:8005/check_health
```

## Warum `/api/` allein 404 gibt

In den URLs ist `/api/` nur ein Prefix:

```python
path(webserver_path, include("webserver.urls"))
# webserver_path = "api/"
# → /api/ ist nur ein PREFIX!

# Echte Endpoints sind:
# /api/login        ← include("webserver.urls") → path("login")
# /api/me           ← include("webserver.urls") → path("me")
# /api/projects     ← include("webserver.urls") → path("projects")
```

## Richtige Test-Kommandos

```bash
# Test 1: Login (POST)
curl -X POST http://localhost:8005/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"secure-user@acme.de","password":"secure"}'

# Test 2: Authentifizierte Anfrage (braucht Cookie/Token)
curl -i http://localhost:8005/api/me

# Test 3: Health Check (kein Auth nötig)
curl http://localhost:8005/check_health

# Test 4: Projects (mit Auth)
curl http://localhost:8005/api/projects
```

## Success Criteria

✅ Endpoints geben JSON zurück (nicht HTML!)
✅ 404 für `/api/` allein ist OK (es ist nur Prefix)
✅ 401 bei Auth-Endpoints ohne Auth ist OK
✅ 200 mit JSON für echte Requests

## Überprüfung: Backend serviert KEINE HTML mehr

```bash
# ❌ SCHLECHT: HTML Response
<html>
<head><title>Not Found</title></head>
...

# ✅ GUT: JSON Response
{"detail":"Authentication credentials were not provided."}

# ✅ GUT: JSON Response  
{"username":"...","email":"..."}
```

Testen Sie jetzt mit echten Endpoints!

