# IBO Mastery OS (Adhrit + Sar)

Production-oriented Next.js blueprint and scaffold for a **two-profile International Business Olympiad mastery platform** optimized for a 4-month international-winning preparation cycle.

## 1) Product Definition

IBO Mastery OS is a private, two-user, data-driven learning operating system for:
- **Adhrit**
- **Sar**

It solves the exact competitive problem: moving from broad study to competition-grade performance across prelim objective questions, interactive objective case analysis, and open case strategy/presentation.

### Why this architecture supports winning
- Hard-locked two-profile auth (no generic classroom account model).
- Real persistence via PostgreSQL + Prisma (not localStorage).
- Mastery computed from performance signals (accuracy, retention, speed, case quality), not fake completion bars.
- Structured collaboration checkpoints with readiness criteria and shared visibility.
- Interleaved, spaced, retrieval-heavy daily engine aligned to a 16-week macro plan.

## 2) Core Stack (Vercel-ready)

- **Next.js 15 + App Router + TypeScript**
- **Tailwind CSS** for a premium, focused UI
- **Prisma + PostgreSQL (Neon/Supabase/RDS)**
- **HTTP-only JWT session cookie** for auth session continuity
- **Zod-ready request validation pattern**

### Environment variables
```bash
DATABASE_URL=postgresql://...
AUTH_SECRET=long-random-secret
NEXT_PUBLIC_APP_NAME=IBO Mastery OS
```

## 3) Authentication Model (exactly two users)

- Entry route: `/select` shows exactly two profile cards.
- `/profile/adhrit` and `/profile/sar` handle both first-time setup and returning login.
- First setup:
  1) detect whether profile exists,
  2) enforce strong password + confirmation,
  3) hash with bcrypt(12),
  4) initialize profile records + mastery row,
  5) redirect into authenticated app.
- Returning login:
  - verify bcrypt hash,
  - issue JWT in secure HTTP-only cookie (`ibo_session`),
  - redirect to `/dashboard`.

## 4) Shared vs Private Data Contract

### Private-only
- raw attempts, per-question timings, private notes, confidence values, weak-area internals.

### Team-visible summary
- partner overall mastery %,
- partner current phase/module,
- partner checkpoint readiness,
- checkpoint meeting completion logs,
- momentum indicator.

## 5) Full Route / Page Map

### Auth + entry
- `/` → redirect to `/select`
- `/select` → profile picker (Adhrit/Sar)
- `/profile/[slug]` → setup/login screen
- `POST /api/auth/init`
- `POST /api/auth/login`

### App core
- `/dashboard` → today plan, mastery, next action, checkpoint status
- `/roadmap` → 0→100 macro progression map
- `/team` → side-by-side progression + meeting logs
- `/practice` → timed prelim drills + mixed sets
- `/cases` → objective case + open case lab
- `/analytics` → readiness + trends + weak heatmap

### Next planned routes (scaffold extension)
- `/modules/[moduleSlug]`
- `/books`
- `/reader/[bookId]/[sectionId]`
- `/flashcards`
- `/review`
- `/settings`

## 6) Feature Architecture (implementation-level)

### 6.1 Dashboard Engine
Inputs: `DailyPlan`, `MasteryMetric`, due `ReviewQueueItem`, `ReadingProgress`, `UserCheckpoint`.
Output cards:
- start session CTA,
- warm-up due cards,
- reading block,
- objective drill,
- case drill,
- meeting prep,
- end-session recap.

### 6.2 Daily Plan Generator
Daily plan builds a sequence:
1. 10-min warm retrieval from due weak tags.
2. 30–45 min targeted reading.
3. 8–15 question timed set.
4. 12-min flashcard review.
5. case / framework block (phase-aware).
6. recap + reflection.

Algorithm factors:
- current phase,
- overdue review items,
- weak-area severity,
- upcoming checkpoint criteria,
- partner lag/lead status.

### 6.3 Practice Engine
- Question pools tagged by syllabus + concept tags + difficulty.
- Mode types: prelim / objective-case / mixed.
- Per attempt captures: answer, correctness, speed, optional confidence.
- Immediate debrief with rationale and elimination logic.
- Wrong answers auto-create/boost WeakArea + ReviewQueue entries.

### 6.4 Flashcards + Spaced Repetition
- Global card library (`Flashcard`) + user scheduling state (`UserFlashcard`).
- SM-2-like interval update (`intervalDays`, `easeFactor`, `dueAt`).
- Supports concept cards, ratio/formula cards, framework cards, mistake-derived cards.

### 6.5 Case Lab
#### Objective case (MedPhara style)
- data table/chart blocks,
- timed MCQ sequence,
- per-question reasoning debrief,
- speed and inference quality metrics.

#### Open case (Coffee Busters style)
- structured answer builder:
  - context,
  - objective,
  - options,
  - criteria,
  - recommendation,
  - risks/mitigations,
  - implementation.
- rubric scoring dimensions: logic, feasibility, strategy fit, communication.

### 6.6 Team Coordination
- `MeetingCheckpoint` defines intent + criteria.
- `UserCheckpoint` tracks individual readiness and evidence payload.
- Checkpoint status logic:
  - **Not ready**: one/both criteria unmet.
  - **Ready (one user)**: visible to partner.
  - **Ready (both)**: meeting CTA highlighted.
  - **Completed**: logged timestamp + actor; does not block solo progression.

### 6.7 Analytics / Mastery
- topic-level and global readiness trends.
- retention decay and recovery charts.
- speed-vs-accuracy balance monitoring.
- exam readiness projections: prelim, objective case, open case, presentation, overall.

## 7) Mastery % Logic (non-arbitrary)

`overall_mastery =`
- 16% completion depth,
- 20% quiz accuracy,
- 16% retention score,
- 10% speed under pressure,
- 10% consistency/streak quality,
- 14% case performance,
- 8% framework readiness,
- 6% weak-area resolution.

Implementation exists in `src/lib/mastery.ts` and can be expanded per topic and per phase gate.

## 8) 4-Month Competitive Roadmap

### Phase 1 (Weeks 1-4): Foundation
Know:
- finance statements/ratios,
- core marketing + strategy vocabulary,
- baseline global/business ethics map.
Do:
- 120 prelim Q,
- first retrieval habit,
- first framework fluency.
Books emphasized:
- Strategic Management,
- McKinsey Way,
- Case In Point (intro).
Meetings:
- **CP1** framework alignment,
- **CP2** finance interpretation.

### Phase 2 (Weeks 5-8): Systems & Application
Know:
- integrated chapter interactions,
- stronger quant interpretation.
Do:
- objective case drills,
- first open-case structured outputs.
Books:
- Case In Point,
- Crack the Case,
- Pyramid Principle.
Meetings:
- **CP3** objective-case sync,
- **CP4** open-case framework rehearsal.

### Phase 3 (Weeks 9-12): Advanced Synthesis
Know:
- global entry strategy nuance,
- ethics/CSR strategic positioning.
Do:
- high-speed mixed sets,
- board-style recommendation defense.
Books:
- BCG on Strategy,
- Say it with Charts,
- Slide:ology, Visualizing This, Napkin.
Meetings:
- **CP5** market entry debate,
- **CP6** verbal pressure test.

### Phase 4 (Weeks 13-16): Mastery + Simulation
Know:
- weak links only (targeted elimination).
Do:
- full competition simulation cycles,
- final strategic narrative alignment.
Books:
- Trusted Advisor (delivery polish) + selective reinforcement rereads.
Meetings:
- **CP7** mock finals,
- **CP8** final tactical synchronization.

## 9) Syllabus Modeling Strategy

All 7 chapters are represented as `SyllabusModule` + `Lesson` + question tags. Every subtopic maps to:
1. lesson objects,
2. concept tags,
3. retrieval/flashcard hooks,
4. question pools,
5. readiness criteria for meeting and exam gates.

## 10) Database Model Coverage

Implemented Prisma schema includes:
- `User`, `MasteryMetric`,
- `SyllabusModule`, `Lesson`,
- `Book`, `BookSection`, `ReadingProgress`,
- `Question`, `QuestionAttempt`,
- `WeakArea`, `ReviewQueueItem`,
- `Flashcard`, `UserFlashcard`,
- `MeetingCheckpoint`, `UserCheckpoint`,
- `DailyPlan`, `CaseSession`,
- `AnalyticsSnapshot`, `Note`.

This provides complete persistence for cross-device continuity and team sync.

## 11) Meeting Checkpoint System (exact logic)

Each checkpoint stores:
- objective,
- unlock week,
- `gatingCriteria` JSON (required modules, min accuracy, minimum case score, review completeness),
- per-user readiness/evidence,
- completion event.

Readiness evaluator (server-side cron/API):
1. validate module completion threshold,
2. validate accuracy/time targets,
3. validate weak-area severity below threshold,
4. validate required case attempts.

If criteria met:
- mark `UserCheckpoint.ready=true`.
- partner sees “X ready for CPn”.
When both ready:
- highlight “Schedule/Run Meeting”.
After meeting:
- `POST /api/checkpoints/complete` marks completed and logs actor/time.

## 12) UI / UX System

Design principles:
- minimal premium cards,
- confident typography,
- strong whitespace and hierarchy,
- no clutter or gimmified UI,
- quick “what next” clarity on every key screen.

Component system planned:
- app shell/nav,
- status chips (ready/waiting/completed),
- mastery ring + trend sparkline,
- task stack cards,
- checkpoint timeline,
- analytics chart panels.

## 13) Suggested Folder Architecture

```txt
src/
  app/
    (auth)/select
    (auth)/profile/[slug]
    (app)/dashboard
    (app)/roadmap
    (app)/team
    (app)/practice
    (app)/cases
    (app)/analytics
    api/auth/init
    api/auth/login
    api/checkpoints/complete
  components/
  data/
  lib/
prisma/
  schema.prisma
```

## 14) Immediate Next Build Steps (from this scaffold)

1. Add middleware route guard for all `(app)` routes using `ibo_session`.
2. Add first migration + seed (modules, books, checkpoints, question skeletons).
3. Implement daily-plan generator service and nightly regeneration job.
4. Build practice runner with timer + answer explanation UI.
5. Implement flashcard queue and spaced repetition scheduler endpoint.
6. Add real-time checkpoint state updates (SSE/Pusher/Ably).
7. Add analytics charts + readiness projection models.
8. Add full module/reader pages and importable content pipeline.

---

This repository now contains the production-ready architectural base and persistence model required to begin full implementation immediately.

## Build reliability on Vercel / local

To avoid `@prisma/client did not initialize yet` errors:
- `postinstall` now runs `prisma generate` automatically.
- `build` now runs `prisma generate && next build`.

So local setup is simply:
```bash
npm install
npm run build
npm run dev
```

If your environment blocks npm registry access, you must run these on your local machine/CI with normal npm access.
