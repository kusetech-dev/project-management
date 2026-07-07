<<<<<<< HEAD
# Freelance Project Tracker

A personal project management tool for tracking freelance work: projects, tasks,
time logs, payment installments, and notes — built with React, Tailwind v4, and Supabase.

## Running it locally

You'll need [Node.js](https://nodejs.org) installed (v18 or later).

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

Sign in with the account you created in Supabase Authentication → Users.

## Environment variables

Your Supabase credentials already live in `.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

This file is gitignored — never commit it if you push this to GitHub. If you ever
rotate your Supabase keys, just update the values here.

## How the data model works

- **Projects** move through a status lifecycle: Inquiry → Confirmed → In Progress →
  Completed (with On Hold / Cancelled as side states). You move a project through
  this manually from its Overview tab.
- **Installments** track payments. The first installment you add to a project is
  treated as the advance — once you mark it paid, you can confirm the project
  yourself.
- **Time logs** support a live start/stop timer (visible as a bar at the bottom of
  the screen no matter what page you're on) or manual backfill entries.
- **Tasks** are a flat checklist with low/medium/high priority.
- **Notes** can be general notes or questions. Questions get an "Open question"
  badge until you fill in an answer, at which point they flip to "Answered."

## Adding more accounts later

Go to your Supabase project → Authentication → Users → Add user. Make sure
"Auto Confirm User" is checked since there's no email-sending setup. Each account
only ever sees its own projects — that's enforced by Row Level Security on the
database itself, not just by the app.

## Project structure

```
src/
  lib/supabase.js          — Supabase client setup
  context/                 — Auth session + global timer state
  hooks/                   — Data access per entity (projects, tasks, time, etc.)
  components/               — Shared UI + per-tab components
  components/tabs/          — Overview, Tasks, Time, Payments, Notes tabs
  pages/                    — Login, Dashboard, Projects, ProjectDetail
  utils/format.js           — Money, date, duration formatting + status/priority config
```
=======
# project-management
>>>>>>> b41f94c858cb831b1833d3955475ba0d2b155b87
