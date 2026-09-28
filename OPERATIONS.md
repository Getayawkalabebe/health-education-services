# HES operations and launch runbook

## What is implemented

Payment and calendar adapters, signed Stripe webhook verification, idempotent paid-order persistence, purchase-linked coaching booking, atomic session reservations, structured error events, a liveness endpoint, and preview-safe defaults. Run the schema migration before enabling live mode.

## Account-dependent launch checks — not completed locally

1. Configure separate staging Stripe, Cal.com, and database accounts. Set LIVE_MODE=true but PUBLIC_INDEXING=false. Protect staging at the host.
2. Confirm every coaching SKU and session count. Preview amounts must not become live prices automatically. Approve sensor pricing, stock, shipping rate, exact package, and manufacturer eligibility information.
3. Test successful, cancelled, declined, delayed, and refunded payments. Replay signed webhooks. Confirm a single paid order per checkout.
4. Buy a coaching bundle in Stripe test mode. Follow its private scheduling link; verify purchase-email enforcement, exhausted credit rejection, parallel requests, and the remaining session count. Check both confirmed and approval-pending calendar responses.
5. Test calendar conflicts, provider timeout, confirmation email, reminders, cancellation, and rescheduling. Inspect pending requests before any retry. An ambiguous calendar outcome retains its reservation to prevent double booking.
6. Enable Stripe receipts and verify delivery. The website does not send a separate transactional email. The private checkout confirmation URL is the recovery route for session scheduling; staff can retrieve it from Stripe for the verified purchaser. Do not log or share it publicly.

## Daily order workflow

- Review Stripe payments against `orders`, including donations, and investigate missing webhook persistence.
- For physical orders, verify shipping details in Stripe, stock, and device eligibility before fulfillment. Record the carrier/tracking through the approved operational process; do not treat payment as shipment.
- Update `fulfillment_status` through a restricted database workflow after each confirmed action. There is no public admin interface.
- Handle cancellation requests by contacting the customer and calendar provider. The business policy is non-refundable payments. Escalate payment disputes and faulty/missing products to the owner; do not promise a remedy automatically.
- For a cancelled paid session, verify the Cal.com booking is cancelled before restoring a credit. Use the original `hesRequest` key to identify `coaching_reservations`. Release it in a database transaction and record the reason in the restricted case record. Never automatically release a reservation after a timeout.
- Payment refunds/disputes are checked against Stripe each time a private coaching purchase is verified. Existing appointments still require staff reconciliation. Automated refund/cancellation synchronization is not implemented.

## Monitoring

Configure hosting log alerts for `api.failure` and `webhook.persistence_failed`. Poll `/api/health` for liveness; this endpoint does not certify provider health. Alert on non-2xx webhook responses and pending booking requests older than the team's agreed response window. Logs intentionally omit customer names, emails, medical data, tokens, and request bodies.

## Backup and recovery drill

Enable managed database backups and choose retention with the business owner. Restore a backup into an isolated staging database. Compare table counts and representative order/entitlement relationships. Replay missing Stripe events using test credentials. Confirm that restored booking requests do not create duplicate appointments. Record date, operator, recovery time, and discrepancies. No restore drill has been performed by this implementation.

## Data handling

Store scheduling and purchase information only. Medical records must use a separately approved secure intake process, never public forms or ordinary email. Restrict provider accounts, enable MFA, and use separate production credentials. Establish a retention schedule with the owner before deleting records. Preserve unresolved requests and accounting records. Identity-check access/deletion requests, inventory records across providers, and document completion and any retained records.

## Original compromised website

This local rebuild does not clean the old hosting account. Obtain authorized hosting/admin access, preserve evidence and a recovery backup, isolate the compromised installation, investigate injected posts/plugins/users, patch the entry point, rotate affected credentials, and verify the restored site before DNS cutover. No old-site cleanup is claimed.

## Content still requiring owner sign-off

- Exact coaching fee rules and session counts for the $250/$360 tiers.
- Sensor price, shipping charges/delivery estimates, stock, and device-support handling.
- Service-location eligibility and the final rescheduling process.
- Retention periods, authentic workshop photography, testimonial consent, authorized partner artwork, and clinician-reviewed authored articles.

## Release checks

Run format:check, lint, typecheck, test, build, dependency audit, and browser tests. Test 320px reflow, keyboard-only operation, 200% text enlargement, 400% zoom, and a screen reader on staging. Record Lighthouse/Core Web Vitals on the optimized public build; development timings are not production measurements. Enable PUBLIC_INDEXING=true only on the approved public deployment.
