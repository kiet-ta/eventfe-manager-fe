# Event Manager Frontend

Frontend scaffold for the Event Manager project using TanStack Start + React + Tailwind.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:3000`.

### Environment

- `VITE_API_BASE_URL`: Backend base URL (ví dụ `http://localhost:8080`)
- `VITE_RECAPTCHA_ENABLED`: `true`/`false`
- `VITE_RECAPTCHA_SITE_KEY`: bắt buộc khi bật reCAPTCHA

## Available scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run preview
npm run start
```

## Project structure

- `src/routes`: File-based routes
- `src/components`: Shared UI/components
- `src/lib`: Utilities
- `src/integrations`: Integration providers (e.g. TanStack Query)

## Next steps

- Add domain routes for event/listing/booking flows
- Connect backend APIs
- Add project-specific state, forms, and validation
