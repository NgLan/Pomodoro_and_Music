# Backend deployment

## Runtime contract

The production image is built from `backend/Dockerfile`, runs as the non-root
`node` user, listens on `0.0.0.0`, and starts the compiled ESM application with:

```text
node dist/main.js
```

Build and run it locally:

```bash
docker build -t pomodoro-backend:local backend
docker run --rm -p 3000:3000 --env-file backend/.env pomodoro-backend:local
```

The image declares port `3000`, while the runtime `PORT` variable remains the
application source of truth. Logs are written to stdout/stderr. The container
health check calls `GET /health/live`; deployment verification calls
`GET /health/ready`, which also checks PostgreSQL.

## Required configuration

Inject configuration at runtime. Never add `.env` files to the image.

| Variable            | Requirement                          |
| ------------------- | ------------------------------------ |
| `NODE_ENV`          | Set to `production` by the image     |
| `PORT`              | Optional; defaults to `3000`         |
| `DATABASE_URL`      | PostgreSQL connection URL            |
| `JWT_ACCESS_SECRET` | Secret with at least 32 characters   |
| `JWT_ACCESS_TTL`    | Positive duration, for example `15m` |
| `REFRESH_TOKEN_TTL` | Positive duration, for example `30d` |
| `YOUTUBE_API_KEY`   | YouTube Data API credential          |
| `FRONTEND_ORIGIN`   | Allowed HTTP(S) frontend origin      |
| `LOG_LEVEL`         | Optional; defaults to `info`         |

## Migration strategy

Development and test preserve the existing startup behavior: create a missing
local database and apply pending migrations. Production startup never creates a
database and never migrates concurrently. The CD release step runs the compiled
migrations once before deployment:

```bash
docker run --rm \
  --env NODE_ENV=production \
  --env DATABASE_URL \
  ghcr.io/owner/repository-backend:sha-COMMIT npm run migration:run:prod
```

A migration failure stops deployment. Schema changes must remain compatible
with the currently running version during rollout; use expand/migrate/contract
for breaking changes.

## CI and CD

`backend-ci.yml` runs on Backend-related pull requests and pushes to `main`. It
performs deterministic install, format check, lint, type-check, unit tests, E2E
tests, application build, and a production Docker build without pushing.

After a successful `main` push CI run, `backend-cd.yml`:

1. checks out the exact validated commit;
2. builds and pushes `ghcr.io/<owner>/<repository>-backend`;
3. tags it with immutable `sha-<commit>` and movable `latest` tags;
4. runs production migrations from the immutable image;
5. asks Render to deploy that exact image and waits for its deploy to become live;
6. polls the configured readiness URL for up to 60 seconds.

Create a GitHub Environment named `production` and configure:

| Name                 | Type                 | Purpose                                           |
| -------------------- | -------------------- | ------------------------------------------------- |
| `DATABASE_URL`       | Environment secret   | Migration database connection                     |
| `RENDER_API_KEY`     | Environment secret   | Least-privilege Render API token                  |
| `RENDER_SERVICE_ID`  | Environment variable | Render image-backed web service ID                |
| `BACKEND_HEALTH_URL` | Environment variable | Public backend base URL, without a trailing slash |

Configure Render as an image-backed Web Service whose default image repository
matches the GHCR repository above, disable Render auto-deploys, set its health
path to `/health/ready`, and inject the runtime variables from the previous
section. Grant Render `read:packages` access when the image is private. The
repository `GITHUB_TOKEN` is used only to publish the image.

For Supabase, prefer its direct connection for migrations when the runner has
IPv6 (or the IPv4 add-on). Otherwise use Supavisor session mode on port `5432`;
it supports persistent Backend connections and IPv4 GitHub runners. Do not put
the database connection string in Vercel client-visible variables. Set
`FRONTEND_ORIGIN` to the production Vercel origin.

## Portability boundary

The Backend does not import a Render, Vercel, or Supabase SDK. Its portable
contract consists only of an OCI image, environment variables, PostgreSQL,
compiled migration command, stdout/stderr logs, and HTTP health endpoints. To
move providers, retain the build/publish/migration jobs and replace only the
Render deploy steps plus environment-specific secrets.

## Rollback

Choose the last healthy `sha-<commit>` package version and trigger Render with
that immutable image URL. Database changes are forward-fixed by default; run
`migration:revert` only after verifying that the revert is safe for production
data and the application version being restored.

The resulting flow is:

```text
Developer -> pull request -> Backend CI -> merge to main -> Backend CD
-> GHCR image -> Supabase migration -> Render deploy -> readiness -> production
```
