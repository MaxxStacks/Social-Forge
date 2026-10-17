# SocialForge

Premium multi-platform digital services **preview**. Independent repository for the SocialForge product; not a branch of another MaxxStacks project.

## Features in this deployment
- Redesigned responsive editorial storefront
- 16 social platform categories
- 36 specifically scoped preview service entries
- Search, platform filters, sorting, saved products and dedicated `/services/:id` detail pages
- Read-only product catalog API and healthcheck
- Railway-ready Docker deployment, automated CI tests

**Not a live shop:** Catalog offerings are examples; payments and order placement are disabled. No external suppliers, customer authentication, fulfillment, or persistent transactional database have been connected. Do not promote the preview as ready to sell.

## Local development

```sh
npm test
npm start
# http://localhost:3000
```

Node.js 22 recommended. Set `PORT` dynamically on hosted services; server defaults to `0.0.0.0:3000`.

## API

`GET /api/health` and `GET /api/catalog` are live. Order and admin endpoints are unavailable in this public demo.

## Deployment
Connect the `main` branch to Railway, which builds `Dockerfile`. Healthcheck is `/api/health`. No secrets are required for preview mode.

## Next production milestones
Payment processor approval, vetted legitimate products and suppliers, customer identity, PostgreSQL and order ledger, webhook verification and idempotency, background fulfillment queues, refunds, security hardening and admin controls.

## Product scope and clarity

36 preview concepts across 16 platforms are listed with quantities, customer inputs, output file types, and indicative CAD prices. `/services/:id` and `/api/services/:id` expose each product's details. The four storefront groupings are design, video, content, and profile/audit. **No products are currently purchasable**. The Graming-style engagement catalog (followers, likes, views, shares, comments) has not been implemented or supplier-vetted. Do not represent content toolkits as artificial-engagement fulfillment.
