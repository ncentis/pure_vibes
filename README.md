# Glass Box

Hackathon project in `ncentis/pure_vibes`.

## Team scaffold

Glass Box is the team's hackathon project. This repository provides the Next.js + TypeScript foundation for Vercel, Supabase, Stripe, and AI workflows. Start with:

```bash
nvm use
npm ci
npm run setup
# Fill in .env.local, then:
npm run dev
```

See [AGENTS.md](AGENTS.md) for team ownership, worktree-based agent setup, and PR workflow; [docs/TEAM_SETUP.md](docs/TEAM_SETUP.md) for service configuration; and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for integration boundaries. `origin` must point to `https://github.com/ncentis/pure_vibes.git`; the old George-owned repo is retired.

Run `npm run check`, `npm run format:check`, and `npm run build` before opening a PR. Local database tests require Docker (`npm run db:start`, then `npm run db:test`).
