# AgatuConnect — Agatu Local Government Area Digital Platform

Phase-by-phase build. See `docs/blueprint.md` for the full architecture.

## Phase status
- [x] Phase 0 — Environment & repo setup
- [x] Phase 1 — Backend skeleton + custom User model
- [ ] Phase 2 — Core content apps (history, news, wards, events)
- [ ] Phase 3 — Media & file uploads
- [ ] Phase 4 — Accounts, roles, auth (JWT)
- [ ] Phase 5 — Alerts, notifications, Celery/Redis
- [ ] Phase 6 — Citizen reports
- [ ] Phase 7 — AI assistants (Ollama + Claude)
- [ ] Phase 8 — Frontend setup
- [ ] Phase 9 — Public pages
- [ ] Phase 10 — Admin dashboard
- [ ] Phase 11 — Testing & polish
- [ ] Phase 12 — Dockerize for production
- [ ] Phase 13 — Deploy to Render
- [ ] Phase 14 — Post-launch

## Local development (Phase 1 checkpoint)

```bash
cp .env.example .env
docker compose up db redis
docker compose run --rm backend python manage.py migrate
docker compose run --rm backend python manage.py createsuperuser
docker compose up backend
```

Visit http://localhost:8000/admin/ and log in with the superuser you created.
Visit http://localhost:8000/api/health/ to confirm the API is alive.
