# Verdant · AI Crop Disease Detector

Responsive Next.js application with Supabase Auth, private image storage,
Postgres scan history, row-level access policies, realtime scan updates, and a
FastAPI image-inference service.

### Key Features
- 🌿 **Zero-Jargon Farmer Disease Guidance**: Instant root causes, prevention guidelines, first aid, organic recipes (neem oil, baking soda), and commercial chemical treatments with precise dosages and withholding periods.
- 🎨 **Readable Modern Typography**: Comfortable 14px–16px body text, 20px–36px headings, and elevated 16px cards with soft green/amber borders.
- 📹 **Multimedia Scanning**: Drag-and-drop leaf photo uploads, short video clips (.mp4/.webm), and live camera walk-around scanning with automated high-clarity frame extraction.
- 📞 **Live Plant Doctor Consultation**: Interactive Voice & Video call modal with Senior Agronomist Dr. Ramesh Patel, live call timer, call controls, and instant report sharing.
- 🌱 **Interactive AI Agronomist Chatbot**: "Ask Verdant AI" embedded directly under the diagnosis and accessible via floating drawer across all pages, answering custom questions and quick-prompt chips.

## Start the app locally

Prerequisites: Python and pip (Python 3.14.3 was used for validation), Node.js
20.9 or newer with npm, and a Supabase project.

1. Create a Supabase project.
2. In the Supabase SQL editor, apply the migration files in
   [`supabase/migrations/`](./supabase/migrations/) in timestamp order:
   [`20261012000000_initial_schema.sql`](./supabase/migrations/20261012000000_initial_schema.sql),
   [`20261015000000_reconcile_legacy_disease_catalog.sql`](./supabase/migrations/20261015000000_reconcile_legacy_disease_catalog.sql),
   [`20261016000000_reconcile_legacy_scan_schema.sql`](./supabase/migrations/20261016000000_reconcile_legacy_scan_schema.sql),
   then
   [`20261016100000_expand_worldwide_plant_database.sql`](./supabase/migrations/20261016100000_expand_worldwide_plant_database.sql).
   For an existing project, first confirm its migration history and apply only
   migrations it has not already received, in the same order. The initial
   schema creates the disease catalog, scan and feedback tables, indexes,
   user-scoped RLS policies, the private `crop-scans` bucket, and Realtime
   publication. The later migrations reconcile legacy disease and scan
   schemas, then expand the catalog with detailed disease guidance.
3. From the project root, create a virtual environment and install backend
   dependencies:

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env`; set the Supabase project URL and **public**
   publishable key. The backend also accepts the legacy anon key as
   `SUPABASE_ANON_KEY`. Do not use or expose a service-role key.
5. Copy `frontend/.env.local.example` to `frontend/.env.local`; set the same
   Supabase URL and public publishable key, plus the API URL if it differs
   from `http://127.0.0.1:8000`. The frontend also accepts the legacy anon key
   as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. In the project root, start FastAPI:

   ```powershell
   .\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
   ```

   On Windows, run without `--reload` if Uvicorn reports socket permission
   error 10013 while starting its reload watcher.

7. In a second terminal, start Next.js:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:3000`. Use `/docs` on the API origin for FastAPI's
   interactive documentation.

The frontend supports password sign-in, password-based account creation, and
email one-time-code sign-in. To receive six-digit email codes, set the
Supabase Auth email template to include `{{ .Token }}` (rather than only a
confirmation link). Configure an SMTP provider in Supabase Auth for reliable
delivery to your address; the built-in sender may be restricted or rate
limited. The frontend's Supabase URL and public key stay in
`frontend/.env.local`. The API validates Supabase access tokens and uses the
caller's token for PostgREST and Storage, so row-level security stays enabled
without a service-role key.

## Enable actual crop diagnoses

The workspace includes `models/plant_disease.keras` and
`models/labels.json`, with labels in model-output order. The configured model
loads successfully and returns finite scores for all 48 classes in a local
inference smoke test. This verifies model loading and inference plumbing, not
prediction accuracy; validate it against representative, labeled field images.
If replacing the model, configure `.env`:

```dotenv
MODEL_PATH=models/plant_disease.keras
MODEL_LABELS_PATH=models/labels.json
MODEL_NORMALIZATION=0_1
```

The model must accept a batch of RGB images in NHWC layout and produce one
score per label. Select `minus1_1` only if that matches the model's training
preprocessing. If the configured model is unavailable, `/api/v1/diagnose`
returns HTTP 503 and no scan or image is stored.

## API

- The frontend supports Supabase password sign-in and email-code sign-in;
  the API validates bearer tokens with Supabase Auth before accessing private
  data.
- `GET /health` — database, Storage bucket, model, and diagnosis readiness.
- `GET /api/v1/diseases` and `GET /api/v1/diseases/{id}` — public catalog.
- `POST /api/v1/diagnose` — authenticated JPEG/PNG/WebP multipart upload,
  inference, private Storage upload, and user-owned scan insert.
- `GET /api/v1/scans` and `GET /api/v1/scans/{id}` — authenticated history.
- `GET /api/v1/scans/{id}/image` — short-lived signed URL for the user's image.
- `POST /api/v1/feedback` — authenticated feedback persistence.

The web dashboard subscribes to the authenticated user's scan changes using
Supabase Realtime and refreshes its history when changes arrive. If Realtime is
unavailable, scan history falls back to automatic refreshes every 30 seconds.
Realtime is optional; diagnosis uploads require the private Storage bucket and
policies created by the migrations above. Disease recommendations are general
guidance, not a substitute for local agronomic advice or product-label
instructions.

## Validation

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
cd frontend
npm run lint
npm run build
```

Backend tests use a test-only Supabase adapter; they do not claim that your
external Supabase project is connected. The health endpoint and an authenticated
live API request verify connectivity once you configure your project.
