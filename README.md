# RunRealm Admin Panel

Internal web dashboard for **RunRealm**, a location-based territory-capture running game. Built for operators to monitor activity, manage users, and run the anti-cheat review queue.

Premium dark UI with a neon-lime accent, glassmorphism cards, and the Outfit display font — matched to the mobile app's brand.

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** (dark theme, custom token palette)
- **react-router-dom v6** — routing + route guards
- **@tanstack/react-query** — server state / caching
- **axios** — API client with JWT bearer interceptor + single-flight refresh
- **recharts** — dashboard charts
- **lucide-react** — icons

## Setup

```bash
npm install
cp .env.example .env   # then edit if your API isn't on localhost:3000
npm run dev            # http://localhost:5173
```

Other scripts:

```bash
npm run build     # type-check (tsc -b) + production build to dist/
npm run preview   # serve the built dist/ locally
```

### Environment

| Variable            | Default                 | Description                    |
| ------------------- | ----------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | `http://localhost:3000` | Base URL of the RunRealm API (no trailing slash). |

Tokens are stored in `localStorage`. On a `401`, the axios interceptor performs
a single-flight refresh via `POST /auth/refresh` and replays the request; if
refresh fails it clears tokens and redirects to `/login`.

## Pages — all wired to the API via react-query

| Route            | Page              | Endpoints used                                                                 |
| ---------------- | ----------------- | ----------------------------------------------------------------------------- |
| `/login`         | Login             | `POST /auth/login`                                                            |
| `/`              | Dashboard         | `GET /admin/stats` — KPI cards + runs-over-time area chart + top-cities bar chart |
| `/users`         | Users             | `GET /admin/users` (search + pagination), `GET /admin/users/:id` (detail drawer) |
| `/runs`          | Runs & Anti-Cheat | `GET /admin/runs?status=`, `POST /admin/runs/:id/approve`, `POST /admin/runs/:id/reject` |
| `/territories`   | Territories       | `GET /admin/territories?cityId=` (leaderboard table + city filter)            |
| `/leaderboards`  | Leaderboards      | `GET /leaderboards/city/:cityId?period=week\|total`                            |
| `/settings`      | Settings / About  | App version, API base URL, sign out                                           |

All routes except `/login` are guarded by `ProtectedRoute`, which also renders
the app shell (collapsible sidebar + top bar).

### Runs & Anti-Cheat (the key page)

Tabbed table filterable by status (`all | validating | valid | flagged | rejected`).
The **Flagged** tab is the anti-cheat **review queue**: each run shows distance,
duration, avg speed, and the anti-cheat reasons as red chips, with **Approve**
(applies territory) and **Reject** (discards) buttons calling the admin
endpoints. Approving/rejecting invalidates the runs and stats queries so the
dashboard KPIs stay fresh.

## Project structure

```
src/
  main.tsx              # React entry
  App.tsx               # Router + QueryClientProvider + AuthProvider
  index.css             # Tailwind + theme base
  types.ts              # Shared API types
  lib/
    api.ts              # axios client, interceptors, typed endpoint helpers
    auth.tsx            # token storage + AuthContext/useAuth
    format.ts           # number/distance/duration/speed/time formatters
  components/ui/
    Card.tsx  Button.tsx  Badge.tsx  RankBadge.tsx  StatCard.tsx
    Table.tsx  Drawer.tsx  Sidebar.tsx  Topbar.tsx  ProtectedRoute.tsx
  pages/
    Login.tsx  Dashboard.tsx  Users.tsx  UserDetailDrawer.tsx
    Runs.tsx  Territories.tsx  Leaderboards.tsx  Settings.tsx
```

## Theme tokens

Defined in `tailwind.config.js`:

- `bg #0A0B0D`, `surface #15171A`, `border rgba(255,255,255,0.08)`
- `accent #C5F94B` (neon-lime), `accent-dim #9BD13A`
- `text #FFFFFF` / `text-muted #8A8F98`, `danger #FF4D6D`
- Territory relations: `owned #C5F94B`, `enemy #FF4D6D`, `neutral #6B7280`, `friend #3BA7FF`

## Notes

- The panel assumes the API matches the documented contract. If your backend
  differs (field names, pagination shape), adjust `src/types.ts` and the helpers
  in `src/lib/api.ts` — those are the only two files that touch the wire format.
- No backend is included; point `VITE_API_BASE_URL` at a running RunRealm API.
```
