# SocialEngine
Social services storefront and private customer dashboard. Repository and existing Railway resource names remain `Social-Forge` / `socialforge-web`; the customer brand is SocialEngine. `socialengine.cc` is the intended domain, not yet connected.

## Current implementation
- Flat #275ddf storefront, platform navigation and shared footer; legacy demo carts remain usable.
- PostgreSQL accounts with scrypt passwords, HttpOnly sessions, CSRF/origin checks, rate limits, session expiry and password rotation.
- Private dashboard for orders, wallet, transactions, saved support requests and profile settings. No browser-local demo order becomes a real account order.
- Transactional wallet ledger with unique references, row locking and append-only records. There is no public credit endpoint.
- Server-rendered editorial pages, route-specific metadata, configured-origin canonicals and truthful Organization/WebSite/Breadcrumb/Article JSON-LD. Private routes and sample offers stay excluded from indexing.
- **Payments, funding, real purchases, fulfillment, email recovery, staffed support and affiliate payouts are not live.**

## Local setup and release verification
Use Node 22 or later. Run `npm ci`, `npx playwright install chromium`, then `npm run verify:release`. This runs syntax/brand checks, unit/API/database tests and Chromium QA. QA uses an isolated embedded PostgreSQL engine with fixture accounts; it never uses production supplier keys or DATABASE_URL. Screenshots and results are written to ignored `qa/`.

For a persistent account server, provision PostgreSQL and set `DATABASE_URL` privately. Set `SITE_URL` to the actual serving origin (for example `http://localhost:3000` locally or the existing Railway preview origin). Run `npm run migrate`, then `npm start`; startup also applies the idempotent schema under a migration lock. With no database the storefront serves normally and account access returns an explicit unavailable state. No in-memory production account fallback exists.

Keep `SEO_INDEXABLE=false` during preview. Do not set it true as a substitute for connecting an owned domain and completing the launch review. The sitemap currently includes only the homepage, editorial content and useful public resources when explicitly enabled; demo offers are excluded.

See [release and integration status](docs/SOCIALENGINE_RELEASE.md) for exact gates and remaining external setup.

## Source of truth
**No fake product inventory.** The former creative kits and invented price lists have been removed. The storefront now reads supplier API responses. The API connectors are read-only and orders/payments are intentionally disabled. No live supplier accounts are configured in the repository. Products remain unreviewed and must be verified for actual fulfillment, platform-policy compliance, payment acceptance, and legality before they can be sold.

## Supplier integrations
The server supports these documented Perfect Panel-style providers:
- Boostero (`POST https://boostero.com/api/v2`, URL-encoded body)
- SMM World (`POST https://my.smmworld.org/api/v2`, JSON body)
- JustAnotherPanel (`POST https://www.justanotherpanel.live/api/public/v2`, JSON body)

Configure **Railway service variables**, never commit credentials:
- `BOOSTERO_API_KEY`
- `SMMWORLD_API_KEY`
- `JAP_API_KEY`
- Optional `RETAIL_MARKUP_MULTIPLIER` (default 2.5, indicative pricing only)

Each connector requests `action=services`, normalizes supplier IDs, names, order types, categories, minimum/maximum quantities, rate per 1,000, refill/cancel flags and platform. Unknown platforms and malformed rows are withheld. Supplier costs are not exposed to clients. Currency assumptions must be checked against each account's balance before any purchases are enabled. The sync is on demand, cached for 15 minutes, and never places orders.

Service paths: `GET /api/catalog`, `GET /api/services/{provider}-{id}`, `GET /services/{provider}-{id}`; `GET /api/health`. `POST /api/orders` returns 403.

## Run
Node >=22; `npm test`; `npm start`. Docker and Railway files are included. Railway is connected to `main`.

## Necessary commercialization work
Supplier terms and credentials; manual eligibility and quality approvals; reliable category classification; account-specific currency conversion; legally supported checkout; authentication; DB-backed orders and payment ledger; order idempotency; authenticated supplier order submission after paid orders; status polling, refill and cancellation logic; refunds, support, and supplier health checks. No automatic orders should be enabled before each of these checks.
