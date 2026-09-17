# Verification notes

## Completed

- Next.js optimized production build passed, including TypeScript and static page generation.
- Five validation test groups passed: trusted catalog/quantities, contribution bounds, booking consent/details/time, calendar ranges, origin/request keys.
- HTTP smoke checks passed for the homepage, shop, booking, donation, privacy, terms, accessibility, receipt, robots and sitemap.
- Preview checkout, contribution and booking endpoints passed; malformed input, forged prices, untrusted origins and invalid request keys were rejected.
- Browser flow checks passed: coaching filter, add to bag, quantity/subtotal updates, preview checkout; calendar selection, details, consent and preview booking result; custom $75 contribution preview.
- Main pages checked for horizontal overflow at an observed 480 CSS-pixel viewport: none. Browser viewport overrides were reset afterward.
- Large text, reduced-motion handling, visible focus and semantic labels are implemented.

## Not verified with live credentials

- Stripe/Cal.com/Neon production behavior, webhook deliveries, email delivery, real inventory, shipping, refunds and fulfillment.
- Independent WCAG 2.1 AA conformance, screen-reader user testing, external provider accessibility, Lighthouse performance scores.
- Local browser screenshot capture had scaling/cropping artifacts. DOM measurements and browser interactions were usable; no pixel-perfect screenshot certification is claimed.

See DEPLOYMENT.md for live configuration and the launch checks.
