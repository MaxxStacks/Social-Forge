# SocialEngine product direction

Current owner direction recorded October 17, 2026. This document records product requirements. See SOCIALENGINE_RELEASE.md for implementation and remaining launch dependencies.

- Brand: SocialEngine. Intended domain: socialengine.cc, pending ownership/configuration confirmation. Existing repository remains MaxxStacks/Social-Forge.
- Dominant brand color: #275ddf. Flat fills, no gradients. Original premium retail design, restrained typography, purposeful spacing, minimal corner rounding, authentic platform icons.
- Required customer dashboard: secure login, order history/detail/status, wallet funding, available balance, transaction history and receipts, support, account settings.
- Wallet balances must come from a durable server ledger. Payment webhook verification and idempotency, atomic spending, refunds and chargeback reconciliation precede live funding.
- Never present localStorage demo data as an authenticated account or real balance.
- Search objective: compete with Graming and Media Mister through clear service taxonomy, trustworthy terms, original useful content, technical SEO and measurable search/citation performance. No guaranteed positions or fabricated citations/reviews.
- Review competitor information architecture and intent coverage. Produce original design/content; copy neither claims nor assets.
- Release checks must precede deployment. Validate syntax, unit/API tests, route/assets, browser flows, desktop/mobile visuals and staging smoke. Confirm exact passing commit/artifact.
- Keep historical handoff intact as historical context. Apply new brand to runtime UI/metadata/email/receipts; preserve or migrate existing local demo storage deliberately. Domain cutover requires redirect, canonical, sitemap, email and cookie/session planning.

Implementation sequence: release gate; brand/navigation/product templates; persistent auth/orders/wallet foundation; approved payment and supplier workflows; indexable production content and schema; retention and advanced automation.
