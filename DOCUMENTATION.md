# Documentation (Backend + Deployment + Frontend notes)

## Backend overview

- **Framework**: **NestJS** (TypeScript).
- **API style**: Nest modules/controllers/services (see `backend/src/app.module.ts`).
- **Database**: **PostgreSQL** (hosted on **Supabase**).
- **ORM**: **Prisma** (schema in `backend/prisma/schema.prisma`).

### Backend folder structure (high level)

The backend lives in `backend/`.

- **`src/app.module.ts`**: Root Nest module wiring all feature modules.
- **`src/auth/`**: Auth feature (JWT strategy/guards, auth controller/service, role utilities).
- **`src/users/`**: User management (DTOs, controller, service, module).
- **`src/organizations/`**: Organizations feature (controller/service/module + DTOs).
- **`src/kpi/`**: KPI features (metrics/periods/targets/scores/statistics).
- **`src/payroll/`**: Payroll features (payrolls, payslips, stats).
- **`src/attendance/`**: Attendance + leave requests features.
- **`src/org-chart/`**: Org chart feature.
- **`src/dashboard/`**: Dashboard aggregation endpoints/services.
- **`src/prisma/`**: Prisma module/service integration for Nest.
- **`src/storage/`**: Storage integration (GCS usage in non-dev environments).
- **`src/common/`**: Cross-cutting concerns (logging, interceptors, filters, correlation-id middleware, DTOs).
- **`src/config/`**: Environment validation and config helpers (`env.validation.ts`, `env.config.ts`).

## Database (Supabase Postgres + Prisma)

- **Provider**: Postgres (Prisma `datasource db { provider = "postgresql" }`).
- **Connection envs**:
  - **`DATABASE_URL`**: main connection string used by Prisma Client at runtime.
  - **`DIRECT_URL`**: direct connection string used for migrations / admin operations.
- **Migrations on deploy**: The container startup command runs `npx prisma migrate deploy` before starting the server (see `backend/Dockerfile`).

### Where to get Supabase database URLs

In Supabase:

- Go to **Project Settings → Database → Connection string**.
- Use the **Transaction pooler** / **Session pooler** strings as appropriate for serverless environments.
- Store them as GitHub secrets:
  - `STAGING_DATABASE_URL`
  - `STAGING_DIRECT_URL`

## Environment variables (backend)

The backend validates required env vars via `backend/src/config/env.validation.ts`. Deployment also injects env vars in `.github/workflows/ci-cloudrun-backend.yml`.

### Runtime env vars (app)

These are set on Cloud Run during deploy (staging workflow).

| Variable | Required | Where it comes from | Notes |
|---|---:|---|---|
| `NODE_ENV` | Yes | Set by workflow (`staging`) | Also set in `backend/Dockerfile` as default. |
| `DATABASE_URL` | Yes | **GitHub secret** `STAGING_DATABASE_URL` | Supabase Postgres connection string. |
| `DIRECT_URL` | Yes | **GitHub secret** `STAGING_DIRECT_URL` | Supabase direct connection string (migrations). |
| `ACCESS_TOKEN_SECRET` | Yes | **GitHub secret** `STAGING_ACCESS_TOKEN_SECRET` | JWT access token signing secret. Generate a strong random secret. |
| `REFRESH_TOKEN_SECRET` | Yes | **GitHub secret** `STAGING_REFRESH_TOKEN_SECRET` | JWT refresh token signing secret. Generate a strong random secret. |
| `ACCESS_TOKEN_DURATION` | Yes | **GitHub variable** `STAGING_ACCESS_TOKEN_DURATION` | Example format depends on app usage (commonly `15m`, `3600s`, etc.). |
| `REFRESH_TOKEN_DURATION` | Yes | **GitHub variable** `STAGING_REFRESH_TOKEN_DURATION` | Example format depends on app usage. |
| `GCS_BUCKET_NAME` | In staging/prod | **GitHub variable** `STAGING_GCS_BUCKET_NAME` | Required when `NODE_ENV` is not `development`. Bucket must exist in GCP. |
| `SCHEDULER_TOKEN` | In staging/prod | **GitHub secret** `STAGING_SCHEDULER_TOKEN` | Required when `NODE_ENV` is not `development`. Used to authorize scheduler-like calls. |
| `PORT` | Optional | Not set in workflow | App has a default in validation; Cloud Run provides `PORT` automatically in many setups, but this deploy uses `--port=5000`. |
| `LOG_LEVEL` | Optional | Not set in workflow | Defaults to `info` if unset. |
| `SLOW_QUERY_THRESHOLD_MS` | Optional | Not set in workflow | Defaults to `1000` if unset. |

### CI/CD & deploy configuration (GitHub Actions)

These are used by `.github/workflows/ci-cloudrun-backend.yml` to build/push/deploy.

| Variable | Where it comes from | Purpose |
|---|---|---|
| `GCP_DEPLOYER_SA` | **GitHub secret** | JSON key for the deployer service account used by `google-github-actions/auth`. |
| `GCP_PROJECT_ID` | **GitHub secret** | Target GCP project id. |
| `GCP_REPO_REGION` | **GitHub variable** | Artifact Registry region (used in `${REGION}-docker.pkg.dev`). |
| `GCP_CLOUD_RUN_REGION` | **GitHub variable** | Cloud Run region for deploy. |
| `CLOUD_RUN_RUNTIME_SA_EMAIL` | **GitHub secret** | Service account email that the Cloud Run service runs as (`--service-account=...`). |

## Deployment (Docker + GCP Cloud Run + GitHub Actions)

- **Container build**: `backend/Dockerfile` builds the Nest app, generates Prisma client, exposes port **5000**, and runs migrations on startup.
- **CI/CD**: `.github/workflows/ci-cloudrun-backend.yml` builds the backend image, pushes it to **Artifact Registry**, then deploys to **Cloud Run** on pushes/PRs to the `staging` branch (backend-only path filter).
- **Scope**: This CI/CD pipeline is **for the backend only** and targets **GCP Cloud Run**. If you move to another vendor (AWS, Azure, Render, Fly.io, etc.), the workflow (auth, registry, deploy command, env injection) must be replaced/rewired.

### Required IAM roles for `GCP_DEPLOYER_SA`

The service account used by GitHub Actions (provided via `GCP_DEPLOYER_SA`) must have:

- **Cloud Run Admin** (`roles/run.admin`)
- **Artifact Registry Writer** (`roles/artifactregistry.writer`)
- **Service Account User** (`roles/iam.serviceAccountUser`) (so it can deploy a Cloud Run service that runs as `CLOUD_RUN_RUNTIME_SA_EMAIL`)

### Runtime identity on Cloud Run

- Cloud Run is deployed with `--service-account=${{ secrets.CLOUD_RUN_RUNTIME_SA_EMAIL }}`.
- GCP APIs (like GCS) should use **Application Default Credentials (ADC)** from that runtime service account (no embedded keys).

## Frontend note (caching/performance)

- The frontend uses **TanStack Query** (`@tanstack/react-query`) for **client-side caching, request deduping, and background refetching**, improving perceived performance and reducing redundant API calls.
- The global query client is configured in `frontend/src/lib/queryClient.ts`.

