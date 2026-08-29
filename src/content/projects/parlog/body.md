## Overview

The brief was to make Trinidad & Tobago's Parliament legible and accountable to citizens — the official Parliament site publishes only raw PDFs with no structured or searchable layer. Parlog TT automates a two-phase ingestion pipeline (Python scrapers → TypeScript importers → PostgreSQL) that processes parliamentary records back to 2002, parsing hundreds of thousands of speeches across approximately 1.3 GB of PDFs.

## Highlights

- Bespoke promise and commitment extraction engine with evidence linking and stale-detection
- Full-text search powered entirely by PostgreSQL GIN indexes — no external search service
- Per-politician quarterly metrics with printable PDF report cards
- Hansard, bill, and committee data ingested and structured for the first time in a publicly usable format
- Containerised with Docker; authentication via NextAuth; email delivery via Nodemailer
