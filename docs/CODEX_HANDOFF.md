# ANM’s OUTDOORS — Codex handoff

Updated: 13 September 2026.

## Project and deployment identity

- Project: **ANM’s OUTDOORS** — Built for the Wild.
- Repository: **wassaw252-dotcom/anms-outdoors**
- Branch: **main**. Work and push only on this branch in this repository.
- Latest implementation commit: **16809c21fec3751e4d5a2db6fe49421ee5b403e9** — `Build branded outdoor storefront on audited Shopify starter`.
- That implementation commit was successfully pushed to `origin/main`. This handoff is a subsequent documentation-only commit; use `git log -1` for the latest repository commit.
- Shopify store: **tvrj5j-ae.myshopify.com**, admin name **My Store 2**, currency **MYR**.
- Only permitted theme: **anms-outdoors/main**, ID **183916757289**, last verified **UNPUBLISHED**.
- Preview entry: https://tvrj5j-ae.myshopify.com/?preview_theme_id=183916757289
- Storefront is password-protected. An authorized preview was opened from this draft theme’s Shopify editor after the user signed in. Obtain a fresh preview link through the editor if needed; do not persist passwords or preview access tokens in the repository.
- **Do not publish. Do not modify live Horizon (183740137769), other draft themes, other stores, `anms-website`, or unrelated ANM repositories.**

## Source of truth and scope

Use the current committed repository, this handoff, and [AUDIT.md](AUDIT.md). The audit describes the original five-file starter at baseline `73e6ac0a6447eede061192be11a132a24fbb3e3b`; its “absent / BUILD” rows are historical findings, not outstanding implementation work.

**Core storefront coding is largely complete. Do not rebuild completed sections or redesign the approved direction.** Remaining work is focused validation, Shopify preview QA, mobile polish and integration testing. Repair only demonstrated defects.

**Inspect only files relevant to each future task. Do not re-audit the whole repository unless explicitly asked.** Read this handoff first, identify the specific failing flow, and inspect its section/snippet plus relevant shared CSS or JavaScript. Expand the inspection only when a concrete dependency requires it.

Product sourcing is outside Codex scope. **Do not modify Shopee/CJ sourcing data**, products, prices, variants, descriptions, images, collection membership or product statuses as part of theme QA. Do not activate draft products merely to populate a preview. Never invent products, reviews, ratings, specifications, discounts, stock or shipping promises.

## Completed implementation — preserve and extend

The major implementation is committed and pushed; these features are implemented, but that does not imply end-to-end verification:

| Feature | Relevant files to preserve |
| --- | --- |
| Native Shopify Liquid layout, SEO foundations, locale strings, brand settings | `layout/theme.liquid`, `config/settings_schema.json`, `locales/en.default.json` |
| Forest/olive/cream design system, responsive rules, focus styles, reduced-motion rules | `assets/theme.css` |
| Shared dialog, AJAX cart, saved gear, variant/media and Web Audio interactions | `assets/theme.js` |
| Original supplied campsite image and logo with preserved proportions | `assets/anm-campsite.jpg`, `assets/anm-logo.jpg`, `snippets/logo.liquid` |
| Header, seven-category mega menu, mobile navigation, account/cart/search links | `sections/header.liquid`, `snippets/categories.liquid`, `snippets/icon.liquid` |
| Cinematic entrance and Brighter Tomorrow story | `sections/entrance.liquid`, `sections/home-story.liquid` |
| Shop by Adventure, dynamic Featured Gear and honest empty states | `sections/home-categories.liquid`, `sections/featured-gear.liquid`, `snippets/product-card.liquid` |
| Four Camp Sets inspiration pathways, deeper-connection story and Explore teaser | `sections/camp-pathways.liquid`, `sections/brand-story.liquid`, `sections/explore-teaser.liquid` |
| Homepage composition | `templates/index.json` |
| Real collection navigation/counts/sorting/filters, pagination, mobile filter drawer | `sections/main-collection.liquid`, `snippets/filters.liquid`, `templates/collection.json` |
| Product media, variant selector, quantity, product form, optional accelerated checkout, description and accordions | `sections/main-product.liquid`, `templates/product.json` |
| Shopify recommendations and configured Complete Your Camp collection | `sections/product-recommendations.liquid`, `sections/featured-gear.liquid`, `templates/product.json` |
| AJAX cart drawer plus standard cart page, quantity/removal, notes, totals and Shopify checkout form | `sections/cart-drawer.liquid`, `sections/main-cart.liquid`, `snippets/cart-content.liquid`, `templates/cart.json` |
| Shopify product search and search overlay | `sections/main-search.liquid`, `snippets/search-form.liquid`, `snippets/utility-dialogs.liquid`, `templates/search.json` |
| Local-browser Saved Gear and product-card retrieval | `sections/saved-gear.liquid`, `sections/saved-product.liquid`, `templates/index.saved.json` |
| About and Explore editorial pages and isolated preview views | `sections/editorial.liquid`, `templates/page.about.json`, `templates/page.explore.json`, `templates/index.about.json`, `templates/index.explore.json` |
| Contact form, newsletter, support strip and footer | `sections/contact.liquid`, `sections/footer.liquid`, `templates/page.contact.json` |
| Generic page, 404 and collection directory | `sections/main-page.liquid`, `sections/not-found.liquid`, `sections/list-collections.liquid`, corresponding templates |

The original `sections/bootstrap.liquid` and existing brand translation keys were retained. The bootstrap section is no longer the homepage composition. Do not mistake it for the current storefront or remove it without a relevant reason.

No React, Next.js, Tailwind, GSAP or other storefront framework was introduced. Retain the native Liquid/CSS/JavaScript architecture and supplied visual direction.

## Known limitations and store state

- At audit time the first 50 products returned were drafts, and a separate active-product query returned zero. This was not a full enumeration of every draft product. Existing products and sourcing records were not changed.
- Seven category handles are verified: `tents-shelters`, `furniture-comfort`, `sleeping-relaxation`, `camp-kitchen-dining`, `lighting-power`, `hydration-outdoor-living`, `gear-essentials`.
- Other verified handles: `all-gear`, `best-sellers`, `new-arrivals`, `camp-sets`, `frontpage`.
- At audit time Tents & Shelters had 19 Admin products and Gear & Essentials had 42; the other collections were empty. Admin counts are not storefront availability. All collection images were absent, so the implementation uses branded icon fallbacks rather than fabricated product photography.
- Featured Gear defaults to `all-gear`; Complete Your Camp uses `camp-sets`. Empty collections intentionally show honest empty states. Camp pathways are inspiration links, not configured product bundles.
- About and Explore pages already exist but are hidden. Global page publication and navigation menus were left unchanged. Theme-local `/?view=about` and `/?view=explore` provide reviewable editorial views; `/?view=saved` provides Saved Gear.
- Product Features and Specifications currently use neutral fallback text. Reviews have an honest unavailable state. Accelerated checkout defaults off. Verify media and selling-plan behavior against suitable real products before claiming support is fully tested.
- Saved Gear is browser-local only, with no account synchronization. Theme audio is generated with Web Audio and starts only after a gesture; sound-failure and reduced-motion handling are implemented but still need browser QA.
- Actual checkout/payment readiness, shipping configuration, product sourcing and catalog publication are not established by this theme work.

## Validation completed

- Read and compared all five original repository files against the exact connected unpublished theme before implementation.
- Verified the target store and draft theme identity, collection handles, relevant page/menu state, sampled draft products and absence of active products at that time.
- `node --check assets/theme.js` passed.
- Shopify Liquid skill validator reported **VALID across 50 files** (Liquid, JSON, CSS and JavaScript). A subsequent run refreshed official Shopify schema resources and again reported **VALID / 50 files**. Static theme checks do not establish browser behavior or transaction correctness.
- Local validation setup is ignored under `.tooling/`; it contains a copy of the supplied validator and installed Shopify checker dependencies. The original installed skill validator lacked dependencies. `.tooling/validation.txt` contains the latest local validation output and is not committed or shipped.
- Implementation commit `16809c21fec3751e4d5a2db6fe49421ee5b403e9` was successfully pushed to `main`.

## Not fully validated yet

- **GitHub → Shopify synchronization of the new implementation has not yet been confirmed.** The last observed storefront preview still showed the starter while deployment work was underway.
- Updated-theme desktop/mobile visual QA, reference comparison, image loading and layout stability.
- Full navigation and editorial view routing within the synced theme.
- Mobile menu/search/filter/cart behavior; touch target measurements, overflow, orientation and keyboard/focus restoration.
- Product media/video/model display, variant changes, pricing, selling plans, quantity rules and recommendations using suitable real Shopify data.
- AJAX add/change/remove, concurrent updates, notes, server errors, stale responses and checkout handoff.
- Saved Gear persistence, unavailable-product handling and storage/network failure states.
- Search results, filter/sort persistence, pagination, contact/newsletter success/error flows and account routing.
- Audio gesture behavior, mute/unmute, background-tab handling, blocked audio and reduced-motion mode.
- Measured performance, contrast and assistive-technology behavior. Do not claim full accessibility or performance certification from static checks.

## Next priority tasks

1. **Confirm the implementation commit has synced to theme 183916757289 and that it remains unpublished.** Inspect this theme’s status and a small relevant asset/template sample; do not inspect or edit unrelated themes.
2. Open its authorized preview and verify the homepage at desktop and mobile sizes (375, 768, 1024 and 1440px as appropriate). Record concrete defects and apply only targeted mobile/interaction repairs.
3. Check navigation, collection empty states, search, Saved Gear, About/Explore views and contact/footer flows. Avoid submitting messages or newsletter subscriptions as test data without explicit authorization.
4. Validate product/cart integration using an authorized existing product preview where supported, or isolated local tests clearly separated from store data. If no suitable product is accessible, report that limitation instead of changing catalog status or inserting fake inventory.
5. Test keyboard access, dialog focus, reduced motion, audio failure modes and meaningful cart/storage/network error paths; rerun only checks relevant to any fixes.
6. Commit meaningful, focused fixes to `main`, confirm Shopify sync again, and provide the unpublished preview for user review. **Do not publish.**

The current handoff task is documentation-only. Do not resume the QA/build sequence until the user requests the next task.
