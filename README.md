# GitHub Repo Analyzer

An AI-powered web app that analyzes any public GitHub repository. Paste a repo URL and chat with an AI assistant that explains the codebase, answers questions about its structure, and helps you understand how the project works.

## Features

- **Repo URL input** — paste any GitHub repository URL to start analysis
- **AI chat interface** — ask questions about the repo in plain language (architecture, how it works, what a file does)
- **Streaming-style chat UX** — message history, loading states, timestamps
- **Modern UI** — Tailwind CSS v4 + shadcn/ui components, dark-mode friendly, responsive
- **Extras included** — examples of WebSocket usage, a file-download helper, and a mini-services folder

## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4, shadcn/ui (Radix), lucide-react icons
- Prisma ORM with SQLite (`db/custom.db`)
- next-auth for authentication, next-intl for i18n
- LLM via the `z-ai-web-dev-sdk` (`/api/chat` route)

## Project structure

```
src/
  app/            # App Router pages, layout, globals.css
    api/chat/     # chat API route (POST) — calls the LLM
  components/ui/  # shadcn/ui components
  hooks/          # shared hooks
  lib/            # utilities
prisma/           # Prisma schema (User, Post models)
db/custom.db      # local SQLite database
examples/         # WebSocket example
download/         # file-download helper
mini-services/    # small service experiments
```

## Quick start

```bash
# install dependencies (bun or npm)
bun install

# configure environment
cp .env.example .env   # then set DATABASE_URL and your Z-AI API key

# generate Prisma client + push schema
bunx prisma generate
bunx prisma db push

# run the dev server
bun dev
```

Open http://localhost:3000, paste a GitHub repo URL, and ask the assistant questions about it.

## Environment variables

| Variable      | Required | Purpose                                  |
|---------------|----------|------------------------------------------|
| `DATABASE_URL` | Yes      | SQLite connection string for Prisma      |
| Z-AI API key  | Yes      | API key for `z-ai-web-dev-sdk` chat calls |

## Deploy notes

The `/api/chat` route is dynamic and needs server-side execution, so this app does not support static export. Deploy on a Node-compatible host (Vercel/Netlify/Render) with `DATABASE_URL` and the Z-AI API key set. Build: `next build`, start: `node .next/standalone/server.js`.

## License

Free to use. Built by [Girish Lade](https://ladestack.in).
