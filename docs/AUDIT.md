# ANM’s OUTDOORS — audit and implementation plan

Audit date: 13 September 2026. Repository wassaw252-dotcom/anms-outdoors, main, baseline 73e6ac0a6447eede061192be11a132a24fbb3e3b. Target theme 183916757289 (anms-outdoors/main), UNPUBLISHED. Live Horizon 183740137769 is outside scope.

## Existing implementation

All five repository files were read and compared with target theme files through Shopify Admin API. Only Shopify-generated JSON formatting differs. No AGENTS.md or existing implementation instructions were present.

| Component | State | Decision |
| --- | --- | --- |
| layout/theme.liquid | Valid basic document, locale, canonical and Shopify injection points | KEEP foundations; extend accessibility, navigation, metadata and assets |
| config/settings_schema.json | Valid theme identity version 0.1.0 | KEEP identity; add configurable brand and collection settings |
| locales/en.default.json | Two valid brand keys | KEEP and extend |
| sections/bootstrap.liquid | Functional starter heading | KEEP file; replace homepage template usage with actual sections |
| templates/index.json | Starter heading only | REPAIR section composition |
| CSS, JS, assets, snippets, settings data | Absent | BUILD |
| Header, motion, menu, cart, search, wishlist | Absent | BUILD |
| Product, collection, page templates | Absent | BUILD |

## Store data

Verified correct store tvrj5j-ae.myshopify.com, MYR. All 12 collection handles inspected. Seven categories: tents-shelters, furniture-comfort, sleeping-relaxation, camp-kitchen-dining, lighting-power, hydration-outdoor-living, gear-essentials. Other handles: frontpage, all-gear, best-sellers, new-arrivals, camp-sets. No collection images. Tents collection has 19 products and Gear & Essentials has 42 at audit time; other collections empty. These are Admin counts, not storefront counts.

First 50 products inspected, all DRAFT; the active-product query returned zero. Preserve all products, statuses, variants, prices and images. No product data mutations. Product checkout testing is constrained by the absence of active storefront products.

Contact is published with contact template. About and Explore exist but are hidden with about/explore template suffixes. Preserve publication state; provide isolated alternative theme views for reviewing editorial content without making global page changes. Main menu contains Home, Catalog, Contact; footer contains Search. Keep global menus unchanged and use theme-local navigation to real resources.

## Implementation order

1. Establish design tokens and accessible shared components.
2. Build branded header, category mega menu, mobile drawer and homepage using supplied assets.
3. Add real collection filters/sort, product/media/variant form, recommendations and search.
4. Implement AJAX cart with server-rendered sections, serialized updates, notes and real checkout.
5. Add local saved gear, optional gesture-activated Web Audio, reduced-motion support.
6. Build editorial Explore/About, contact, newsletter, footer and graceful empty states.
7. Validate theme, JSON, JS, functional failure modes and responsive preview; push meaningful commits only to main; confirm GitHub sync and unpublished status.

## Design direction

UI/UX Pro Max source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill. Read skill, quick reference and pre-delivery checklist. Generated design system for premium outdoor camping ecommerce cinematic: matched E-commerce Luxury, luxury serif hierarchy and feature showcase; rejected Liquid Glass recommendation as conflicting with approved images. Narrow style search verified Organic Biophilic guidance. Apply earth tones and subtle texture, not rounded wellness styling. No matching Liquid stack available; use Shopify's native Liquid guidance.

Primary reference authority: user's six images. Forest #08140e, surface #122218, cream #f3ecdc, muted cream #c1c5b4, olive #58683b, campfire gold #d2af71. Editorial Georgia serif, system sans for controls, condensed display for entrance headline. 44px minimum controls, visible focus, 4.5:1 normal-text contrast, responsive reserved image dimensions, semantic dialogs and details, reduced motion, no audible autoplay. No fabricated commerce claims.
