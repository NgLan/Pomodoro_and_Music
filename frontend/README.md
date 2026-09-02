# Cappucino không đá không đường — Frontend

Next.js frontend for the Pomodoro and Music application. The shared foundation
uses Tailwind CSS 4, shadcn/ui (Radix), next-intl, TanStack Query, React Hook
Form, Zod, Sonner, and a generated Hey API client.

## Local development

Use Node.js 22 or newer, then install dependencies and start the app:

```bash
npm ci
npm run dev
```

The frontend runs at `http://localhost:5173`. The default backend URL is
`http://localhost:3000`; override it in `.env.local` when needed:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
```

Only browser-safe values may use the `NEXT_PUBLIC_` prefix.

## API contract workflow

With the backend running, refresh the committed OpenAPI snapshot and regenerate
the client:

```bash
npm run api:pull
npm run api:generate
```

Set `OPENAPI_INPUT` to pull from a different Swagger endpoint. Files under
`src/api/generated/` are generated artifacts and must not be edited manually.
`npm run api:check` regenerates them and fails when the committed client drifts
from `openapi/openapi.json`.

## Quality commands

```bash
npm run format:check
npm run lint
npm run type-check
npm run test
npm run build
```

The same sequence runs in `.github/workflows/frontend-ci.yml`.
