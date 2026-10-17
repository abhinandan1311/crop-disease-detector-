# Copilot Instructions

## Project architecture

- This repository combines a FastAPI service at the root with a Next.js App Router frontend in `frontend/`. The root `README.md` is the source of truth for local setup, environment variables, and Supabase migration steps.
- `main.py` owns the `/api/v1` HTTP surface: it validates uploads and bearer tokens, runs diagnosis, and coordinates scan, image, disease, and feedback operations. `ai_engine.py` loads the Keras model and its ordered labels; the preprocessing and normalization must stay compatible with that model.
- `supabase_client.py` is the backend's async Supabase gateway for Auth, PostgREST, and Storage. Backend database and Storage calls use the caller's access token so Supabase RLS remains in force.
- The frontend entry point in `frontend/src/app/page.tsx` combines `AuthProvider` with `CropDashboard`. Supabase browser auth and Realtime are handled on the frontend; application data and diagnosis requests go through `frontend/src/lib/api.ts` to FastAPI.
- SQL migrations under `supabase/migrations/` define the database, RLS, and Storage setup. The initial schema is `20261012000000_initial_schema.sql`; later migrations reconcile legacy schemas/catalogs and expand the disease catalog. In particular, `20261016000000_reconcile_legacy_scan_schema.sql` creates the private `crop-scans` bucket and user-folder policies. Follow the root README's project-state-specific guidance, check the target project's migration state, and apply migrations in order to the intended project; do not assume a local test database is the remote project.

## Build, test, and lint

Run backend commands from the repository root:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
.\.venv\Scripts\python.exe -m unittest tests.test_backend.BackendApiTests.test_missing_storage_bucket_returns_migration_guidance -v
.\.venv\Scripts\python.exe -m unittest tests.test_supabase_gateway.SupabaseGatewayTests.test_upload_does_not_treat_missing_bucket_as_success -v
```

Run frontend commands from `frontend/`:

```powershell
npm run lint
npm run build
```

The frontend package does not define a test script. Backend tests are `unittest` cases: `BackendApiTests` exercises routes using a fake model and Supabase adapter, while `SupabaseGatewayTests` checks HTTP requests with `httpx.MockTransport`. They do not validate connectivity to or modify a live Supabase project.

## Repository conventions

- Keep API and database fields in `snake_case`; frontend API types in `frontend/src/lib/api.ts` mirror those response shapes.
- Add backend Supabase operations to `SupabaseGateway` and map upstream failures explicitly in `main.py`. Use the authenticated user's token for user-owned data and never introduce a service-role key into the frontend or request path.
- Keep uploaded scan objects private and scoped under `<user_id>/<scan_id>.<extension>`. The bucket name is configurable through `SUPABASE_IMAGE_BUCKET` and defaults to `crop-scans`; access is controlled by Storage RLS.
- Define backend request validation with Pydantic models and report API errors through explicit `HTTPException` responses. Check inference/model readiness before persisting a scan; unavailable inference must return an error without storing an image or scan.
- Keep browser-only state and Supabase interactions in client components. `AuthProvider` owns the auth session; `CropDashboard` uses that session for API requests and scan-history Realtime updates, with periodic refresh as the Realtime fallback.
- Use `apiRequest` for frontend calls to FastAPI so bearer-token handling and response errors stay consistent. Use the Supabase browser client for auth and Realtime, not as a replacement for the backend diagnosis flow.
- Treat `models/labels.json` as the class-index order for `models/plant_disease.keras`. Changes to model assets, input shape, image normalization, or labels must remain aligned with the inference checks in `ai_engine.py` and settings in `config.py`.
- When editing Next.js code, follow `frontend/AGENTS.md`; it requires consulting the relevant guide shipped with the installed Next.js version before changing framework APIs.
