v# Backend-Problembericht & Lösungsschritte

## Identifizierte Probleme

### 1. ⚠️ StaticFiles Warning (W004) - NICHT-KRITISCH
```
?: (staticfiles.W004) The directory '/backend/assets' in the STATICFILES_DIRS setting does not exist.
```

**Ursache:** In `backend/securecheckplus/settings.py` (Zeile 218) ist konfiguriert:
```python
STATICFILES_DIRS = [os.path.join(BASE_DIR, "assets")]
```
Der Ordner `/backend/assets` existiert aber nicht.

**Lösung:**
```bash
mkdir -p backend/assets
echo ".gitkeep" > backend/assets/.gitkeep
```

---

### 2. 🔴 Unapplied Migrations - KRITISCH
```
Your models in app(s): 'analyzer' have changes that are not yet reflected in a migration, and so won't be applied.
Run 'manage.py makemigrations' to make new migrations, and then re-run 'manage.py migrate' to apply them.
```

**Ursache:** Während des 3Tier-Refactorings wurden Modelländerungen im `analyzer` App vorgenommen:
- `analyzer/models.py` wurde modifiziert
- Aber es wurde keine neue Migration mit `makemigrations` erstellt
- Die vorhandenen Migrations (0001_initial.py, 0002_initial.py) sind nicht aktualisiert

**Lösung - Option A: Mit Docker Compose (empfohlen)**

1. Bearbeiten Sie `entrypoint.sh`, um `makemigrations` vor `migrate` auszuführen:

```bash
#!/bin/sh

echo "Waiting for postgres..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do sleep 1; done;
echo "PostgreSQL started"

python manage.py createcachetable rate_limit
python manage.py makemigrations analyzer webserver  # NEU: Migrationen generieren
python manage.py migrate

python manage.py collectstatic --no-input

exec "$@"
```

2. Starten Sie den Container neu:
```bash
docker-compose -f docker-compose-preview.yml down
docker-compose -f docker-compose-preview.yml up --build
```

**Lösung - Option B: Manuell in der Container-Shell**

1. Wenn der Container läuft:
```bash
docker exec -it securecheckplus_server python manage.py makemigrations
docker exec -it securecheckplus_server python manage.py migrate
```

2. Oder betreten Sie den Container direkt:
```bash
docker exec -it securecheckplus_server sh
cd /backend
python manage.py makemigrations
python manage.py migrate
```

---

## Migrationsüberprüfung

Um zu überprüfen, ob alles korrekt funktioniert:

```bash
# Migrationen Status prüfen
docker exec -it securecheckplus_server python manage.py showmigrations

# Output sollte alle Migrationen mit [X] (angewendet) anzeigen
```

---

## Weitere Warnungen (unkritisch)

- `WARNING: CSRF deactivated for non HTTPS address!` - Erwartet in DEV-Umgebung
- `Cache table 'rate_limit' already exists.` - Erwartet beim Neustart

---

## Empfohlene Änderungen

### 1. Erstelle den fehlenden assets Ordner:
```bash
mkdir -p backend/assets && echo ".gitkeep" > backend/assets/.gitkeep
```

### 2. Aktualisiere `backend/entrypoint.sh`:
```bash
# Füge diese Zeile vor 'python manage.py migrate' hinzu:
python manage.py makemigrations analyzer webserver
```

### 3. Commit these changes:
```bash
git add backend/assets/.gitkeep backend/entrypoint.sh
git commit -m "Fix: Create missing assets directory and auto-generate migrations"
```

