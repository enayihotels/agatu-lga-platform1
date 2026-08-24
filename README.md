# AgatuConnect â€” Agatu Local Government Area Digital Platform

Phase-by-phase build. See `docs/blueprint.md` for the full architecture.

## Phase status
- [x] Phase 0 â€” Environment & repo setup
- [x] Phase 1 â€” Backend skeleton + custom User model
- [x] Phase 2 â€” Core content apps (wards, history, news, events)
- [ ] Phase 3 â€” Media & file uploads
- [ ] Phase 4 â€” Accounts, roles, auth (JWT)
- [ ] Phase 5 â€” Alerts, notifications, Celery/Redis
- [ ] Phase 6 â€” Citizen reports
- [ ] Phase 7 â€” AI assistants (Ollama + Claude)
- [ ] Phase 8 â€” Frontend setup
- [ ] Phase 9 â€” Public pages
- [ ] Phase 10 â€” Admin dashboard
- [ ] Phase 11 â€” Testing & polish
- [ ] Phase 12 â€” Dockerize for production
- [ ] Phase 13 â€” Deploy to Render
- [ ] Phase 14 â€” Post-launch

## Local development (Phase 2 checkpoint)

```bash
cp .env.example .env
docker compose up db redis
docker compose run --rm backend python manage.py migrate
docker compose run --rm backend python manage.py createsuperuser
docker compose run --rm backend python manage.py seed_wards
docker compose up backend
```

Visit http://localhost:8000/admin/ and log in with the superuser you created.
Visit http://localhost:8000/api/health/ to confirm the API is alive.

New in Phase 2 â€” try these endpoints:
- `GET /api/wards/` â€” the 10 real Agatu wards (Egba, Enungba, Obagaji, Odugbeho,
  Ogbaulu, Ogwule Ogbaulu, Ogwule-Kaduna, Okokolo, Oshigbudu, Usha), seeded by
  `seed_wards`
- `GET /api/history/leaders/` â€” leader/history archive (empty until you add entries via `/admin/`)
- `GET /api/history/culture/?category=proverb` â€” culture & language vault, filterable by category
- `GET /api/news/posts/` and `GET /api/news/flashes/` â€” news articles and the homepage ticker
- `GET /api/events/` and `POST /api/events/<slug>/rsvp/` â€” events + RSVP toggle
