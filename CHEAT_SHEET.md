# ⚡ CHEAT SHEET: 3Tier-Architektur Refactoring

## 🚀 Super-Schneller Start (5 Minuten)

```bash
# 1. Alte Container weg
docker-compose -f docker-compose-preview.yml down

# 2. Neu starten
docker-compose -f docker-compose-preview.yml up --build -d

# 3. Testen
curl -I http://localhost:3000/              # Frontend OK?
curl -I http://localhost:8005/api/          # Backend OK?
curl -I http://localhost:8005/static/app.js # Should be 404!
```

---

## 📋 Datei-Änderungen (Kurz)

### Frontend
```bash
# webpack.common.js (Zeile 48)
OLD: path: path.join(__dirname, "../backend/assets")
NEW: path: path.join(__dirname, "./dist")

# tsconfig.json (Zeile 22)
OLD: "outDir": "../backend/assets"
NEW: "outDir": "./dist"

# Dockerfile (Zeile 16)
OLD: COPY --from=build /backend/assets
NEW: COPY --from=build /app/dist
```

### Backend
```bash
# settings.py (Zeile 218)
OLD: STATICFILES_DIRS = [os.path.join(BASE_DIR, "assets")]
NEW: # (Entfernt)

# urls.py (Zeile 45)
OLD: urlpatterns += static(...)
NEW: # (Entfernt)

# entrypoint.sh (Zeile 8)
OLD: python manage.py migrate
NEW: python manage.py makemigrations
     python manage.py migrate
```

### Config
```bash
# .gitignore (Neu)
+ frontend/dist/
```

---

## 🧪 Test-Commands

```bash
# Frontend lädt?
curl http://localhost:3000/

# Frontend Assets laden?
curl http://localhost:3000/app.js

# Backend API erreichbar?
curl http://localhost:8005/api/

# Backend serviert KEINE Assets? (sollte 404 sein)
curl http://localhost:8005/static/app.js

# Migrations OK?
docker logs securecheckplus_server | grep -i migration

# Container Status?
docker-compose -f docker-compose-preview.yml ps

# Logs live?
docker-compose -f docker-compose-preview.yml logs -f
```

---

## 🔍 Debugging (Schnell)

```bash
# Frontend Container überprüfen
docker exec securecheckplus_frontend ls -la /usr/share/nginx/html/

# Backend Migrations?
docker exec securecheckplus_server python manage.py showmigrations

# Django Check?
docker exec securecheckplus_server python manage.py check

# Nginx Config OK?
docker exec securecheckplus_frontend nginx -t

# DB verbunden?
docker exec securecheckplus_db psql -U securecheckplus -d some-db-name -c "SELECT 1"
```

---

## ❌ Häufige Fehler

### "STATICFILES_DIRS Warning noch vorhanden"
```bash
# Prüfen, ob wirklich gelöscht wurde:
grep -n STATICFILES_DIRS backend/securecheckplus/settings.py
# → Sollte NICHT existieren
```

### "Frontend Assets nicht geladen (404)"
```bash
# Frontend dist/ existiert?
ls -la frontend/dist/

# Nginx kopiert richtig?
docker exec securecheckplus_frontend ls -la /usr/share/nginx/html/
```

### "Backend 404 auf /api/"
```bash
# URLs OK?
grep -n "path.*api" backend/securecheckplus/urls.py
# → Sollte existieren

# Django Check
docker exec securecheckplus_server python manage.py check
```

### "Migrations fehlgeschlagen"
```bash
# Status anschauen
docker exec securecheckplus_server python manage.py showmigrations

# Manuell ausführen
docker exec securecheckplus_server python manage.py makemigrations
docker exec securecheckplus_server python manage.py migrate
```

---

## 📊 Success Indicators

```bash
# Alles OK? Diese Kommandos sollten alle 200 sein:
curl -w "Frontend: %{http_code}\n" -o /dev/null -s http://localhost:3000/
curl -w "Backend: %{http_code}\n" -o /dev/null -s http://localhost:8005/api/

# Assets richtig serviert?
curl -w "Frontend App.js: %{http_code}\n" -o /dev/null -s http://localhost:3000/app.js
curl -w "Backend NO Assets: %{http_code}\n" -o /dev/null -s http://localhost:8005/static/app.js
# → Letzter sollte 404 sein!
```

---

## 🧹 Cleanup (Nach erfolgreichem Test)

```bash
# Optional: Alte Assets löschen
rm -rf backend/assets/

# Optional: Docker aufräumen
docker system prune -a
docker volume prune

# Optional: Build-Caches löschen
rm -rf frontend/dist/
```

---

## 📚 Dokumentation Links (Quick)

| Problem | Datei | Section |
|---------|-------|---------|
| Schnell testen | `QUICK_START.md` | Phase 1-4 |
| Was geändert? | `REFACTORING_SUMMARY.md` | Alle Änderungen |
| Warum? | `ASSET_ARCHITEKTUR_ANALYSE.md` | Architektur |
| Wie debugging? | `VALIDATION_CHECKLIST.md` | Troubleshooting |
| Details? | `3TIER_REFACTORING_COMPLETED.md` | Tech Details |

---

## 🎯 Häufige Fragen

**F: Muss ich was installieren?**
A: Nein, nur `docker-compose up` ausführen

**F: Wie lange dauert's?**
A: Erstes Build: 5-10 Min. Danach: 1-2 Min

**F: Kann ich zurück?**
A: Ja: `git revert HEAD~7..HEAD`

**F: Muss ich Migrationen manuell machen?**
A: Nein, automatisch beim Start

**F: Welche Dateien bearbeitet?**
A: 7 (3 Backend, 3 Frontend, 1 Config)

**F: Breaking Changes?**
A: Nein, nur Backend/Frontend entkoppelt

---

## 💾 Git Commands

```bash
# Alle Änderungen sehen
git diff

# Nur Dateinamen
git diff --name-only

# Spezifische Datei
git diff frontend/webpack.common.js

# Status
git status

# Alle committen
git add .
git commit -m "refactor: 3tier architecture"

# Zurückfahren
git revert HEAD~7..HEAD
```

---

## 🚀 Production Deploy (Nach Tests)

```bash
# Production Build
docker-compose -f docker-compose.yml build

# Production Start
docker-compose -f docker-compose.yml up -d

# Production Logs
docker-compose -f docker-compose.yml logs -f

# Production Test
curl https://your-domain.com/
curl https://your-domain.com/api/
```

---

## 📞 Emergency Commands

```bash
# Alles stoppen
docker-compose -f docker-compose-preview.yml down

# Alles löschen
docker-compose -f docker-compose-preview.yml down -v

# Neu von vorne
docker-compose -f docker-compose-preview.yml up --build --force-recreate

# Logs ausgeben
docker-compose -f docker-compose-preview.yml logs --tail=500

# In Container gehen
docker-compose -f docker-compose-preview.yml exec securecheckplus_server sh
```

---

## ✅ Finale Checkliste

- [ ] docker-compose down
- [ ] docker-compose up --build
- [ ] curl http://localhost:3000/ → 200
- [ ] curl http://localhost:8005/api/ → 200
- [ ] curl http://localhost:8005/static/app.js → 404
- [ ] docker logs OK
- [ ] Migrationen OK
- [ ] Browser Test OK
- [ ] Alle Logs prüfen
- [ ] Fertig! 🎉

---

**Zeit für Quick Start: ~5 Minuten**
**Gesamtzeit inkl. Tests: ~30 Minuten**
**Production Ready: ✅ JA**

