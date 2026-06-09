# LAEMU Team-Backend

Internes **CMS / Backend**, mit dem das LAEMU-Team die Inhalte der
[Mitglieder-App](https://laemu-original.vercel.app) verwaltet:

- 🎵 **Instrumente** anlegen und ordnen
- 🎓 **Lehrgänge & Kurse** mit **Modulen** und **Lektionen** erstellen, bearbeiten,
  veröffentlichen — inkl. Video-Upload, Textinhalten und PDF-Verlinkung
- 📹 **Lernvideo-Datenbank** (Stücke) mit dem vollen Tag-System
  (Stil, Genre, Taktart, Auto-Tags), Schwierigkeit, Abo-Stufe (Free/Starter/Pro)
- 🎚️ pro Stück: **Stimmen** (1./2. Stimme, Begleitungen) mit eigenen Lernvideos,
  **Noten/PDFs**, Audio-Beispielen, **Mixer-Spuren**, Originalaufnahmen und Tonträgern
- 🏷️ **Tag-Vokabulare** pflegen
- 🧑‍🏫 **Lehrpersonen**-Profile
- ⭐ **Stückwünsche** der Community moderieren
- 🖼️ **Medienbibliothek** für hochgeladene Bilder, Videos, Audios und PDFs
- 👥 **Team-Verwaltung** mit Rollen (Admin / Redaktion / Lehrperson)

## Tech-Stack

- **Next.js 14** (App Router, Server Actions) + **TypeScript** + **Tailwind CSS**
  — gleiche Design-Tokens wie die LAEMU-Mitglieder-App
- **Prisma** ORM mit **SQLite** (Standard, kein Setup) — leicht auf **PostgreSQL** umstellbar
- Eigene, schlanke **Cookie-Session-Auth** (JWT via `jose`, Passwort-Hashing via `bcryptjs`)

## Schnellstart

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Umgebungsvariablen anlegen
cp .env.example .env
#   -> AUTH_SECRET unbedingt ändern (z.B. `openssl rand -base64 32`)

# 3. Datenbank erstellen, Client generieren und mit Demo-Daten befüllen
npm run setup

# 4. Entwicklungsserver starten
npm run dev
```

Danach erreichbar unter <http://localhost:3000> — Weiterleitung zum Login.

### Anmeldung / Zugang

Aktuell ist der **Login deaktiviert** (`AUTH_DISABLED="true"`, Standard): Es ist
**keine Anmeldung** nötig, `/` leitet direkt zur Inhaltsverwaltung `/admin` weiter.
Die Datenbank wird beim ersten Start **automatisch eingerichtet und befüllt** —
kein separates `npm run setup` erforderlich.

> ⚠️ In diesem Zustand hat jede Person mit der URL vollen Admin-Zugriff. Vor einem
> öffentlichen Deployment unbedingt absichern.

**Login wieder aktivieren** — in der Umgebung setzen:

```env
AUTH_DISABLED="false"
```

Dann gilt die normale Anmeldung. **Standard-Login** (beim Seed angelegt):

- E-Mail: `team@laemu.ch`
- Passwort: `laemu-team-2026`

> Passwort nach dem ersten Login unter **Team** ändern bzw. neue Mitglieder anlegen.

## Nützliche Skripte

| Befehl | Wirkung |
| --- | --- |
| `npm run dev` | Dev-Server |
| `npm run build` | Production-Build (inkl. `prisma generate`) |
| `npm run setup` | DB anlegen + Client generieren + seeden |
| `npm run db:seed` | Demo-Inhalte (idempotent) erneut einspielen |
| `npm run db:reset` | DB **zurücksetzen** und neu seeden |
| `npm run prisma:push` | Schema-Änderungen in die DB übernehmen |

## Datei-Uploads

Hochgeladene Dateien landen unter `public/uploads/` und sind als
`/uploads/<datei>` öffentlich erreichbar; jede Datei wird zusätzlich in der
**Medienbibliothek** (`MediaAsset`) registriert. In jedem Formular kann man
wahlweise eine Datei hochladen **oder** eine externe URL (Vimeo/YouTube/CDN)
eintragen.

> Hinweis für Deployment: Auf Plattformen mit kurzlebigem Dateisystem
> (z. B. Vercel-Serverless) bleiben lokal hochgeladene Dateien nicht erhalten.
> Für den Produktivbetrieb empfiehlt sich ein Objektspeicher (S3/R2) — die
> Upload-Route `src/app/api/upload/route.ts` ist dafür der einzige Anpassungspunkt.

## Auf PostgreSQL umstellen

1. In `prisma/schema.prisma`: `provider = "postgresql"`
2. In `.env`: `DATABASE_URL` auf die Postgres-Verbindung setzen
3. `npm run prisma:push && npm run db:seed`

## Datenmodell (Kurzüberblick)

```
Instrument ─┬─ Course (Lehrgang/Kurs) ── Module ── Lesson
            └─ Piece (Lernvideo) ─┬─ VoiceSection ─┬─ VoiceVideo
                                  │                 ├─ Sheet (Noten/PDF)
                                  │                 └─ AudioSample
                                  ├─ Sheet (Noten/PDF, allgemein)
                                  ├─ MixerMusician
                                  ├─ OriginalRecording
                                  ├─ Tontraeger
                                  └─ Teacher (n:m)
Tag · Wish · MediaAsset · TeamUser
```

Das Modell bildet 1:1 die Strukturen der LAEMU-Mitglieder-App ab
(`src/lib/academy.ts`, `src/lib/courses.ts` & die Lernvideo-Seiten im Frontend).
