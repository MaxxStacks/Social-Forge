# Repository audit evidence

Date: 2026-10-17. Reviewed commit 1d22142c7a898dd89283d4d31412fc41ffa32649 from MaxxStacks/Social-Forge. Local branch codex/socialengine-foundation. Workspace was an empty initialized repository; fetched existing code without changing production.

User current requirements supersede historical briefing: SocialEngine brand, planned socialengine.cc domain, dominant #275ddf, premium design, real customer order and funding dashboard. Attachment is historical context, not independent authorization to deploy or activate commerce.

Observed code:
- Node ESM native HTTP server, static HTML/JS; no dependencies declared, no DB/auth/payment/wallet layer.
- src/server.js rejects /api/orders with 403; supplier adapters read inventory only. /account uses shared programs.html.
- public/programs.js account() reads sf.demo.orders localStorage; no authentication. This is not an account system.
- flat-ui.css still has --blue #165caa, --lav #1d5b9f, logo #175fba. Many stylesheet generations and hardcoded fills complicate consistent rebranding.
- No canonical or JSON-LD matches found in public/src. No robots/sitemap route in server. Dynamic /shop pages return same shop.html source; program/article routes share one document and derive content client-side. Article regex accepts arbitrary slugs, creating potential soft-404s.
- Browser QA workflow runs only on main push/manual; unit CI runs PR and main. README says Railway connected to main. Thus repo does not establish predeployment browser gating. Must inspect Railway wait-for-CI separately before declaring deployment race proven.
- Docker copies only package/src/public and starts server; no test build stage.
- Existing browser suite tests one Chromium browser, selected demo routes, 390px mobile overflow, screenshots; no screenshot baseline comparison or real wallet/auth/fulfillment tests.
- npm test: 15/15 pass after sandbox localhost restriction resolved. Initial fetch EACCES was environment-related, not application defect.
- Initial browser launch unavailable dependency, installed pinned Playwright 1.56.1 locally without manifest change, Chromium installation in progress. Do not claim browser pass until completed.

Required delivery plan:
1. Predeployment unit, syntax, full route/assets crawl, browser and visual checks on pull requests; deploy exact passing artifact/SHA, staging smoke, manual visual approval for initial redesign. No need to ask owner to approve routine reversible coding.
2. Brand system with #275ddf primary, flat neutrals, tightly controlled secondary palette; original typography/composition; remove obsolete CSS after migration, no new override layer. Rebrand UI/metadata/mail/receipts/error pages; preserve historical docs and storage migration; do not rename Railway/GitHub or set domain before ownership/configuration verified.
3. Real PostgreSQL account + ledger and auth; dashboard Orders, Wallet/Add funds, Transactions/receipts, Support, Settings. Credits only from verified provider payment events; webhook replay idempotency, concurrent spend protection, refunds/chargebacks reconciliation, ownership isolation. No browser-authoritative balances. Test restart persistence, double webhook, concurrent purchases, other-user access and failed topups.
4. Product taxonomy from actual supplier metrics. Generic engagement is unclear; followers versus subscribers/members must be platform-specific. Narrow launch to verified, reliable products rather than expanding 48 demo permutations.
5. Search: server-render unique truthful landing pages, stable URLs, canonicals, robots, sitemap, correct status codes, Organization/WebSite/BreadcrumbList/Article and eligible service offers, no demo offers or fake reviews. Private account routes noindex and protected. Public preview excluded until real indexable launch.

Decision challenges: branding polish alone cannot close commerce gap; prioritize operational customer journey. Do not guarantee ranking or AI citations. Domain .cc is brand choice not assumed ranking advantage; screen SocialEngine name for conflicts before buying design collateral. Funded wallet creates accounting/refund/chargeback responsibilities, so ledger comes before decorative balance cards. No unsupported delivery/safety promises or invented social proof.
