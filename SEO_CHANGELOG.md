# SEO and Brand Change Log

## 2026-09-14

- `src/lib/brand.ts`, `src/lib/server/content.ts`, and `src/config/site.ts`: added the single `MessagLab` identity and normalized CMS-delivered public strings so existing content cannot reintroduce legacy brand spelling. Technical URLs, asset filenames, email addresses, and API identifiers are preserved.
- Public pages, layouts, landing components, auth/dashboard copy, `llms.txt`, `llms-full.txt`, and social image text: replaced genuine public-facing legacy brand references with `MessagLab`.
- `src/app/(public)/page.tsx`: added stable Organization, WebSite, WebPage, Service, SoftwareApplication, and HowTo relationships using the verified canonical host.
- `src/app/sitemap.ts`: added the indexable `/download-apk` page.
- `src/components/layout/Footer.tsx`, `src/components/layout/Navbar.tsx`, and `src/components/landing/HeroSection.tsx`: replaced nonexistent product routes with homepage section links and kept a compatibility mapping for legacy CMS `/pricing` values.
- `src/app/docs/page.tsx`: removed the unsupported `/api/docs` claim and described the currently verified product documentation scope.
- `src/components/layout/InfoPageLayout.tsx`: sanitized CMS HTML with an allowlist of legitimate content tags and URL schemes before rendering.
- `src/lib/admin.ts`: removed the client-side `NEXT_PUBLIC_REVALIDATE_SECRET` request field; authenticated admin revalidation remains supported by the existing route.
- `.env.example` and `src/config/site.ts`: documented and honored `NEXT_PUBLIC_SITE_URL`, falling back to the verified `messagelab.tech` host.
- Backend seed content, service labels, email templates, README, and API documentation: normalized genuine brand text to `MessagLab`. Domains, email addresses, package names, database/API identifiers, and `MESSAGELAB_PAIRING` remain unchanged for compatibility.

## Verification

- Frontend `npm run lint`: passed.
- Frontend `npm run build`: passed.
- Backend `npm run typecheck`: passed.
- Backend `npm run build`: passed.

## Product Correctness Phase

- `backend/src/services/device.service.ts` and `backend/src/services/sms.service.ts`: replaced hardcoded device/free-plan assumptions with active MongoDB `PlanConfig` limits for device count, recipients per campaign, daily campaign jobs, and SMS delay.
- `backend/src/models/VerificationToken.ts`, auth controllers/routes, and `frontend/src/app/(auth)/email-change/page.tsx`: added authenticated email-change requests and expiring confirmation tokens without changing existing login or password-reset flows.
- User responses now expose explicit local/Google provider state; the settings UI no longer infers Google accounts from mobile verification.
- Added Cloudinary-backed profile image upload with authenticated multipart handling, 5 MB limit, JPG/PNG/WebP validation, and profile-image priority over Google images.

## Product Correctness Verification

- Backend `npm run typecheck`: passed after plan enforcement and account API changes.
- Frontend `npm run lint`: passed after account UI changes.

## Remaining Product Work

- OTP API/webhook is not implemented: no OTP model, provider contract, verification endpoint, webhook authentication, or usage policy exists in the current backend. Implementing it requires API authentication and commercial/plan policy decisions.
- Existing MongoDB CMS rows are not migrated by source changes; frontend normalization protects public rendering, while backend seed values apply to new environments.

## Product Completion Phase

- `backend/src/services/device.service.ts`: wrapped new-device admission in a MongoDB transaction after pairing-code claim, preventing concurrent requests from exceeding the active plan device limit.
- `backend/src/models/SmsDailyUsage.ts` and `backend/src/services/smsUsage.service.ts`: added an atomic per-user/day SMS reservation with a unique MongoDB index; campaign and OTP delivery now reserve usage before queueing.
- `backend/src/controllers/sms.controller.ts`, `backend/src/routes/sms.routes.ts`, and frontend SMS services/composer: added `POST /api/v1/sms/single` and wired the existing Single composer mode to it while reusing campaign/job delivery.
- `backend/src/models/ApiCredential.ts`, API-key controllers/routes/middleware: added hashed, revocable customer API credentials with one-time secret display and audit logging.
- `backend/src/models/OtpVerification.ts`, `OtpDailyUsage.ts`, `otp.service.ts`, and versioned OTP routes: added plan-gated OTP creation and verification with salted hashes, five-minute expiry, five attempts, account/day and phone/day controls, audit logs, and Android gateway delivery.
- `backend/src/models/PlanConfig.ts`, admin plan validation/controller, seed defaults, and frontend Plan Manager: added admin-controlled API access, OTP enablement, and daily OTP quotas.
- Public documentation and `API_DOCUMENTATION.md`: documented only the implemented developer key and OTP endpoints; explicitly states that webhooks are not enabled.
- Added the authenticated Developer API dashboard with one-time secret display, copy feedback, revoke confirmation, documentation access, plan policy, and backend-derived daily SMS/OTP usage.
- Added bounded OTP resend and delivery-status endpoints backed by the linked SMS campaign state.
- Added SMS reservation release on campaign/job/queue failure, explicit Redis queue failure handling, and per-user `Idempotency-Key` handling for bulk and single SMS.
- Added one-time scheduled SMS campaigns with atomic due-job claiming and the normal SMS service enforcement path. Recurring automation is intentionally not enabled.
