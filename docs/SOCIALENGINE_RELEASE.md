# SocialEngine foundation release

## Implemented

The storefront uses SocialEngine and #275ddf, an original compact retail layout, real platform icons, explicit account navigation and a single shared footer. Runtime branding changed; historical conversation and competitor audits remain historical. Browser-local cart keys stay compatible. Existing demo orders are deliberately separate from authenticated account records.

The dashboard provides registration/sign-in, order lists/detail timelines, wallet balance, transaction history, durable support requests, profile editing, password changes and logout. Accounts use PostgreSQL. Passwords use salted scrypt; session tokens are random, hashed in the database and carried only in HttpOnly/SameSite cookies. Production cookies are Secure. Mutations require the configured origin and signed-in mutations also require a session CSRF token. Customer queries scope records by the authenticated user. Auth/ticket/password attempts are rate limited in the database.

Wallet entries use integer cents, unique references, transactional balance updates and row locks. Database triggers reject updates/deletes of ledger records. Funding is unavailable and has no public credit endpoint. This is the accounting foundation, not a connected payment processor or a complete chargeback workflow.

Public articles render meaningful text without JavaScript. Unknown article slugs return 404; /index.html redirects to /. Metadata/canonicals use SITE_URL; structured data represents identity, breadcrumbs and editorial content only. Private routes and simulated offers are noindex. Robots defaults to excluding the pre-launch site; sitemap is empty until SEO_INDEXABLE=true. No purchased domain, ranking gain or AI citation is claimed.

## Verification and release gate

`npm run verify:release` checks JavaScript syntax, old public branding, forbidden gradients, unit/API/database behavior, routes/assets, browser runtime/CSP errors and key customer flows. It sanitizes live credentials from the test environment. PostgreSQL behavior tests run with PGlite; deployment integration against a managed multi-connection PostgreSQL instance remains a required staging check.

GitHub browser QA now runs on pull requests. CI uses the lockfile. The Docker verified stage runs the full release command, including Chromium, before producing a minimal Node runtime image. It does not rely on Railway waiting for CI. Railway's existing source config was observed with `checkSuites:false`; enabling wait-for-CI/branch protection is still recommended. Docker Desktop's daemon was unavailable locally, so the image build must be confirmed in CI or Railway before production claims.

Screenshots are inspected by a person/agent; this suite does not yet provide cross-browser coverage or image-diff regression baselines. The initial new visual baseline should be reviewed before production promotion.

## Required external setup

1. Provision a PostgreSQL service in the existing SocialForge Railway project and reference its private DATABASE_URL from the web service. No database existed during this implementation. Do not put its value in Git or a chat.
2. Set SITE_URL to the existing preview domain while that is used. Migrations run before HTTP startup; a migration failure stops startup rather than serving broken accounts. Verify managed-PostgreSQL account persistence and isolation on staging.
3. Select a processor that accepts the actual product catalog. Implement its hosted funding checkout, verified webhooks, payment references, reconciliation, refunds and chargebacks. Only then open Add funds. The disabled UI and 503 endpoint are intentional.
4. Configure an email provider, verification/recovery and operational notifications. A signed-in user can change their password; email reset is not available. Saved support requests do not notify a staffed team yet.
5. Rotate the historically exposed supplier credential privately, verify current supplier API/order schemas and approve actual services. Implement durable fulfillment jobs, idempotent supplier submission, status polling and exceptions before accepting real orders.
6. Connect the owned domain, establish redirects and canonical ownership, configure email/session behavior, validate schema and production pages, then explicitly launch indexing. Do not redirect an established domain before reviewing its indexed URL inventory.

All of these remain visible launch dependencies. Deploying this foundation does not activate money movement or supplier orders.
