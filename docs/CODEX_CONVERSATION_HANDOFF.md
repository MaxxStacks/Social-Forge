# SocialForge — Conversation Archive, Product Brief & Codex Handoff

> **Read this first when continuing SocialForge development.**
>
> **Compiled:** 2026-10-17 (America/Toronto).
> **Repository:** https://github.com/MaxxStacks/Social-Forge
> **Railway preview:** https://socialforge-web-production.up.railway.app/
> **Primary competitor benchmark:** https://graming.com/
> **Current scope:** The user's **SocialForge** standalone SMM-services reseller storefront only. Do not mix it with Dealer Suite 360, Maxx Stacks's other apps, or any other repository.

## 0. Provenance, completeness and secrecy — IMPORTANT

This is a comprehensive **Codex handoff, reconstruction of the available conversation, and technical state summary**, **not a byte-for-byte exported ChatGPT transcript**. Some earlier turns are not available verbatim in the present context. Direct quotations below are drawn from accessible conversation text; other parts condense the discussion and code changes. Do **not** pretend that missing turns were reconstructed verbatim.

The user explicitly requested: **"Send this full conversation to codex. Add it as an MD file inside the repo."** This document makes the available project conversation actionable and durable in the repository. The root \`AGENTS.md\` points Codex to this file. A GitHub commit is **not** the same as pushing a message into an already-running Codex session: Codex must open or refresh this repo.

**Security:** A real SMM World API key was pasted into the conversation. **ITS VALUE IS INTENTIONALLY OMITTED FROM THIS DOCUMENT.** Treat that historical credential as exposed; request rotation through the provider account if it has not already been rotated. Only store a replacement as a protected Railway service variable named \`SMMWORLD_API_KEY\`. Never put API keys in Git, docs, logs, browser code, client responses, tests or generated fixtures. No other personal/private user information belongs here.

The user's strong language in some quoted messages reflects dissatisfaction with unverified work and weak design. Preserve the underlying requirements without allowing frustration to substitute for technical acceptance criteria.

---

## 1. Single-sentence mandate

Build **SocialForge** into a **visually distinctive, premium, product-first, high-converting, automation-heavy social-media-services retail marketplace**, commercially comparable with and ultimately superior to **Graming** in the shopping journey, full-stack capabilities, customer experience, reliability and merchandising — **with absolutely no gradients, no generic AI-generated aesthetic, and no confusing technical jargon in the consumer-facing interface**.

A visitor must be able to identify **what is being offered, on which platform, for what quantity, at what honestly quoted price, and what action to take** without reading technical marketing copy.

### Business and platform scope

Full spectrum of candidate social networks:

1. Instagram
2. TikTok
3. Facebook
4. YouTube
5. Threads
6. X (Twitter)
7. Snapchat
8. WhatsApp
9. Telegram
10. Spotify
11. Discord
12. Twitch
13. Pinterest
14. LinkedIn
15. Reddit
16. Bluesky

The user specifically wants **API-backed reseller products** (for example follower, view and engagement categories when the underlying actual supplier offers and policy/payment review permit them), rather than irrelevant creative kits, content packs or generic services that the suppliers do not provide.

Important distinction: **Supplier inventory does not mean verified eligibility to sell.** Synthetic or manipulated engagement can conflict with platform rules and payment-processor restrictions; any real offering needs provenance/policy/commercial review. Do not tell customers a product is approved, safe or genuinely delivered merely because an API returns it.

---

## 2. Explicit user requirements — nonnegotiable

### Visual language

- **No gradients anywhere** — no CSS \`linear-gradient\`, \`radial-gradient\`, \`conic-gradient\`, gradient text, gradient-overlay hero art, or decorative rainbow blobs.
- **No generic “AI-built” styling** — avoid fake-glass SaaS panels, noisy dashboards, giant meaningless graphics, excessive emoji icons, abstract buzzwords, or overdesigned decorative sections.
- Strong, custom **retail brand image**: restrained palette, legible type, elegant hierarchy, purposeful whitespace, confident product merchandising, premium navigation, memorable visual coherence.
- Prefer **real/self-hosted social platform brand SVG icons**, properly attributed/handled when necessary, over text glyphs or emoji placeholders.
- Clean **square or only minimally rounded corners**, consistent buttons and cards.
- Mobile-first polish; no horizontal overflow, tiny targets or broken menu states.
- Not merely “professional enough”; the user wants the storefront to inspire a buyer to continue shopping, as Graming's purchase journey does.

The current round moved toward **white/off-white, ink/navy, restrained blue and light gray/blue surfaces**, with deliberately flat fills. Treat that as direction, not an excuse for a bland finance dashboard. Iterate against actual browser screenshots.

### Retail UX

- A high-quality **mega menu** with all networks, clear category/service links, searchable items, intuitive hover/click/keyboard behavior and a working mobile drawer.
- Homepage must surface direct **Followers / Views / Engagement** shopping choices and platform shortcuts, not “service orchestration” or “AI intelligence” before products.
- Network + service dedicated landing pages.
- Quantities/presets, custom amount input, **visible per-unit rate, base price, volume savings, coupon savings, and final total** on the product page.
- Public profile or post URL field as applicable, validated per supplier order requirements; do not ask for social account passwords.
- Clear add-to-cart / buy flow; explain delivery, refill/cancellation conditions, quantity limitations, FAQs and related services without cluttering primary selector.
- Rich footer with shopping, membership, resources, support, legal and commercial disclosures.
- Genuine social proof only; **never fabricate verified customers, reviews, sales volume, transaction counts, rating stars or “recent orders”**. Clearly label illustrative UX samples.

### Commerce, engagement, retention and growth features

Requested ecosystem, ultimately **operational**, not empty clickable mockups:

- Persistent cart, secure accounts, order history and status timeline;
- Compliant payment checkout, tax and currency logic, receipts and refunds;
- Automated supplier order submission, live fulfillment/status, failure recovery;
- Price and quantity tiers, **mass-volume discounts**, clearly presented savings;
- Discount and promotional codes with restrictions and anti-abuse controls;
- Loyalty tiers, points, purchase-based rewards, cashback/account-credit if legally and financially supportable;
- Affiliate program with referral links, attribution, commission ledger, payouts and abuse prevention;
- Live chat/customer support, ticketing, escalation and knowledge base;
- High-quality original articles, free useful tools, SEO pages, related-product merchandising, complete footer;
- Social-platform-specific services sourced from verified upstream API catalog;
- Admin tools for supplier inventory, margins, outages, moderation, customer problems, queue health, orders and financial reconciliation;
- Additional credible AI/automation differentiation over the competitor: AI-guided catalog search that is grounded in available inventory, provider reliability analysis using actual order events, approved-supplier routing, failure detection and customer support triage.

**Do not claim these production services are live just because the UI has working demo interactions.**

---

## 3. User messages and conversation development (available direct quotations / faithful paraphrases)

> **Archive coverage:** The user conversation spans several design/deployment cycles on or before 2026-10-17. Some original messages were collapsed/omitted in the context available to the handoff. Quotes are from visible user messages; event notes and assistant actions are summarized from visible tool/deployment history and repository files.

### Initial business direction: reproduce and surpass the Graming buying experience

- User asked how sites such as Graming operate and whether a comparably advanced API-reseller site could be built with minimal ongoing workload.
- User sought monetization through API-backed SMM services, with full visual and technical quality comparable to Graming.
- User created the **independent** repository: \`https://github.com/MaxxStacks/Social-Forge.git\`.
- User directed deployment on **Railway**, using a temporary Railway domain for actual live review.
- Initial attempt was criticized as an uninspired generic SaaS storefront.
- Initial development at one stage sold “creator kits”, content packs and similar unrelated deliverables, not the wholesaler services. User corrected this explicitly:
  > “But these arent services being offered by the apis we found that will make the whole process automated”
- User called out nonfunctional service pages and unclear positioning:
  > “Its a little better but its not clear what services people can buy. Service pages arent active. I own the project and even im Not clear on what we are offering”
- User rejected a 6/10 experience:
  > “Regardless, the site is still only a 6/10. Look at all the functionalities available on graming...”

**Decision:** build a real supplier-backed inventory architecture, separate clearly labeled synthetic demonstration products, and prioritize exact product types rather than marketing “services” that the customer cannot identify.

### Competitive feature audit and parity backlog

User:
> “You created a comparison list above of ehat gram has vs what ee have and we have alot missing to get in the same level as graming. Next I have so much experience in ai and automations etc that our site should be better in terms of services, functionalities and overall image, design and presentation... get cooking”

Work recorded in the repo:
- \`docs/graming-feature-audit.md\` compares public Graming capabilities to SocialForge, prioritized by revenue workflow, conversion and premium design.
- \`docs/graming-shopping-journey.md\` maps homepage, dedicated network pages, quantity and price selection, URL field, cart, FAQs and customer confidence.
- GitHub issues were created for core commerce: database/auth/cart, checkout/payment/refunds, supplier fulfillment, product discovery, and loyalty/support/affiliate/free tools.
- Early parity implementations added a real-supplier service finder, free browser tools, FAQs/help and a quote configurator; **actual payments remained blocked**.

### Page-by-page Graming buyer journey request

User:
> “I still dont like the site. It looks ai generated and its complicated to understand. Run graming page by play playbook and see just how beautiful buying followers is and how inspiring it is”

The specific insight from Graming's public pages:
1. An unmistakable product heading (for example Instagram Followers).
2. Obvious network/category navigation.
3. Service tier and quantity preset choices.
4. Custom amount with immediate visible price.
5. Recipient link.
6. Clear cart/buy action.
7. Reassurance/terms/FAQs and related products placed *after* the primary decision area.

Prior SocialForge failed by leading with “service intelligence”, “supplier orchestration”, “social commerce reengineered”, complex goal finders and disconnected utilities.

New consumer retail homepage and dedicated \`/shop/{network}/{followers|views|engagement}\` demo product pages were subsequently built.

### Major visual and functionality rejection / secret disclosure

User (API secret redacted):
> “I dont like the flow of colors. I dont like the Ai feeling the site has. I fuckin HATE gradients. Plus we will be working with smm world API Key [REDACTED] I need a highly professional mega menu. Real social media icons, social proof, loyalty program, tiered discounts on purchases. Discount codes. Live chat, articles, rich footer, affiliate program, mass volume discounts... All systems operational page and link with fake data, product pages should have savings based on # of followers, views etc purchased. This has to be next fuckin level. We cant let Graming beat us in any way... I have the best vibe coding skills vs graming... there is no way we come second to anyone in this space...”

Interpretation:
- Remove gradients **completely**.
- Implement all key feature pages and test behaviors with synthetic demo data, while **marking them synthetic**.
- Build the polished e-commerce experience before overemphasizing developer/internal admin pages.
- A provider credential was supplied but **must not be reprinted or reused from chat**. The attempted Railway write was blocked; user should rotate it and set a new protected variable.

### Failed big-bang publishing and resulting correction

User:
> “What just happend? You lagged out for a long time and came back with nothing?”

Assistant explained:
- A substantial new storefront had been drafted, but several GitHub publish operations were blocked/failing.
- Parts of the draft **never reached the repository**.
- Only some SVG icon assets landed in that attempt.
- SMM World key was not connected.
- User had requested a built and visible platform, not theoretical plans.

User:
> “Well try reviewing your code and get the job done right.”

**Decision:** switch to **small verified GitHub commits** with CI, Railway deployment, screenshots and browser tests after each functional slice. Never claim a feature is complete merely because source text was drafted.

### Latest completed build and user follow-up

The most recent completed design/development pass:
- Flat-color retail design and product selector rather than floating pastel/gradient phone art;
- 16-platform mega navigation with self-hosted brand icons;
- Demo quantity tiers/coupons and cart savings;
- Mock checkout with browser-local order tracking, rewards dashboard, affiliate calculator;
- Scripted help chat, local-only ticket drafts, original editorial guides and expanded footer;
- Fixes for broken JS DOM helper selectors, truncated browser QA script, menu interaction and inconsistent product styles;
- Verified Railway **SUCCESS** for commit \`b40d1d395a9060e42f203f4c85e69bf89c018f52\`;
- GitHub CI and browser QA passed on that commit, including **38 browser checks**.

The user's latest request:
> “Send this full conversation to codex. Add it as an MD file inside the repo”

This file and \`AGENTS.md\` were added specifically to preserve the development direction for Codex.

---

## 4. Graming public-site benchmark

Reference links:
- https://graming.com/
- https://graming.com/buy-instagram-followers/
- https://graming.com/buy-tiktok-followers/
- https://graming.com/buy-instagram-likes/
- https://graming.com/faq/

Verified/advertised **public** patterns (not verification that the seller genuinely delivers the advertised results):
- Extensive network/service classification and searchable navigation;
- Quantity cards, variable amounts, service tiers, example savings and a recipient link;
- Cart and buy flow, customer login/order tracking and support offers;
- Coupons, VIP tiers, loyalty/cashback or account-credit style incentives;
- Promotional support/FAQ pages, original articles and social/free utility tools;
- Affiliate program and additional payment methods shown/advertised.

**What to outperform:** clarity; polished visual storytelling; performance; easy platform discovery; transparent real pricing; reliable actual supplier eligibility and support; verified status tracking; useful automation; honest proof. Avoid copying competitor's protected visual assets, text or branding.

Existing repository audit files are baseline evidence, but **visually recheck the live pages** if doing another competitor pass because they can change.

---

## 5. Actual current repository and architecture (verified from connected GitHub)

### Infrastructure / technology
- Organization/repo: \`MaxxStacks/Social-Forge\`
- Primary branch: \`main\`
- Node.js 22+, ESM, native \`http\` server (not presently Next.js);
- \`npm start\`: \`node src/server.js\`;
- \`npm test\`: \`node --test\`;
- GitHub Actions CI and Playwright/Chromium browser QA script;
- Railway production service \`socialforge-web\`, app accessible at \`https://socialforge-web-production.up.railway.app/\`.
- Current implementation is a Node static/public frontend plus API routes; no production user/auth/payment DB layer.

### Supplier integrations
\`src/suppliers.js\` supports read-only supplier requests:
- Boostero — \`https://boostero.com/api/v2\` — \`BOOSTERO_API_KEY\` (form-encoded)
- SMM World — \`https://my.smmworld.org/api/v2\` — \`SMMWORLD_API_KEY\` (JSON)
- JustAnotherPanel — \`https://www.justanotherpanel.live/api/public/v2\` — \`JAP_API_KEY\` (JSON)

Caution: provider API schemas/URLs were implemented based on then-available documentation; **verify current provider docs and your account's exact supported format before production**. An API endpoint is not proof of commercial acceptability.

\`src/supplier-catalog.js\`:
- Imports service rows and provider currency; sanitizes private wholesale fields;
- Normalizes type, quantity min/max, category, network and estimated price per 1,000;
- Drops unknown/malformed categories;
- Holds in-memory cached snapshot with ~15-minute TTL and shorter retry following failed sync;
- \`RETAIL_MARKUP_MULTIPLIER\` optional, default 2.5, indicative;
- \`GET /api/catalog\` and \`GET /api/services/{id}\` expose **read-only** provider-backed inventory;
- No supplier credential values should reach clients;
- **Supplier order submission is intentionally not implemented** in the current preview.

\`src/quality.js\` contains heuristic supplier-quality signals and the \`/api/operations/readiness\` public aggregate dashboard. It **does not certify compliance, real delivery or merchant approval**. Do not disclose wholesale costs or private provider details.

### Deliberately separate demo inventory
\`src/demo-catalog.js\`: 48 synthetic products = 16 networks × 3 categories (followers, views, engagement); simple sample rate/quantity fixtures. **Not real supplier offers**.

\`src/demo-pricing.js\`:
- Example quantity savings:
  - 1,000+ units → 5%
  - 5,000+ → 10%
  - 10,000+ → 15%
  - 25,000+ → 20%
- Example promotional codes:
  - \`WELCOME10\` → 10%
  - \`SAVE5\` → 5%
  - \`BULK15\` → 15%, requires a demo subtotal of at least CAD $50 **after** tier savings.
- Coupon applies after volume discount; integer-cents math.
- \`POST /api/demo/quote\` returns a server-side simulated price; never accepted as production payment.
- \`/api/orders\` returns 403; admin endpoint not publicly exposed.

### Currently reachable frontend routes
- \`/\` home (flat styling; network/service quick finder)
- \`/shop/{network}/{followers|views|engagement}\` demo product page
- \`/discover\` sample service discovery
- \`/cart\` mock shopping cart
- \`/explore\` actual supplier-backed service finder (empty if unconfigured)
- \`/services/{id}\` service detail, subject to real/synthetic availability
- \`/tools\` free utilities
- \`/help\` knowledge/FAQ
- \`/operations\` public aggregate readiness
- \`/volume\` working *demo* tier calculator
- \`/discounts\` *demo* code examples
- \`/rewards\` *demo* points dashboard
- \`/affiliates\` *demo* earnings simulator
- \`/account\` browser-local *demo* account/order summary (not authenticated)
- \`/track\` browser-local mock order lookup
- \`/support\` scripted chat and local ticket draft
- \`/articles\`, \`/articles/{slug}\` original short educational guides

**Don't assume every older secondary route has fully unified design and responsive QA.** Make a route matrix and recheck live browser views.

### High-value code paths
- \`public/index.html\`, \`public/retail.css\`, \`public/flat-ui.css\`, \`public/retail.js\`, \`public/mega-menu.js\`: homepage, design overrides, icon-based menu, quick product finder;
- \`public/shop.html\`, \`public/shop.css\`, \`public/shop.js\`: demo product selection and savings breakdown;
- \`public/icons/*.svg\`: brand icon assets;
- \`public/cart.html\`, \`public/demo-cart.js\`, \`public/cart-store.js\`, \`public/cart-flat.css\`: sample cart and local order creation;
- \`public/programs.html\`, \`public/programs.css\`, \`public/programs.js\`: rewards, affiliates, volume, discounts, account and tracking;
- \`public/resources.js\`: scripted help and articles;
- \`src/server.js\`: router, static assets, supplier APIs and demo quote API;
- \`src/suppliers.js\`, \`src/supplier-catalog.js\`, \`src/quality.js\`: supplier integration/readiness;
- \`src/demo-catalog.js\`, \`src/demo-pricing.js\`: synthetic products and sample savings;
- \`test/site.test.js\`, \`test/demo-pricing.test.js\`, \`scripts/browser-qa.mjs\`: test coverage and rendered-page checks;
- \`docs/graming-feature-audit.md\`, \`docs/graming-shopping-journey.md\`: previous competitor reviews;
- \`README.md\`: high-level environment and command notes; **may lag the latest demo feature implementation**.

### Local-storage demo data
- \`socialforge.demo.cart.v2\`: cart model;
- \`sf.demo.orders\`: mock orders (no real checkout);
- \`sf.demo.tickets\`: mock ticket drafts;
- \`sf.demo.promo\`: selected demo promo code.

These are **not secure databases**, are per browser/device, and are not suitable as authoritative customer/order/payment data. No true membership or tracking should be claimed.

---

## 6. Reality check — current status table

| Capability | Latest verified status | What is NOT working yet |
|---|---|---|
| Flat-color retail homepage | Deployed/QA passed | Needs subjective premium design review with user |
| 16-network mega menu / real SVG icons | Deployed/QA passed | Expand product/service taxonomy based on *actual approved* inventory |
| Product-specific package selection | Working demo | Not tied to approved supplier checkout |
| Quantity-based savings and promo code | Server-side *demo* quote | No real price snapshots, coupon ledger or funds |
| Cart | Browser-local demo | No persistent account cart |
| Mock checkout | Creates local example order only | No payment processor, no real order |
| Account, order tracking, loyalty | Simulated from browser-local orders | No authentication, payment or provider event timeline |
| Affiliates | Hypothetical earnings calculator | No attribution or actual commission payout |
| Support chat | Scripted Q&A | No online support agent or production inbox |
| Support ticket | Saves local browser draft | No delivery to real team |
| Articles | Original basic guides | Needs comprehensive editorial/SEO strategy |
| Supplier adapters | Read-only API adapters exist | Actual provider key/connection not confirmed; service approval outstanding |
| Operations dashboard | Advisory report exists | Does not establish sale readiness |
| Real customer social proof | None fabricated | Genuine verified reviews/results required |
| 24/7 order fulfillment/refills/refunds | Not enabled | Full secure transactional stack missing |
| Browser QA | 38 checks passed as of latest verified commit | Need larger cross-browser, accessibility, checkout and visual regression coverage |
| Railway production domain | Deployment SUCCESS for \`b40d1d3\` | This is a **public preview**, not a revenue-ready store |

---

## 7. Bugs, regressions and operational lessons from this exact conversation

1. **Repeated “AI-generated” design rejection.** Do not generate another stock template or decorative gradients; manually compare screenshots and shopper flows.
2. **Mismatch between displayed products and supplier services.** Early “creator kits”/assets were not what upstream SMM APIs sell. Build inventory from actual validated supplier products, not speculative labels.
3. **Some pages looked active but had no actions.** All visible actions must navigate or function; no fake “operational” claims.
4. **Big-bang publishing failed.** Several massive content/tree writes were blocked or superseded by other commits. Work in small commits and check actual remote \`main\` SHA before assuming changes landed.
5. **GitHub branch conflicts.** Another commit can land while composing a tree. Rebase/re-fetch current SHA and preserve others' work rather than forcing a stale parent.
6. **Broken browser QA scripts.** An accidental truncated string and duplicate trailing lines made \`scripts/browser-qa.mjs\` syntactically invalid. Run \`node --check\` on changed JS before pushing; validate \`npm test\` and full Playwright suite.
7. **DOM selector mismatch in member modules.** Helpers called with \`'#id'\` but originally implemented \`getElementById(id)\`; normalization fix landed in both \`programs.js\` and \`resources.js\`. Avoid repeating.
8. **Mega menu stayed open after Escape until CSS interaction fixed.** Test keyboard Escape, focus management, outside click, mouse hover and mobile open/close.
9. **Old palette leaked into product page due to stylesheet order.** Ensure \`flat-ui.css\` overrides \`shop.css\` as intended; do not leave purple gradients on secondary pages.
10. **Footer links were cramped together.** Later rebuilt into columns. Retest all links and touch layouts.
11. **Browser local storage can fail under restrictive contexts.** Guard storage reads and writes, and do not treat local mock orders as persistent or secure.
12. **Railway “online” is not sufficient.** Check deployment commit SHA, healthy replica, route responses, JS console errors and screenshots.
13. **Credential deployment attempt was blocked.** Do not hardcode, reuse or print the key. Ask for rotated, privately set Railway variable; user has already been advised about this.
14. **Overpromising damaged trust.** Distinguish *committed*, *deployed*, *automated test passed*, *visually inspected*, *demo functioning* and *real commerce ready*.

---

## 8. Codex's implementation priorities and acceptance criteria

### P0 — Visual product-first retail parity

**Goal:** make the site feel distinctly more sophisticated than the current 6/10 user assessment, without adding decorative noise.

- Audit every public route (desktop 1440×900 and mobile 390×844 at minimum).
- All customer screens use **flat fills** and a deliberate brand system; no gradients anywhere. Check computed CSS, not only text search.
- Replace remaining emoji/glyph placeholders with brand icons where appropriate.
- Mega nav includes all 16 networks, category links, search, discoverability and accessible keyboard/mobile states; menu never opens unexpectedly.
- Product page's top viewport: precise service name, tier cards, custom quantity, clear savings, real supplier constraints (once approved), link field and CTA.
- Consistent high-quality original merchandising and illustration/photography **where user authorizes image production**. Avoid copying Graming assets.
- Improve copy: plain language, no “AI-powered omnichannel growth orchestration” fluff.
- Every visible footer/header link returns a real purposeful page; no placeholder route masquerades as operational.
- Real social proof only, sourced and consented; demonstrate layout with clearly marked sample placeholders if needed.
- Screenshot-based review, Lighthouse/performance, accessibility (contrast, keyboard navigation, WCAG 2.2 AA as appropriate).

### P0 — Actual supplier-backed product definition

- Validate fresh SMM World credentials **only after private Railway secret rotation**, along with API endpoints/schema.
- Fetch and review catalog, currencies, min/max, supported parameter types, refill/cancel behavior, provider restrictions, delivery terms.
- Establish product mapping: supplier's actual categories and capabilities determine what can be listed.
- **Review policy and merchant-processor eligibility** for each real product type. Do not automatically expose or fulfill artificial engagement.
- Add admin approval UI/state; never treat a read-only import as approval.
- Show authentic, supported inventory separately from demo fixtures; no guessed inventory, savings, durations or guaranteed outcomes.
- Approved product metadata, localized currency and real source-of-truth pricing.

### P0 — Real order pipeline (only after clearance)

- PostgreSQL users, product approvals, carts, quotes, orders, order items, idempotency keys, payment intents, transactions, supplier fulfillment events, refunds and support tickets.
- Auth sessions/guest checkout, customer account isolation and verified webhooks.
- Payment processor eligibility first; do not automatically assume Stripe approves SMM products.
- Exact integer-cents rate calculation, tax/currency handling, expiry-bound quote snapshots and total authorization.
- Durable job worker for provider order submission, replay prevention, polling and exceptions.
- Clear refunds/refill/cancellation based only on real provider capabilities.
- Real order email/notification stream, support escalation, audit trail, inventory deactivation and observability.
- Test retries, partial delivery, supplier outages, fraud, webhook replay, duplicate orders and data access.

### P1 — Loyalty, promo, affiliate and retention

- Persist customer earnings and credits with immutable ledger events; enforce eligibility, limits, expiration and anti-fraud checks.
- Promo engine must calculate identical totals in catalog, cart, checkout, receipts and refunds; quantity savings visibly itemized.
- Clearly document stacking policy and minimum spend.
- Affiliate URL attribution, source validation, attribution windows, abuse protection, earnings ledger, compliance, payout/chargeback reconciliation.
- Referral/customer services benefit from genuine data and customer consent; do not invent testimonials.
- Automated support assistant may consult approved FAQ/order status only with privacy/authorization enforcement; seamless escalation to real human queue.

### P1 — Marketing moat and tooling

- Real network logos, contextual service mega-menu, meaningful landing pages and related products;
- Original guides/SEO with factual product terms;
- Useful free account-safe creator tools, proper copyright and platform rules;
- High-quality microcopy, empty states, estimates that distinguish real vs preview, and clear disclosures;
- Subscription and repeat-purchase features only where legally/operationally supportable;
- AI-backed routing and reliability decisions derived from actual provider performance metrics, not invented supplier-quality scores.

### Required engineering workflow

1. Inspect repo and current \`main\` before editing. Read this handoff and \`README.md\` / existing Graming audits.
2. Run baseline \`npm test\` and browser QA. Check app currently serves.
3. Implement coherent slices, with small atomic commits and correct rebase/branch handling.
4. \`node --check\` for modified JS, unit tests, end-to-end Playwright and visual screenshots.
5. Compare mobile and desktop renders, fix overflow, broken links, wrong selectors, blocked scripts.
6. Verify Railway deployment **commit SHA** matches GitHub \`main\`, replica healthy and route responses.
7. Present concise checklist with *honest feature-level status*, screenshots and direct live URLs.
8. Never claim commercial launch readiness if payment, order ledger, secret configuration or provider approval is missing.
9. Ask the user to add/rotate credentials privately, never paste them back into ChatGPT or a Codex prompt.
10. Do not pause on superficial planning once enough specifics are known; keep shipping testable improvements.

---

## 9. How to use this file in Codex

1. Open GitHub repo \`MaxxStacks/Social-Forge\` in Codex and ensure it is using current \`main\`.
2. Read root \`AGENTS.md\`, this handoff, \`README.md\`, and the two Graming comparison docs.
3. Start with the **P0 visual/navigation consistency audit and operational commerce blockers**. Do **not** restart from scratch unless justified by a migration strategy.
4. Treat every existing “working” demo as a fixture until it has a real persistence and provider integration.
5. Preserve the intentionally strict boundaries between simulated and actual supplier inventory.
6. Keep this handoff updated when new product/design decisions are made.

### Suggested immediate Codex instruction

> Read \`AGENTS.md\` and \`docs/CODEX_CONVERSATION_HANDOFF.md\` fully. Review every storefront route against the latest deployed SocialForge, the existing Graming audits, and user requirements. Prioritize no gradients, coherent premium retail design, intuitive 16-platform mega navigation, authentic service catalog definitions, working links and full end-to-end QA. Do not enable financial or supplier order actions before provider/payment eligibility checks. Implement in small verified commits, test the exact deployed Railway SHA, and report what is real versus simulated.

---

## 10. Key reference resources / current continuation point

- Repo: https://github.com/MaxxStacks/Social-Forge
- Live preview: https://socialforge-web-production.up.railway.app/
- CI history: https://github.com/MaxxStacks/Social-Forge/actions
- Existing parity audit: \`docs/graming-feature-audit.md\`
- Existing shopping journey review: \`docs/graming-shopping-journey.md\`
- Relevant GH issues: core accounts/cart/ledger, checkout/payments, supplier fulfillment, merchandising, loyalty/referrals/support, flat-color storefront.
- Current verified pre-handoff SHA: \`b40d1d395a9060e42f203f4c85e69bf89c018f52\` (CI + 38 browser checks passed; Railway SUCCESS).
- **Commercial state:** prototype/demo preview, not accepting orders or payments.
- **Supplied credential:** ***REDACTED. MUST ROTATE AND SET IN RAILWAY SECRET VARIABLE.***

### Enduring success criterion

**SocialForge should feel like an expertly art-directed retailer, not an AI template, and should become genuinely capable of selling precisely described eligible supplier services with accurate price, secure checkout, dependable fulfillment, transparent status, trustworthy proof and real support.**

Do not trade truthfulness for polish. Do not trade polish for feature quantity. Do not call a mock system “operational” without clearly saying **demo**.
