# SecureCheckPlus Projekt-Übersicht & 3Tier-Refactoring

## Projektstruktur

```
SecureCheckPlus.git/
├── backend/                    # Django Backend (3Tier)
│   ├── analyzer/              # Sicherheitsanalyse App
│   ├── webserver/             # Web API & User Management
│   ├── securecheckplus/       # Django Settings & URLs
│   ├── utilities/             # Shared Constants & Helpers
│   ├── templates/             # Email Templates
│   └── Dockerfile
│
├── frontend/                   # React TypeScript Frontend
│   └── src/
│       ├── components/
│       ├── page/
│       ├── queries/           # API Client
│       └── style/
│
├── adapter/                    # Zusätzlicher Adapter Service
│
└── docker-compose-preview.yml # Testumgebung
```

## 3Tier-Architektur

Die Anwendung folgt einer **3-Tier-Architektur**:

### Tier 1: Presentation Layer (Frontend)
- **React + TypeScript**
- Container: `securecheckplus_frontend`
- Port: 3000
- **Komponenten:**
  - Login-Seite
  - Project Dashboard
  - Report Viewer
  - CVSS Calculator

### Tier 2: Application Layer (Backend)
- **Django 5.1.2** + REST Framework
- Container: `securecheckplus_server`
- Port: 8000 (intern) → 8005 (extern)
- **Apps:**
  - `analyzer`: CVE-Analyse und Dependency-Management
  - `webserver`: REST API, User & Project Management
  - `utilities`: Gemeinsame Konstanten und Helper

### Tier 3: Data Layer (Database)
- **PostgreSQL**
- Container: `securecheckplus_db`
- Port: 5432

## Hauptkomponenten

### Backend: Analyzer App (`analyzer/`)
**Modelle:**
- `Project`: Verwaltete Projekte
- `Dependency`: Dependencies mit Versionierung
- `CVEObject`: CVE Informationen (CVSS, EPSS, etc.)
- `Report`: Verbindung zwischen Dependency und CVE mit Status

**Eigenschaften:**
- CVE-Daten-Integration (NVD API)
- Risk-Score Berechnung basierend auf EPSS
- Dependency Tracking pro Projekt
- Status-Management (REVIEW, NO_THREAT, THREAT_FIXED, etc.)

### Backend: Webserver App (`webserver/`)
**Modelle:**
- `User`: Authentifizierung & Benachrichtigungen
- `UserWatchProject`: Many-to-Many Beziehung User ↔ Project

**Funktionalitäten:**
- REST API für Frontend
- User Management (Favoriten, Verlauf)
- LDAP Integration (optional)

## Docker Compose Services

### Development Setup (docker-compose-preview.yml)

1. **securecheckplus_frontend**
   - Build: `./frontend` (Dev-Modus)
   - Environment: `REACT_APP_API_URL=""` (Same-Origin via Nginx Proxy)
   - Exposes: Port 3000

2. **securecheckplus_server**
   - Build: `./backend` (target: dev)
   - Environment: Django Config (SECRET_KEY, DB-Credentials, etc.)
   - Volumes: `./backend:/backend` (Hot-Reload)
   - Exposes: Port 8005 → 8000 (intern)
   - Dependencies: PostgreSQL, SMTP Mailserver

3. **securecheckplus_db**
   - Image: postgres (latest)
   - Environment: DB Credentials
   - Exposes: Port 5432

4. **smtp_mailserver**
   - Image: maildev/maildev
   - Purpose: Email Testing
   - Exposes: Port 1080 (MailDev UI)

## Häufige Kommandos

### Backend starten/stoppen
```bash
# Mit Preview Compose
docker-compose -f docker-compose-preview.yml up --build

# Mit Logs
docker-compose -f docker-compose-preview.yml logs -f securecheckplus_server

# Backend-Shell betreten
docker exec -it securecheckplus_server sh
```

### Datenbank-Operationen
```bash
# In der Container-Shell:
python manage.py migrate
python manage.py createsuperuser
python manage.py showmigrations
```

### Tests ausführen
```bash
# Im Backend Container
python manage.py test

# Mit Coverage
pytest --cov=analyzer --cov=webserver
```

## Konfiguration

### Umgebungsvariablen (backend)
- `IS_DEV`: Development-Modus (True/False)
- `FULLY_QUALIFIED_DOMAIN_NAME`: Frontend URL (für CORS)
- `DJANGO_SECRET_KEY`: Sicherheitsschlüssel
- `POSTGRES_*`: Datenbankzugangsdaten
- `NVD_API_KEY`: National Vulnerability Database API-Key
- `ADMIN_USERNAME/PASSWORD`: Superuser-Credentials
- `USER_USERNAME/PASSWORD`: Normaler User

### LDAP Integration (Optional)
- `LDAP_HOST`: LDAP Server
- `LDAP_ADMIN_DN`: Admin Distinguished Name
- `LDAP_ADMIN_PASSWORD`: Admin Passwort
- `LDAP_USER_BASE_DN`: User Search Base
- `LDAP_ADMIN_GROUP_DN`: Admin Group DN
- etc.

## Problembehebung

### Issue: "Your models in app(s): 'analyzer' have changes"
**Lösung:**
Nur manuell in der Entwicklung ausführen (nicht automatisch beim Container-Start):
```bash
python manage.py makemigrations
python manage.py migrate
```

### Issue: "The directory '/backend/assets' does not exist"
**Lösung:**
```bash
mkdir -p backend/assets
touch backend/assets/.gitkeep
```

### Issue: CSRF deactivated warnings
**Erklärung:** Normal in DEV-Modus, da HTTP verwendet wird. In PROD automatisch HTTPS erzwungen.

## Migrationen Management

### Migrationsdatei Struktur
- `analyzer/migrations/0001_initial.py`: Erste Migrationsdatei
- `analyzer/migrations/0002_initial.py`: ForeignKey & Relations Setup

Beim Refactoring müssen neue Migrationen erstellt werden:
Manuell durch Entwickler, bevor Änderungen committed werden:
```bash
python manage.py makemigrations analyzer webserver
python manage.py migrate
```

## Best Practices für Entwicklung

1. **Immer in der Container-Shell arbeiten** für Datenbank-Operationen
2. **Hot-Reload aktiviert**: Änderungen am Backend werden automatisch neu geladen
3. **Migrationen versionieren**: Nach Model-Änderungen `makemigrations` ausführen
4. **Environment-Variablen nutzen**: Für Dev/Prod-Unterschiede
5. **Tests schreiben**: Vor Production-Deployment testen

## Nächste Schritte (3Tier-Refactoring)

- [ ] Alle Migrationen generieren und testen
- [ ] API-Layer vollständig separieren
- [ ] Frontend-Komponenten refaktorieren
- [ ] Authentifizierung erweitern
- [ ] Performance-Testing durchführen

