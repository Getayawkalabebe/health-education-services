# Deploy Health Education Services

## 1. Install and validate

From the extracted `hes-website` folder, with Node.js 22.13+ installed:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run typecheck
npm test
npm run build
npm run dev
```

The last command starts http://localhost:3000. Stop it with Ctrl+C when needed. Keep `.env.local` private; it is excluded from Git. To serve the optimized build instead, use `npm start` after building.

## 2. Push to GitHub

Install Git and GitHub CLI first. These commands create a new private repository; choose another repository name if it already exists in your account.

```powershell
git init -b main
git add .
git commit -m "Build Health Education Services website"
gh auth login
gh repo create health-education-services --private --source=. --remote=origin --push
```

## 3. Deploy the preview to Vercel

```powershell
npx vercel login
npx vercel link
npx vercel env add LIVE_MODE production
npx vercel env add NEXT_PUBLIC_SITE_URL production
npx vercel --prod
```

Enter `false` for LIVE_MODE and the HTTPS domain assigned to this Vercel project for NEXT_PUBLIC_SITE_URL. Link the project first so its domain is known. Next.js is detected automatically. Use the project root, the `npm run build` build command, and Node.js 22.x or newer. Connect the GitHub repository in Vercel Project Settings → Git to deploy future pushes automatically. For a GitHub import, select this directory as the root if you place it inside a larger repository.

## 4. Configure live providers

Create a Neon Postgres database and place DATABASE_URL in `.env.local`, then run:

```powershell
npm run db:setup
```

Create three active one-time USD Stripe prices corresponding to the approved CGM offering, one coaching session and three-session bundle. The deployed storefront reads their real amounts from Stripe. Do not use illustrative prices as approved business pricing.

Create Cal.com event types with durations of 20 minutes (discovery), 60 minutes (coaching), and 60 minutes (nutrition). Configure availability, meeting location, attendee email, cancellation rules and reminders in Cal.com. Set their numeric event IDs and API key below. This code supports an individual event type and name/email attendee fields; adapt it if your event requires extra questions.

Add secrets interactively, never in source code:

```powershell
npx vercel env add DATABASE_URL production
npx vercel env add RATE_LIMIT_SALT production
npx vercel env add STRIPE_SECRET_KEY production
npx vercel env add STRIPE_WEBHOOK_SECRET production
npx vercel env add STRIPE_PRICE_CGM production
npx vercel env add STRIPE_PRICE_COACHING production
npx vercel env add STRIPE_PRICE_BUNDLE production
npx vercel env add CAL_API_KEY production
npx vercel env add CAL_EVENT_DISCOVERY production
npx vercel env add CAL_EVENT_COACHING production
npx vercel env add CAL_EVENT_NUTRITION production
npx vercel env add CONTACT_EMAIL production
```

Generate a random RATE_LIMIT_SALT, for example `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Keep it secret.

Register a Stripe webhook at `https://YOUR-DOMAIN/api/webhooks/stripe` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Enter its signing secret as STRIPE_WEBHOOK_SECRET. Enable Stripe email receipts in your account. Test duplicate webhook delivery and verify one order record per session. Inspect provider dashboards and database records for reconciliation; a success-page visit alone does not perform fulfillment.

Sensor sales are disabled by default. Before enabling them, approve exact model/SKU, compatibility, eligibility, price, stock, permitted sales region, fulfillment procedures, shipping and returns. Current shipping support is US-only and uses a configured Stripe shipping rate. Update the catalog wording to identify the approved model and package quantity.

```powershell
npx vercel env add STRIPE_SHIPPING_RATE_ID production
npx vercel env add CGM_SALES_ENABLED production
npx vercel env add STRIPE_AUTOMATIC_TAX production
```

Only enter `true` for CGM_SALES_ENABLED after readiness review. Enable Stripe automatic tax only when configured for your business. Donations do not claim tax deductibility.

## 5. Test in staging, then enable live mode

Use a separate HTTPS staging deployment with Stripe test credentials, a test database and dedicated Cal.com test events. Set LIVE_MODE=true there to exercise adapters; this flag chooses the real adapters even when the Stripe key is a test key. Do not point booking tests at a production calendar. Keep staging access protected and block indexing.

Verify successful/cancelled/failed payment paths, duplicate requests, webhook retries, database outage handling, simultaneous slot conflicts, confirmation emails, refunds and fulfillment. An ambiguous booking response deliberately remains pending to avoid duplicate bookings; reconcile it in Cal.com using its `hesRequest` metadata before retrying. Review unresolved pending records regularly.

Before public launch, finalize business contact details, shipping/returns/refund and appointment policies, privacy retention periods, provider data-processing arrangements, product specifications and a full accessibility review. Configure database backups, provider error monitoring and daily order reconciliation. Periodically expire obsolete rate-limit rows and booking request records under your approved retention policy; do not delete unresolved requests.

Once these checks are complete, update LIVE_MODE in Vercel to `true`, use production provider credentials, and redeploy:

```powershell
npx vercel env rm LIVE_MODE production
npx vercel env add LIVE_MODE production
npx vercel --prod
```

Enter `true` at the prompt. Environment changes take effect on a new deployment. NEXT_PUBLIC_SITE_URL must exactly match the public HTTPS origin or mutation origin checks will reject requests.

## Delivery limits

No accounts, public domain, repository or production deployment were created for you. The code includes provider adapters, not configured merchant or scheduling accounts. Live integrations require end-to-end testing with your accounts. The supporting policy pages describe the implementation and require business review. No accessibility certification, HIPAA compliance certification, inventory service, admin portal or automated delivery is implied.
