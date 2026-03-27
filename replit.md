# IoT Competition Platform — Sensor Sprint

## Overview
A comprehensive IoT competition platform for organizing and proctoring technical challenges. Features a two-round structure, real-time proctoring, and an interactive wiring simulator.

## Project Structure
- **`app/`** — Next.js App Router pages and API routes
  - `app/admin/` — Admin dashboard (participant management, timers, proctoring)
  - `app/api/` — Backend API routes (participants, scenarios, components, leaderboard)
  - `app/participant/` — Participant-facing test interface
  - `app/round1/` — Round 1 (MCQ/matching/logic + wiring canvas)
- **`components/`** — Reusable UI components (shadcn/ui base + specialized IoT components)
- **`lib/`** — Core logic
  - `lib/db.ts` — In-memory store with file-based persistence (`.data/store.json`)
  - `lib/connection-evaluator.ts` — Wiring diagram grading
  - `lib/snippet-evaluator.ts` — Code snippet grading
- **`data/`** — SQLite database (`iot-event.db`) and static assets
- **`scripts/`** — Setup and seeding scripts
- **`tests/`** — Unit, integration, UI, and regression test suites

## Key Features
- Round 1: MCQs, matching, logic, wiring canvas (Wokwi-style)
- Round 2: IoT scenario building with "Fair Mode" hint system
- Real-time proctoring (tab switches, window focus, app whitelisting)
- Dynamic global timer synced across all participants
- Admin dashboard with live leaderboard

## Tech Stack
- **Framework:** Next.js 16.2 (React 19, App Router, Turbopack)
- **UI:** Tailwind CSS v4, Radix UI, shadcn/ui, Lucide React, GSAP
- **IoT Simulation:** `@wokwi/elements`, `@xyflow/react`
- **Data:** In-memory store + `.data/store.json` persistence + `better-sqlite3`
- **Testing:** Vitest, Testing Library

## Running the App
- **Dev server:** `npm run dev` (port 5000)
- **Build:** `npm run build`
- **Start (production):** `npm run start`
- **Seed Round 1 content:** `npm run round1:seed`

## Default Credentials
- Admin password: `admin123` (configurable via admin dashboard)

## Replit Configuration
- Port 5000 mapped to external port 80
- `next.config.mjs` includes `allowedDevOrigins` for all `*.replit.dev` subdomains
- Deployment: `npm run build` + `npm run start`
- Data persisted in `.data/store.json` (auto-created at runtime)
