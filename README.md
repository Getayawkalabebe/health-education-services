# Health Education Services

A complete Next.js website for personalized health education, coaching, Dexcom tools and community outreach.

## Stack

- Next.js 16 App Router + React 19 + TypeScript: server-rendered content, metadata, optimized images and Node route handlers in one Vercel-ready project.
- Tailwind CSS 4 plus custom responsive CSS: a consistent blue/green design system with large readable typography.
- Motion: lightweight reveal animations that respect reduced-motion preferences.
- React Context: persistent shopping bag without a heavyweight state library.
- Stripe Checkout, Cal.com and Neon Postgres: server-side adapters for payments, scheduling and durable request records.

## Run locally

Use Node.js 22.13 or newer and npm. In this directory:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. Do not overwrite an existing configured `.env.local`.

## Pages

- `/` — homepage, services, qualifications, Dexcom partnership, community outreach.
- `/book` — session selection, calendar, time zones, details, result.
- `/shop` — product filtering, details dialog, persistent bag and checkout.
- `/donate` — preset/custom one-time contributions.
- `/checkout/success` — server-verified payment status.
- `/privacy`, `/terms`, `/accessibility` — supporting information.

## Preview and live mode

The default `LIVE_MODE=false` is an interactive demonstration. It does not book appointments, charge cards, or save booking details. Prices and availability are illustrative. A visible preview banner and result messages explain this.

The live adapters are implemented, but require your own Stripe, Cal.com and Neon accounts and verified configuration. Live payment and calendar providers have not been exercised with account credentials in this delivery. Follow DEPLOYMENT.md before enabling live mode. Policy copy and actual product specifications must be finalized before launch.

## Commands

```powershell
npm run typecheck
npm test
npm run build
npm start
```

With the development server running in preview mode, `node scripts/smoke-test.mjs` checks pages, endpoints and rejected input. It deliberately expects preview responses; do not run it against a live service.

## Structure

`app/` contains pages, metadata and API routes. `components/` contains interactive forms and the shared shell. `lib/` contains validation, catalog and provider adapters. `db/schema.sql` contains the database tables. `tests/` covers transaction input validation. `public/images/` holds the supplied logo and generated illustrative photography.

## Security and operations

Prices are resolved on the server from Stripe price IDs; browser prices are never trusted. Checkout uses Stripe-hosted payment entry. Webhooks verify raw-body signatures, record events and orders transactionally, and tolerate retries. Booking requests recheck availability and use persistent request IDs. Origin validation, strict input schemas and persistent rate limits protect live mutations. No medical records are requested or stored by these forms. This is not a patient portal and makes no HIPAA compliance claim.

Orders are recorded as `awaiting_review`; shipping, refunds and coaching fulfillment are managed by HES through its provider dashboards. There is no custom admin portal, inventory synchronization or automated fulfillment service. See deployment notes for required monitoring and reconciliation.

## Accessibility

Body text is generally 20–22px, with larger headings, semantic sections, labeled forms, keyboard-operable dialogs, visible focus and reduced-motion support. The target is WCAG 2.1 AA. An independent accessibility audit and assistive-technology testing are still required before asserting conformance.

## Assets

The HES logo is supplied by the owner. Photography is AI-generated illustrative artwork, not real client testimonials or representations of actual staff. Dexcom is referenced based on the partnership described in the brief; use of its trademarks and the exact sensor model must be approved by HES before launch.
