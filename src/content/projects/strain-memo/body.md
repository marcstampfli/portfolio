## Overview

Strain Memo is a private, offline-first PWA built to track cannabis sessions without sacrificing privacy — no account, no backend, no analytics. The entry form takes under 30 seconds; richer annotation (effect, symptom, and flavor sliders, timed notes, tags) can be filled in after the fact.

## Highlights

- All data lives in IndexedDB via Dexie — nothing leaves the device
- Insights dashboard surfaces strain leaderboards, time-of-day patterns, and symptom-based recommendations with minimum-sample-size enforcement
- Versioned JSON export/import with SHA-256 integrity checks for portable, verifiable backups
- Installable as a PWA with full offline support via Workbox service worker
- PDF export via jsPDF; test coverage with Vitest
