# HeritageVault Monorepo

## Stack
- `apps/web`: Next.js + Tailwind + Framer Motion + Three.js + GSAP
- `apps/api`: Express + MongoDB + Firebase Storage + OpenAI fallback orchestration
- `packages/shared`: shared TypeScript contracts

## Run
1. Copy `.env.example` to `.env`
2. Install:
   - `cmd /c npm install`
3. Start both apps:
   - `cmd /c npm run dev`

## Routes
- Web:
  - `/`
  - `/auth`
  - `/upload`
  - `/success/:id`
- API:
  - `POST /auth/mock/login`
  - `POST /auth/mock/signup`
  - `POST /auth/mock/logout`
  - `POST /ai/transcribe`
  - `POST /ai/summarize`
  - `POST /ai/translate`
  - `POST /ai/media-analyze`
  - `POST /media/upload`
  - `POST /traditions`
  - `GET /traditions/:id`

## Notes
- Auth always succeeds by design for demo mode.
- If `OPENAI_API_KEY` / Firebase credentials are missing, deterministic fallback behavior keeps features working.
- If `MONGODB_URI` is missing, API stores records in memory fallback for demo continuity.
