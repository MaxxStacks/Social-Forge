# SocialForge
Multi-platform social media service marketplace scaffold, deployed separately on Railway.

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
