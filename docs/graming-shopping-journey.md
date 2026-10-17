# Graming shopper-journey review — SocialForge retail redesign
Reviewed 2026-10-17, using public pages (not private checkout).

## Routes examined
- Home: https://graming.com/
- Followers: https://graming.com/buy-instagram-followers/
- TikTok followers: https://graming.com/buy-tiktok-followers/
- Instagram likes: https://graming.com/buy-instagram-likes/
- FAQ: https://graming.com/faq/

## Page by page

| Stage | Graming's observable approach | What our old site did wrong | SocialForge new approach |
| --- | --- | --- | --- |
| Homepage | Explicitly advertises followers, likes, views and recognizable network choices | Abstract "commerce reengineered" hero and coded goal selection | Human-centered introduction plus prominent Followers, Views, Engagement shopping categories |
| Navigation | Social networks followed by product-specific destination links | Forced users through generalized goal analyzer and diagnostic tools | Fast platform shortcuts, dropdown plus direct product example links |
| Product headline | Names the exact platform and metric first | Supplier codes and AI jargon | Platform + service title immediately |
| Package selector | Multiple quantity cards, custom amount | Quantity selection hidden behind demo service finder | Visible package cards in first screen |
| Live price | Price reacts to quantity selection | Sample totals far from primary landing | Example quote and total directly beside selector |
| Recipient link | Clearly-labeled URL field | Vague "what are you trying to achieve?" | Simple public profile/post field, stays local |
| Purchase | Primary Add to Cart and Buy Now actions | Demo path buried several clicks deep | Add to demo cart prominent; live payment disabled explicitly |
| Trust and policies | Delivery terms, FAQs, support, reward incentives | Technology claims dominate, no customer reassurance | Honest preview, straightforward FAQ and constraints |
| Service discovery | Extensive service menus and related items | Too many disconnected advanced tools | Related category links and 16-network grid |

## Design decisions
1. Retail atmosphere: bright neutral canvas, expressive pastel platform merchandising, clear hierarchical typography.
2. Product-first copy, not developer documentation. "You are selecting Instagram followers" should never be ambiguous.
3. Keep quantity, total and action visible in one layout without requiring a dashboard login.
4. On small phones, stack package selector and summary in a clear sequence; large tap targets and simple navigation.
5. Do not fabricate rating badges, transaction counts, discount percentages or fulfilled customers.
6. Use the *structure* of the purchasing journey, not copyrighted design assets or Graming copy.
7. Do not represent sample follower/engagement products as currently purchasable or compliant.

## Existing architecture respected
- Shopify-like demo cart held in browser storage and server-calculated sample quotes.
- /api/demo/catalog is a separate, expressly simulated universe.
- /api/catalog is reserved for actual supplier data, currently awaiting API credentials.
- /api/orders remains disabled. No checkout, transactions, customer accounts or supplier orders.
- Previously built /discover, /explore, /tools, /help, /operations are retained as secondary utility screens.

## Future critical gates
Authenticated supplier service availability and type/price, policy review, merchant processor approval, real customer/order ledger, signed checkout webhooks, safe fulfillment state machine, refunds and transparent customer support.
