# Morphogenesis homepage

| Source | Local route | Implementation |
| --- | --- | --- |
| https://www.morphogenesis.org/ | `/` | `src/app/page.tsx`, `src/components/sites/morphogenesis/` |

The homepage uses Poppins, an autoplaying hero, a fixed navigation bar with an expandable menu, a shared S.O.U.L. disclosure, hover-driven expertise previews, client and press logo tracks, eight project cards, a testimonial carousel, and desktop and mobile news layouts. Local media is stored in `public/sites/morphogenesis/`. See [assets.json](assets.json) for source URLs.

Run `npm run dev` for development or `npm run check` for lint, type checking, and production build. Internal links use the captured local routes. The newsletter validates email addresses locally and directs visitors to the live website for subscription.

## Full-site routes

The local site includes all 560 routes in the [production sitemap inventory](route-inventory.json) and six additional pages linked from the site. The local route follows each captured source pathname. See the [archive route manifest](../../../src/components/sites/morphogenesis/archive/routes.json) for the files behind each route, or open the capture for that pathname in `/workspace/scratch/morphogenesis-captures/`.

| Part | Location |
| --- | --- |
| Homepage and privacy policy | `src/app/page.tsx` and `src/app/privacy-policy/page.tsx` |
| Other public routes | `src/app/[...morphPath]/route.ts` |
| Editable page markup, header, and footer | `src/components/sites/morphogenesis/archive/` |
| Shared styles, media, and browser interactions | `public/sites/morphogenesis/archive/` |

Run `npm run dev -- --port 4173` to preview the local site. The contact and newsletter forms validate locally and direct visitors to the live service for submission. The careers portal, external articles, and third-party embeds retain their destinations. Listing search and pagination use the captured catalogue.

The [archive asset inventory](archive-assets.json) maps 2,336 additional source assets to verified local files. The original external stormwater drainage manual link is preserved and its provider returned HTTP 404 during capture.
