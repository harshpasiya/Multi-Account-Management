# Multi-Account Trading Panel

A panel for managing multiple clients' Zerodha demat/trading accounts from one place — executing trades across accounts, tracking positions and P&L (aggregated and per-client), and generating periodic payout receipts based on a profit-share percentage.

> Frontend skeleton scaffolded via [Vercel v0](https://v0.dev), then extended with real backend integration. This repo exists for transparency into what v0 generated vs. what was built on top of it — see [Project history](#project-history) below.

---

## What this does

- **Execute trades across many client accounts at once** — place an order for a single account, a subset, or all active accounts in one action.
- **Track positions and trades**, both aggregated across everyone and drilled into a single client.
- **Generate payout receipts** for a given period per client — gross P&L, charges, and an editable profit-share percentage applied at report time.
- **Daily client re-authentication** — Zerodha/Kite Connect access tokens expire every day, so each trading day starts with a checklist screen where each client account is re-authenticated via TOTP/OTP before it can be traded.

This panel is deliberately scoped to **execution and management only**. Live price monitoring and market research happen in a separate system; this app doesn't pull market data or quotes.

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind + shadcn/ui | Scaffolded via Vercel v0 |
| Charts | Recharts | P&L trends, account-level charts |
| Hosting | Vercel | Functions pinned to `bom1` (Mumbai) for execution latency |
| Database | Supabase (Postgres) | Via the Vercel Marketplace integration |
| Scheduled jobs | Vercel Cron | Daily Kite access-token refresh, daily instrument-list refresh |
| Broker integration | Zerodha Kite Connect | Free Personal plan per client — order placement, positions, holdings, funds, instruments. No market-data calls. |
| Networking | Static IP | Required by Kite Connect for order placement (per developer account) |

### Why these choices

- **Supabase, not Vercel Postgres** — Vercel discontinued its native Postgres product; Supabase is the standard replacement via Vercel's marketplace, with environment variables synced automatically.
- **Free Kite Connect plan is enough** — order placement and account data (positions/holdings/funds) are free per API key. The paid ₹500/month tier only unlocks live market data and historical candles, which this app doesn't need since price monitoring lives elsewhere.
- **One Kite Connect API key per client** — Zerodha doesn't offer a single app that manages multiple client accounts. Each client has their own API key, their own daily access token, and their own independent rate limit (10 orders/sec, 400/min) — which is actually useful, since it means orders can be fired to all accounts in parallel without one client's activity throttling another's.
- **REST, not WebSocket** — no live ticker is used or needed, since this app doesn't display market data.
- **`bom1` region pinning** — Kite Connect's servers are in Mumbai; running Vercel functions in the same region avoids an unnecessary US↔India round trip on every order.

---

## Data model

- **`ClientAccount`** — a managed client: name, Zerodha client ID, capital contributed, profit-share %, status.
- **`Position`** — a live position for one account: symbol, quantity, avg/last price, P&L, product type.
- **`Trade`** — an individual order/fill: side, quantity, price, order type, status, charges.
- **`PeriodReport`** — a payout receipt for one client over a date range: gross P&L, charges, net P&L, and an editable profit-share amount / net payable, with a draft → finalized → sent → paid lifecycle.
- **`ClientSession`** — *daily and ephemeral*, separate from `ClientAccount`: tracks whether a client's Kite access token is authenticated for today (`not_started` / `awaiting_otp` / `active` / `expired` / `failed`). Reset by a scheduled job every trading day, independent of the account roster.

---

## Pages

| Route | Purpose |
|---|---|
| `/login` | Manager's own sign-in to the panel |
| `/session` | Daily checklist — re-authenticate each client account via TOTP/OTP before trading |
| `/` | Dashboard — aggregate AUM, today's P&L, open positions, top movers |
| `/accounts` | List of all client accounts |
| `/accounts/[id]` | Single client's positions, trades, and reports |
| `/trade` | Order ticket — place a trade for one, several, or all active accounts |
| `/positions` | All positions, aggregated by symbol or by account |
| `/trades` | Full trade log, filterable |
| `/reports` | Generate and manage payout receipts |
| `/settings` | Default profit-share %, charge assumptions, Kite Connect key management |

---

## Getting started

```bash
git clone <this-repo>
cd <repo>
npm install
```

Copy `.env.example` to `.env.local` and fill in:

```
# Supabase (auto-populated if connected via Vercel Marketplace)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Per-client Kite Connect credentials — see /docs/kite-setup.md
KITE_API_KEY_<CLIENT_ID>=
KITE_API_SECRET_<CLIENT_ID>=
```

```bash
npm run dev
```

### Daily operational flow

1. Manager signs in at `/login`.
2. Manager visits `/session` and enters the TOTP/OTP for each client account to refresh that day's Kite access token.
3. Once an account shows **Active**, it becomes available as a trade target on `/trade`.
4. At the end of a billing period, generate receipts from `/reports` per client, adjusting the profit-share split if needed before finalizing.

---

## Project history

This repo started from a UI skeleton generated by Vercel v0 from a scoped prompt (data model, page list, and explicit "mock data only" boundaries — see `/docs/v0-prompt.md`). Backend integration (Supabase schema, Kite Connect auth and order execution, report calculations, PDF receipt generation) was built on top of that skeleton afterward. Commit history reflects that split: early commits are v0-generated UI, later commits wire up real data and logic.

---

## Known constraints

- Kite Connect access tokens expire daily (~6:00 AM IST) — the `/session` re-authentication step is not optional, it's how Zerodha's API works.
- Order placement requires a static IP registered against the Kite Connect developer account.
- No live price data is fetched by this app by design — positions display `last_price` as returned by Kite's own `positions()`/`holdings()` calls, not a separate quote feed.
