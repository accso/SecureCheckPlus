# 🚀 QUICK START: 3Tier Testing

## Phase 1: Frontend Build (5 Min)

```bash
cd frontend
npm install
npm run build
ls -la dist/  # Verify: index.html, app.js, login.js vorhanden
```

✅ **Erwartet:** `frontend/dist/` existiert mit Content

---

## Phase 2: Docker Start (3 Min)

```bash
# Alte Container stoppen
docker-compose -f docker-compose-preview.yml down

# Neu starten mit Build
docker-compose -f docker-compose-preview.yml up --build -d

# Logs anschauen
docker-compose -f docker-compose-preview.yml logs -f
```

✅ **Erwartet:** Alle Container starten ohne Fehler

---

## Phase 3: Schnelle Tests (2 Min)

### Frontend erreichbar?
```bash
curl -I http://localhost:3000/
# Erwartet: HTTP/1.1 200 OK
```

### Backend API erreichbar?
```bash
curl -I http://localhost:8005/check_health
# Erwartet: HTTP/1.1 200 OK

curl -i http://localhost:8005/api/projects
# Erwartet: HTTP/1.1 401/403 ohne Login (AUTH OK)

curl -i http://localhost:8005/api/
# Erwartet: HTTP/1.1 404 (nur API-Prefix, kein Endpoint)
```

### Static Assets via Frontend Proxy erreichbar?
```bash
curl -I http://localhost:3000/static/rest_framework/css/default.css
# Erwartet: HTTP/1.1 200 OK
```

### Frontend Assets vorhanden?
```bash
curl -I http://localhost:3000/app.js
# Erwartet: HTTP/1.1 200 OK
```

### Migrations OK?
```bash
docker logs securecheckplus_server | grep -i migration
# Erwartet: "Migrations wurden angewendet" oder "No migrations to apply"
```

---

## Phase 4: Browser Test (1 Min)

```
1. Browser: http://localhost:3000
2. Login mit:
   - Username: secure-user@acme.de
   - Password: secure
3. Dashboard sollte laden
4. F12 → Network Tab → Überprüfe Requests
   - HTML/JS/CSS von localhost:3000 ✅
   - API calls zu localhost:8005/api/ ✅
```

---

## 🎯 Checkliste: Alles OK?

- [ ] `frontend/dist/` existiert
- [ ] Frontend Container läuft
- [ ] Backend Container läuft
- [ ] Keine STATICFILES_DIRS Warnings
- [ ] Frontend erreichbar (Port 3000)
- [ ] Backend Health erreichbar (Port 8005)
- [ ] API Auth-Verhalten korrekt (401/403 ohne Login)
- [ ] /api/ Prefix gibt 404 (kein Endpoint)
- [ ] Static Assets via Frontend Proxy erreichbar
- [ ] Migrations angewendet
- [ ] Browser-Test erfolgreich
- [ ] Logs sauber (keine Errors)

---

## ❌ Problem? Schnelle Fixes

### Frontend nicht erreichbar (Port 3000)
```bash
docker logs securecheckplus_frontend
# → Nginx Fehler? Dockerfile OK? dist/ kopiert?
docker exec securecheckplus_frontend ls -la /usr/share/nginx/html/
```

### Backend zeigt 404 für API
```bash
docker logs securecheckplus_server | tail -50
# → Django Fehler? URLs OK?
docker exec securecheckplus_server python manage.py check
```

### Backend zeigt STATICFILES Warning
```bash
# Das sollte NICHT vorkommen (wir haben es entfernt)
# Falls trotzdem: settings.py überprüfen
docker exec securecheckplus_server grep STATICFILES_DIRS /backend/securecheckplus/settings.py
```

### Migrations fehlgeschlagen
```bash
docker exec securecheckplus_server python manage.py showmigrations
docker exec securecheckplus_server python manage.py migrate
```

### Alles neu starten
```bash
docker-compose -f docker-compose-preview.yml down
docker system prune -f
docker-compose -f docker-compose-preview.yml up --build -d
```

---

## 📊 Expected Output

### Docker Logs (gut)
```
securecheckplus_server | Waiting for postgres...
securecheckplus_server | PostgreSQL started
securecheckplus_server | System check identified no issues.
securecheckplus_server | No migrations to apply.
securecheckplus_server | 0 static files copied
securecheckplus_server | Django version 5.1.2, running development server...
securecheckplus_frontend | nginx: master process started
```

### Docker Logs (gut - Migrations)
```
securecheckplus_server | Running migrations...
securecheckplus_server | Applying ... OK
```

### Docker Logs (NICHT OK - alte Fehler)
```
❌ staticfiles.W004: The directory '/backend/assets' does not exist
❌ Your models in app(s): 'analyzer' have changes
❌ STATICFILES_DIRS = [...]
```

---

## 📋 Datei-Überprüfung

```bash
# Frontend webpack Config korrekt?
cat frontend/webpack.common.js | grep -A2 "output:"

# Frontend TypeScript Config korrekt?
cat frontend/tsconfig.json | grep outDir

# Backend Settings korrekt?
cat backend/securecheckplus/settings.py | grep -A2 "Static files"

# Backend URLs korrekt?
cat backend/securecheckplus/urls.py | grep -A5 "urlpatterns ="

# .gitignore korrekt?
cat .gitignore | grep "frontend/dist"
```

---

## 📞 Support Commands

```bash
# Status überprüfen
docker-compose -f docker-compose-preview.yml ps

# Spezifischen Container anschauen
docker logs securecheckplus_server -n 100  # Letzte 100 Zeilen

# In Container gehen
docker exec -it securecheckplus_server sh

# Backend testen
docker exec securecheckplus_server python manage.py check

# Frontend testen
docker exec securecheckplus_frontend nginx -t

# DB verbindung testen
docker exec securecheckplus_db psql -U securecheckplus -d some-db-name -c "SELECT version();"

# Alle Logs
docker-compose -f docker-compose-preview.yml logs --tail=200
```

---

## ✅ Success Criteria

```
🟢 GRÜN (Alles OK):
✅ Frontend Port 3000 antwortet mit 200
✅ Backend Health Endpoint antwortet mit 200
✅ API Endpoints antworten mit 401/403 ohne Login
✅ /api/ Prefix antwortet mit 404 (kein Endpoint)
✅ Static Assets via Frontend Proxy sind erreichbar
✅ Migrations wurden angewendet
✅ Keine STATICFILES_DIRS Warnings
✅ Browser-Test erfolgreich

🔴 ROT (Nicht OK):
❌ Frontend nicht erreichbar
❌ Backend Errors in Logs
❌ STATICFILES_DIRS Warning vorhanden
❌ Browser zeigt 404er
❌ Migrations fehlgeschlagen
```

---

## 🎯 Nächste Schritte nach erfolgreichem Test

```bash
# 1. Cleanup (optional)
rm -rf backend/assets/

# 2. Docker Cleanup
docker system prune -a

# 3. Alle Änderungen committen
git add .
git commit -m "refactor: implement 3tier architecture with separate frontend/backend assets"

# 4. Production Test
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d

# 5. Feiern! 🎉
echo "3Tier Architektur erfolgreich implementiert!"
```

---

**Zeitschätzung für komplette Validierung: ~30 Minuten**

Viel Erfolg! 🚀

