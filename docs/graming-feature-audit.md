# Graming vs SocialForge — capability audit (17 October 2026)

Sources inspected:
- https://graming.com/
- https://graming.com/buy-tiktok-followers/
- https://graming.com/faq/
- https://graming.com/tiktok-video-downloader/

## Public competitor capabilities confirmed
- Service search, extensive categories and per-platform mega-navigation.
- Dedicated commercial landing pages for followers, likes, views, comments, saves, bookmarks, impressions, reactions and channel services, with educational content and FAQs.
- Package quantity presets, custom quantity, advertised discounts, price previews, profile / post-link workflow, cart and buy-now flows.
- Signup/login, account order tracking advertised, support chat, refill and refund policies advertised.
- Coupons, loyalty system, progressive deposit cashback and account credit advertised.
- Free utilities (TikTok downloader/viewer/audio/video and YouTube downloader); blog and SEO content.
- Affiliate program link; checkout advertises multiple payment methods.

**Caution:** Public claims of reliable delivery, user totals, compliance, artificial engagement quality, and support responsiveness were not independently verified. Reproducing UI does not prove the underlying mechanism works.

## SocialForge status after initial parity work
- 16-platform taxonomy, honest read-only supplier catalog, API detail pages (existing).
- **This iteration:** public service finder (actual API matches only), free browser-only link checker and post text counter, help center, supplier quantity selector and calculated price estimate on service pages, better navigation.
- Supplier keys absent. No public inventory is invented. No payment collection or order delivery is enabled.

## Priority A: Critical revenue transaction path
1. Supplier credentials, sandbox verification and per-product moderation/approval; source-of-truth inventory, price snapshots and currency checks.
2. PostgreSQL commerce ledger, authentication, guest sessions, shopping cart and idempotent quote reservations.
3. Approved payment processor, hosted checkout, verified webhooks, refunds, taxes and fraud controls.
4. Order submission with strict idempotency and replay protection; supplier order-state polling, cancellation/refill support only where actually available.
5. Customer orders dashboard, email receipt and status timeline, support ticket escalation.

## Priority B: Conversion and retention
- Platform/service mega-menu, product discovery, dynamic quantity presets, target field validation, real lead times, accurate delivery rules, cart recovery.
- Coupons with explicit terms; customer credits, loyalty/cashback only after accounting and anti-abuse controls.
- SEO pages sourced from actual approved products, FAQs, useful free tools and original blog.
- Affiliate tracking and payouts only with legal/payment accounting and fraud controls.

## Priority C: Premium design
- Real mobile-first UI system, responsive mega-nav, comparison cards, fully tested loading/error/empty states.
- Distinct product page visual hierarchy, trustworthy proof points and merchant policies; never fabricate review counts or recent-order streams.
- Accessibility, performance budgets, keyboard UX, automated visual checks and user testing.

## Release gates
No conversion to paid engagement commerce without independently assessing product provenance, platform terms, privacy, payment processor eligibility and consumer protections. No fake engagement guarantees, hidden credentials, or invented service inventory.
