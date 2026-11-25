# Morphogenesis design QA

final result: passed

Compared the [source homepage](https://www.morphogenesis.org/) with the local Next.js route `/` in Chromium at 1440 × 900 and 390 × 844 CSS pixels with device scale 1. Also exercised the local layout at 1920 × 1080. The source is on the left in each comparison. Hero comparisons use the same video frame and headline. Animated logo positions and counting progress vary in the section captures.

| View | Desktop | Mobile |
| --- | --- | --- |
| Hero and typography | [Desktop hero](docs/research/morphogenesis/desktop-hero-comparison.jpg) | [Mobile hero](docs/research/morphogenesis/mobile-hero-comparison.jpg) |
| Menu and controls | [Desktop menu](docs/research/morphogenesis/desktop-menu-comparison.jpg) | [Mobile menu](docs/research/morphogenesis/mobile-menu-comparison.jpg) |
| Sections, cards, and footer | [Desktop sections](docs/research/morphogenesis/desktop-sections.jpg) | [Mobile sections](docs/research/morphogenesis/mobile-sections.jpg) |

The first comparison showed taller project images and testimonial controls in the wrong location. The revised cards use the measured 16:9 crops and the updated testimonials place controls at the image sides on mobile and the panel edges on desktop. The mobile news carousel now has arrow controls alongside native horizontal scrolling. The final pass showed the source type, project imagery, section order, responsive layout, and main navigation states.

Browser checks covered opening and closing the menu, expanding a submenu, revealing the S.O.U.L. details, changing the expertise preview, project destinations, moving between testimonials and mobile news cards, newsletter email feedback, and returning to the top. The tested sizes had no horizontal document overflow, failed asset requests, or uncaught page errors. `npm run check` passed lint, type checking, and the production build.

Remaining differences include minor spacing, icon, and animation timing differences. The newsletter points visitors to the live site to subscribe.


## Full-site routes

The production build served all 566 mapped routes. A route sweep checked HTTP responses, sitemap coverage, local navigation destinations, and references to saved media. Both viewport sweeps completed with no uncaught page errors or horizontal overflow. Chromium checks at 1440 × 900 and 390 × 844 covered navigation from the homepage, live project filtering, the British School project gallery, leadership biographies, contact validation, and news search.

The comparison images use saved source HTML and matching media on the left and the running Next.js site on the right. Both sides use the same viewport and fonts.

| Page | Desktop | Mobile |
| --- | --- | --- |
| Featured Projects | [Compare](docs/research/morphogenesis/archive-comparisons/desktop-featured-projects-comparison.jpg) | [Compare](docs/research/morphogenesis/archive-comparisons/mobile-featured-projects-comparison.jpg) |
| The British School | [Compare](docs/research/morphogenesis/archive-comparisons/desktop-projects-the-british-school-comparison.jpg) | [Compare](docs/research/morphogenesis/archive-comparisons/mobile-projects-the-british-school-comparison.jpg) |
| Leadership | [Compare](docs/research/morphogenesis/archive-comparisons/desktop-leadership-comparison.jpg) | [Compare](docs/research/morphogenesis/archive-comparisons/mobile-leadership-comparison.jpg) |

The contact and newsletter layouts and client-side validation are local. Form submissions and job listings use the original services.

All 2,336 saved archive assets were verified. One external PDF from the source returned HTTP 404 and retains its original link.
